import os
import json
import re
import html

file_path = '/Users/bangyen/Documents/repos/bangyen.github.io/telephone_country_codes.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target the specific table by searching for the header text exactly as it appears
header_marker = 'Serving'
# Find the table that contains this string
table_start = content.rfind('<table', 0, content.find(header_marker))
table_end = content.find('</table>', table_start)

if table_start == -1 or table_end == -1:
    print(f"Could not find table containing {header_marker}")
    exit(1)

table_content = content[table_start:table_end]

data = []
# Use a more robust pattern for rows and cells
tr_pattern = re.compile(r'<tr.*?>(.*?)</tr>', re.DOTALL)
td_pattern = re.compile(r'<td.*?>(.*?)</td>', re.DOTALL)
tag_pattern = re.compile(r'<.*?>', re.DOTALL)

for tr_match in tr_pattern.finditer(table_content):
    tr_content = tr_match.group(1)
    # Check if this row has cells
    td_matches = td_pattern.findall(tr_content)
    
    if len(td_matches) >= 2:
        country_raw = td_matches[0]
        code_raw = td_matches[1]
        
        # Clean country
        country = tag_pattern.sub('', country_raw)
        country = html.unescape(country).strip()
        # Remove any leading special characters (like non-breaking spaces)
        country = country.replace('\xa0', ' ').strip()
        country = re.sub(r'\[.*?\]', '', country)
        
        # Clean code
        code = tag_pattern.sub('', code_raw)
        code = html.unescape(code).strip()
        code = code.replace('\xa0', ' ').strip()
        code = re.sub(r'\[.*?\]', '', code)
        
        if any(char.isdigit() for char in code):
            # Normalize code: many appear without +, some with parens
            # We want to keep some structure like +1 (242)
            code = re.sub(r'[^0-9+\s(),]', '', code).strip()
            if code and not code.startswith('+'):
                # Handle cases where it might be "1 (242)"
                code = '+' + code
            
            # Extract flag URL
            # Note: Wikipedia uses lazy-loaded images sometimes or different protocols
            # We already saw "//upload.wikimedia.org..."
            flag_match = re.search(r'src="([^"]+)"', country_raw)
            flag = ""
            if flag_match:
                flag = flag_match.group(1)
                if flag.startswith('//'):
                    flag = 'https:' + flag
                elif not flag.startswith('http'):
                    # Probable relative path or something else we don't handle easily
                    flag = ""
            
            if country and code:
                data.append({
                    "code": code,
                    "country": country,
                    "flag": flag
                })

# Deduplicate
seen = set()
unique_data = []
for entry in data:
    key = (entry['country'], entry['code'])
    if key not in seen:
        unique_data.append(entry)
        seen.add(key)

unique_data.sort(key=lambda x: x['country'])
print(json.dumps(unique_data, indent=2))
