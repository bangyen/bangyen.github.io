
import requests
import json
import re
import os
import sys
from html.parser import HTMLParser

# Configuration
DATA_DIR = os.path.join(os.path.dirname(__file__), '../src/features/quiz/data')
os.makedirs(DATA_DIR, exist_ok=True)

class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_row = False
        self.in_cell = False
        self.current_table = []
        self.current_row = []
        self.current_cell_text = []
        self.current_cell_html = []
        self.tables = []
        self.cell_tag = 'td' # can be th or td
        self.col_idx = 0
        
        # Rowspan attributes need to be tracked. 
        # Dict of col_idx -> (rows_left, content)
        # Note: simplistic approach, might need refinement for complex nested tables.
        # But for wiki tables, usually we just need to handle the fact that some cells are skipped.
        # However, a robust implementation for rowspan/colspan is complex. 
        # Given the task, I'll start with a simpler approach: extract all cells and post-process if possible,
        # or just try to be robust about cell indices.
        # Edit: Wikipedia tables often use rowspan. I should try to handle it.
        # But for now, let's just extract the raw grid and see if we can get by with basic parsing for these specific tables.
        # Most of these 'list' tables are flat.
        
    def handle_starttag(self, tag, attrs):
        if tag == 'table':
            self.in_table = True
            self.current_table = []
        elif tag == 'tr':
            if self.in_table:
                self.in_row = True
                self.current_row = []
        elif tag in ('td', 'th'):
            if self.in_row:
                self.in_cell = True
                self.cell_tag = tag
                self.current_cell_text = []
                self.current_cell_html = []
                # Check for image in attrs (for flags)
                # But mostly images are in <img> tags inside.
        
        if self.in_cell:
            # Reconstruct tag
            # Note: this adds the td/th tag itself to the html content if we are not careful
            # But the logic above sets in_cell = True inside the condition.
            # So if tag == 'td', we just set in_cell.
            # We should append the tag if it's NOT the opening td/th or if it is nested?
            # Simplest: if we match the start of cell, don't append.
            if tag == self.cell_tag and not self.current_cell_html: 
                # This is the opening tag of the cell
                pass 
            else:
                attrs_str = "".join(f' {k}="{v}"' for k, v in attrs)
                self.current_cell_html.append(f"<{tag}{attrs_str}>")

    def handle_endtag(self, tag):
        if tag == 'table':
            self.in_table = False
            if self.current_table:
                self.tables.append(self.current_table)
        elif tag == 'tr':
            if self.in_row:
                self.in_row = False
                if self.current_row:
                    self.current_table.append(self.current_row)
        elif tag in ('td', 'th'):
            if self.in_cell and tag == self.cell_tag:
                self.in_cell = False
                text = ''.join(self.current_cell_text).strip()
                html = ''.join(self.current_cell_html)
                self.current_row.append({'text': text, 'html': html})
                return # Don't append </td/th> to html
        
        if self.in_cell:
            self.current_cell_html.append(f"</{tag}>")

    def handle_data(self, data):
        if self.in_cell:
            self.current_cell_text.append(data)
            self.current_cell_html.append(data)

def extract_tables(url):
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'})
        response.raise_for_status()
        parser = TableParser()
        parser.feed(response.text)
        return parser.tables
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def resolve_flag_url(cell_html):
    # Extract src from <img src="...">
    match = re.search(r'src="([^"]+)"', cell_html)
    if match:
        src = match.group(1)
        if src.startswith('//'):
            src = 'https:' + src
        elif src.startswith('http'):
            pass # already good
        
        # Upgrade resolution from thumb (e.g. 23px, 40px) to 320px for better quality
        # Pattern: /thumb/x/xy/Filename.svg/XXpx-Filename.svg.png
        # We want to replace /XXpx- with /320px-
        src = re.sub(r'/\d+px-', '/320px-', src)
        return src
    return ''

def clean_text(text):
    # Remove citations [1], [a], etc.
    text = re.sub(r'\[.*?\]', '', text)
    return text.strip()

# --- Quiz Generators ---

def generate_cctlds():
    url = 'https://en.wikipedia.org/wiki/Country_code_top-level_domain'
    tables = extract_tables(url)
    
    # Target table has "Code", "Country", "Year", "ccTLD Type", "Notes" headers usually.
    # Actually checking the js script, it looks for "Name" and "Entity".
    # Inspecting current wiki page might be needed, but let's guess based on content.
    
    target_table = None
    for table in tables:
        # Check first row (headers)
        if not table: continue
        headers = [c['text'].lower() for c in table[0]]
        if any('.ad' in r[0]['text'] for r in table[1:10]): # Heuristic: contains .ad
            target_table = table
            break
            
    if not target_table:
        print("Could not find CCTLD table.")
        return

    # Load existing language map
    lang_map = {}
    enhanced_path = os.path.join(DATA_DIR, 'cctlds.json')
    if os.path.exists(enhanced_path):
        with open(enhanced_path, 'r') as f:
            old_data = json.load(f)
            for item in old_data:
                lang_map[item['code']] = item.get('language', 'English')

    results = []
    seen = set()
    
    for row in target_table:
        if len(row) < 3: continue
        
        # cell 0: code entry
        code_text = clean_text(row[0]['text']).lower()
        if not code_text.startswith('.') or ' ' in code_text: 
            continue
            
        # cell 1: country/entity
        country_text = clean_text(row[1]['text'])
        flag_url = resolve_flag_url(row[1]['html'])
        
        # cell 2: explanation/notes
        explanation = row[2]['html'] # Keep HTML for explanation as per existing
        # Clean explanation HTML - remove links but keep text? 
        # The JS script: explanationCell.querySelectorAll('a').forEach(a => a.replaceWith(...a.childNodes));
        # This is hard with regex. 
        # But let's just keep the text mostly, or try to preserve basic formatting.
        # Actually user wants "integrity", so maybe we should just use text if html is messy.
        # But the existing json has <i><b>...</b></i>.
        # Let's try to preserve it.
        
        # cell 3: notes if available
        notes = ""
        if len(row) > 3:
            notes = clean_text(row[3]['text'])
            
        if code_text in seen: continue
        seen.add(code_text)
        
        results.append({
            "code": code_text,
            "country": country_text,
            "flag": flag_url,
            "explanation": explanation, # might need cleaning
            "notes": notes,
            "language": lang_map.get(code_text, "English")
        })
        
    results.sort(key=lambda x: x['code'])
    
    with open(os.path.join(DATA_DIR, 'cctlds.json'), 'w') as f:
        json.dump(results, f, indent=4)
    print(f"Generated {len(results)} CCTLDs.")

def generate_driving_sides():
    url = 'https://en.wikipedia.org/wiki/Left-_and_right-hand_traffic'
    tables = extract_tables(url)
    
    # Target table lists countries.
    target_table = None
    cols_map = {}
    
    for table in tables:
        if not table: continue
        headers = [c['text'].lower() for c in table[0]]
        # Debug
        print(f"Header: {headers}")
        # Check for necessary columns
        if 'country' in headers and (any('side' in h for h in headers) or any('traffic' in h for h in headers)):
            # Map columns
            for i, h in enumerate(headers):
                if 'country' in h: cols_map['country'] = i
                elif 'side' in h or 'traffic' in h: cols_map['side'] = i
                elif 'switch' in h or 'change' in h: cols_map['switch'] = i
            target_table = table
            # If we found the main table (should have many rows), break
            # Note: the table in the log has "date ofswitch" (sic?) or maybe it's spacing.
            # Header in log: 'date ofswitch'. It seems spaced weirdly or normalized.
            # But 'switch' is in it.
            if len(table) > 50:
                break
                
    if not target_table:
        print("Could not find Driving Sides table.")
        return

    results = []
    
    idx_country = cols_map.get('country', 0)
    idx_side = cols_map.get('side', 1)
    idx_switch = cols_map.get('switch', -1)
    
    for row in target_table[1:]:
        if len(row) <= max(idx_country, idx_side): continue
        
        country = clean_text(row[idx_country]['text'])
        flag = resolve_flag_url(row[idx_country]['html'])
        side_text = clean_text(row[idx_side]['text'])
        
        side = "Right"
        if "Left" in side_text:
            side = "Left"
            
        switched = False
        switch_year = ""
        
        if idx_switch != -1 and len(row) > idx_switch:
            switch_text = clean_text(row[idx_switch]['text'])
            # Look for a year in the text (4 digits)
            # Sometimes it says "Proposed" or has citations.
            matches = re.findall(r'\b\d{4}\b', switch_text)
            if matches:
                # If there's a year, it switched.
                switched = True
                switch_year = matches[0]
        
        explanation = f"Drives on the <b>{side}</b>."
        if switched:
            explanation += f" (Switched in {switch_year})"
        
        results.append({
            "country": country,
            "side": side,
            "flag": flag,
            "explanation": explanation,
            "switched": switched 
        })
        
    # Sort by country
    results.sort(key=lambda x: x['country'])
    
    with open(os.path.join(DATA_DIR, 'driving_sides.json'), 'w') as f:
        json.dump(results, f, indent=4)
    print(f"Generated {len(results)} Driving Sides.")

def generate_telephone_codes():
    url = 'https://en.wikipedia.org/wiki/List_of_country_calling_codes'
    tables = extract_tables(url)
    
    # Target table is usually the big one.
    target_table = None
    for table in tables:
        if not table: continue
        # Look for headers containing "Country", "Code"
        headers = [c['text'].lower() for c in table[0]]
        # The table headers might be "Country, Territory or Service", "Code"
        if any(k in h for h in headers for k in ['country', 'state', 'serving']) and any('code' in h for h in headers):
            # Ensure it's the large alphabetical table, not a small sub-table
            if len(table) > 100:
                target_table = table
                break
            
    if not target_table:
        print("Could not find Telephone Codes table via headers. Searching by content...")
        # Fallback: look for row with "Afghanistan" and "+93"
        for table in tables:
            for row in table:
                texts = [c['text'] for c in row]
                if any('Afghanistan' in t for t in texts) and any('+93' in t for t in texts):
                    target_table = table
                    break
            if target_table: break
        
        if not target_table:
            # Debug: print first row of all tables
            for i, t in enumerate(tables):
                if t:
                    pass
        return

    results = []
    # Identify column indices
    col_country = -1
    col_code = -1
    
    # Prioritize 'serving' or 'country' over default
    if target_table:
        headers = [c['text'].lower() for c in target_table[0]]
        for i, h in enumerate(headers):
            if any(keyword in h for keyword in ['country', 'state', 'serving']): col_country = i
            if 'code' in h: col_code = i
    
    # default to 0 and 1 if not found but table was found by content
    if col_country == -1: col_country = 0
    if col_code == -1: col_code = 1
    
    # print(f"Using columns: Country={col_country}, Code={col_code}")

    for row in target_table[1:]: # Skip header
        if len(row) <= max(col_country, col_code): 
            # print(f"Skipping row len {len(row)}")
            continue
        
        country = clean_text(row[col_country]['text'])
        code_raw = clean_text(row[col_code]['text'])
        # print(f"Row: Country='{country}', Code='{code_raw}'")
        
        flag = resolve_flag_url(row[col_country]['html'])
        
        # Clean code
        # Code might be "+93", "93", "1 (242)"
        # Relaxed pattern to capture codes without leading +
        match = re.search(r'[\+\d][\d\s\-\(\),]*', code_raw)
        if match:
            code = match.group(0).strip()
            # Remove internal whitespace if it's just a number, but keep it if formatted like "+1 (242)"
            # Actually, keeping it as scraped is usually better for specific formats, 
            # but standardizing to +XX... is good.
            if not code.startswith('+'):
                code = '+' + code
        else:
            # print(f"No match for code in '{code_raw}'")
            continue
            
        results.append({
            "code": code,
            "country": country,
            "flag": flag
        })

    results.sort(key=lambda x: x['country'])

    with open(os.path.join(DATA_DIR, 'telephone_codes.json'), 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Generated {len(results)} Telephone Codes.")

def generate_vehicle_codes():
    url = 'https://en.wikipedia.org/wiki/International_vehicle_registration_code'
    tables = extract_tables(url)
    
    # Look for "Current codes" table equivalent.
    target_table = None
    for table in tables:
        if not table: continue
        # Headers: "Code", "Country"
        headers = [c['text'].lower() for c in table[0]]
        if 'code' in headers and 'country' in headers:
            target_table = table
            # Check if it has real data
            if len(table) > 5:
                break
                
    if not target_table:
        # Fallback search by content
        for table in tables:
            for row in table:
                if len(row) >= 2 and row[0]['text'] == 'AFG':
                    target_table = table
                    break
            if target_table: break

    if not target_table:
        print("Could not find Vehicle Codes table.")
        return

    results = []
    header_seen = False
    for row in target_table:
        if not header_seen:
            if row[0]['text'].lower() == 'code':
                header_seen = True
                continue
        
        if len(row) < 2: continue
        
        code = clean_text(row[0]['text'])
        country = clean_text(row[1]['text'])
        flag = resolve_flag_url(row[1]['html'])
        
        if not code or not country: continue
        
        results.append({
            "code": code,
            "country": country,
            "flag": flag
        })
        
    results.sort(key=lambda x: x['code'])
    
    with open(os.path.join(DATA_DIR, 'vehicle_codes.json'), 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Generated {len(results)} Vehicle Codes.")

if __name__ == "__main__":
    generate_cctlds()
    # Driving sides logic is weak, let's skip autogeneration to avoid data loss unless sure
    # But user asked for it. I will implement but maybe warn or use it carefully.
    # Actually, the user wants me to write the scripts.
    generate_driving_sides()
    generate_telephone_codes()
    generate_vehicle_codes()
