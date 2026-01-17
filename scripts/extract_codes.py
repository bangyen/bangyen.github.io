
import re
import json

def extract_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the Current codes section
    start_tag = 'id="Current_codes"'
    start_idx = content.find(start_tag)
    if start_idx == -1:
        return []

    # Find the table after this section
    table_start = content.find('<table', start_idx)
    table_end = content.find('</table>', table_start)
    table_content = content[table_start:table_end]

    # Split into rows
    rows = table_content.split('<tr>')[1:] # Skip header
    
    data = []
    for row in rows:
        # Extract columns
        cols = row.split('</td>')
        if len(cols) < 2:
            continue
        
        # Extract Code
        code_raw = cols[0].replace('<td>', '').strip()
        # Remove <sup> tags and their entire content (citations)
        code_raw = re.sub(r'<sup[^>]*>.*?</sup>', '', code_raw, flags=re.DOTALL)
        # Clean up any other remaining tags
        code = re.sub(r'<[^>]+>', '', code_raw).strip()
        # Remove HTML entities and any leftover brackets/parentheses
        code = re.sub(r'&#\d+;', '', code)
        code = re.sub(r'\[.*?\]', '', code)
        code = re.sub(r'\(.*?\)', '', code)
        # Final strip and remove any trailing noise
        code = code.split('\n')[0].strip()
        
        # Extract Country and Flag
        country_col = cols[1].replace('<td>', '').strip()
        
        # Flag URL
        flag_match = re.search(r'src="([^"]+)"', country_col)
        flag = "https:" + flag_match.group(1) if flag_match else ""
        
        # Country Name
        # Usually inside <a> tag
        country_match = re.search(r'<a [^>]+>([^<]+)</a>', country_col)
        if country_match:
            country = country_match.group(1)
        else:
            # Fallback to stripping tags
            country = re.sub(r'<[^>]+>', '', country_col).strip()
            # Remove leading whitespace/entities if any
            country = country.replace('\xa0', ' ').strip()

        if code and country:
            data.append({
                "code": code,
                "country": country,
                "flag": flag
            })
            
    return data

if __name__ == "__main__":
    extracted_data = extract_data('src/data/raw/vehicle_codes.html')
    with open('src/data/vehicle_registration_codes.json', 'w', encoding='utf-8') as f:
        json.dump(extracted_data, f, indent=2)
    print(f"Extracted {len(extracted_data)} entries.")
