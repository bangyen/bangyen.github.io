
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

const DATA_DIR = path.join(process.cwd(), 'src/features/quiz/data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers
function cleanText(text: string): string {
    // Remove citations [1], [a], etc.
    return text.replace(/\[.*?\]/g, '').trim();
}

function resolveFlagUrl(html: string): string {
    if (!html) return '';
    const $ = cheerio.load(html);
    let src = $('img').attr('src') || '';

    if (!src) return '';

    if (src.startsWith('//')) {
        src = 'https:' + src;
    } else if (!src.startsWith('http')) {
        // If it's a relative path, we might ignore it or try to fix it, 
        // but usually wiki images are //upload.wikimedia.org
    }

    // Upgrade resolution
    // Pattern: /thumb/x/xy/Filename.svg/XXpx-Filename.svg.png
    // Replace /XXpx- with /320px-
    src = src.replace(/\/\d+px-/, '/320px-');

    return src;
}

async function fetchTableData(url: string): Promise<cheerio.CheerioAPI> {
    console.log(`Fetching ${url}...`);
    const response = await fetch(url, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const text = await response.text();
    return cheerio.load(text);
}

// Generators

async function generateCCTLDs() {
    const url = 'https://en.wikipedia.org/wiki/Country_code_top-level_domain';
    const $ = await fetchTableData(url);

    // Find the table. Python script looked for .ad
    // We can just iterate all tables and look for one with ".ad" in the first column
    let targetTable: cheerio.Cheerio<cheerio.Element> | null = null;

    $('table').each((_, table) => {
        let hasAd = false;
        $(table)
            .find('tr')
            .slice(0, 10)
            .each((_, row) => {
                const text = $(row).text();
                if (text.includes('.ad')) {
                    hasAd = true;
                }
            });
        if (hasAd) {
            targetTable = $(table);
            return false; // break
        }
    });

    if (!targetTable) {
        console.error('Could not find CCTLD table.');
        return;
    }

    // Load existing language map
    const langMap: Record<string, string> = {};
    const existingPath = path.join(DATA_DIR, 'cctlds.json');
    if (fs.existsSync(existingPath)) {
        try {
            const oldData = JSON.parse(fs.readFileSync(existingPath, 'utf-8'));
            for (const item of oldData) {
                if (item.code && item.language) {
                    langMap[item.code] = item.language;
                }
            }
        } catch (e) {
            console.warn("Failed to load existing cctlds.json for language map", e);
        }
    }

    const results: any[] = [];
    const seen = new Set<string>();

    (targetTable as cheerio.Cheerio<cheerio.Element>).find('tr').each((_, row) => {
        const cells = $(row).find('th, td');
        if (cells.length < 3) return;

        const codeText = cleanText($(cells[0]).text()).toLowerCase();
        if (!codeText.startsWith('.') || codeText.includes(' ')) return;

        const countryText = cleanText($(cells[1]).text());
        const flagHtml = $(cells[1]).html() || '';
        const flagUrl = resolveFlagUrl(flagHtml);

        // cell 2 explanation (HTML)
        // The python script kept the HTML but cleaned imports.
        // Let's just grab the html content of cell 2 (index 2)
        // and maybe strip some unwanted tags if needed, but python script was basic.
        const explanation = $(cells[2]).html() || '';

        let notes = '';
        if (cells.length > 3) {
            notes = cleanText($(cells[3]).text());
        }

        if (seen.has(codeText)) return;
        seen.add(codeText);

        results.push({
            code: codeText,
            country: countryText,
            flag: flagUrl,
            explanation: explanation.trim(),
            notes: notes,
            language: langMap[codeText] || 'English',
        });
    });

    results.sort((a, b) => a.code.localeCompare(b.code));

    fs.writeFileSync(path.join(DATA_DIR, 'cctlds.json'), JSON.stringify(results, null, 4));
    console.log(`Generated ${results.length} CCTLDs.`);
}

async function generateDrivingSides() {
    const url = 'https://en.wikipedia.org/wiki/Left-_and_right-hand_traffic';
    const $ = await fetchTableData(url);

    let targetTable: cheerio.Cheerio<cheerio.Element> | null = null;
    let colsMap: Record<string, number> = {};

    $('table').each((_, table) => {
        // Check headers
        const headerRow = $(table).find('tr').first();
        const headers: string[] = [];
        headerRow.find('th').each((_, th) => {
            headers.push($(th).text().toLowerCase());
        });

        // Logic from python: check for 'country' and ('side' or 'traffic')
        const hasCountry = headers.some(h => h.includes('country'));
        const hasSide = headers.some(h => h.includes('side') || h.includes('traffic'));

        if (hasCountry && hasSide) {
            // map cols
            const map: Record<string, number> = {};
            headers.forEach((h, i) => {
                if (h.includes('country')) map['country'] = i;
                else if (h.includes('side') || h.includes('traffic')) map['side'] = i;
                else if (h.includes('switch') || h.includes('change')) map['switch'] = i;
            });

            // Heuristic: check length > 50
            if ($(table).find('tr').length > 50) {
                targetTable = $(table);
                colsMap = map;
                return false;
            }
        }
    });

    if (!targetTable) {
        console.error('Could not find Driving Sides table.');
        return;
    }

    const results: any[] = [];
    const idxCountry = colsMap['country'] ?? 0;
    const idxSide = colsMap['side'] ?? 1;
    const idxSwitch = colsMap['switch'] ?? -1;

    (targetTable as cheerio.Cheerio<cheerio.Element>).find('tr').slice(1).each((_, row) => {
        const cells = $(row).find('td, th');
        // We access by index, so we need to ensure enough cells
        // Note: Python logic checked: if len(row) <= max(idx_country, idx_side)
        // which implies we need at least max_idx + 1 cells.
        const maxIdx = Math.max(idxCountry, idxSide);
        if (cells.length <= maxIdx) return;

        const countryText = cleanText($(cells[idxCountry]).text());
        const flagHtml = $(cells[idxCountry]).html() || '';
        const flag = resolveFlagUrl(flagHtml);
        const sideText = cleanText($(cells[idxSide]).text());

        let side = 'Right';
        if (sideText.includes('Left')) {
            side = 'Left';
        }

        let switched = false;
        let switchYear = '';

        if (idxSwitch !== -1 && cells.length > idxSwitch) {
            const switchText = cleanText($(cells[idxSwitch]).text());
            const matches = switchText.match(/\b\d{4}\b/);
            if (matches) {
                switched = true;
                switchYear = matches[0];
            }
        }

        let explanation = `Drives on the <b>${side}</b>.`;
        if (switched) {
            explanation += ` (Switched in ${switchYear})`;
        }

        results.push({
            country: countryText,
            side,
            flag,
            explanation,
            switched
        });
    });

    results.sort((a, b) => a.country.localeCompare(b.country));

    fs.writeFileSync(path.join(DATA_DIR, 'driving_sides.json'), JSON.stringify(results, null, 4));
    console.log(`Generated ${results.length} Driving Sides.`);
}

async function generateTelephoneCodes() {
    const url = 'https://en.wikipedia.org/wiki/List_of_country_calling_codes';
    const $ = await fetchTableData(url);

    let targetTable: cheerio.Cheerio<cheerio.Element> | null = null;

    // Find table by headers
    $('table').each((_, table) => {
        const headers = $(table).find('tr').first().find('th').map((_, th) => $(th).text().toLowerCase()).get();

        const hasCountry = headers.some(h => ['country', 'state', 'serving'].some(k => h.includes(k)));
        const hasCode = headers.some(h => h.includes('code'));

        if (hasCountry && hasCode && $(table).find('tr').length > 100) {
            targetTable = $(table);
            return false;
        }
    });

    // Fallback content search
    if (!targetTable) {
        $('table').each((_, table) => {
            // simple check if any row has Afghanistan and +93
            const text = $(table).text();
            if (text.includes('Afghanistan') && text.includes('+93')) {
                targetTable = $(table);
                return false;
            }
        });
    }

    if (!targetTable) {
        console.error("Could not find Telephone Codes table");
        return;
    }

    const results: any[] = [];
    let colCountry = 0;
    let colCode = 1;

    // Determine cols
    const headers = (targetTable as cheerio.Cheerio<cheerio.Element>).find('tr').first().find('th').map((_, th) => $(th).text().toLowerCase()).get();
    headers.forEach((h, i) => {
        if (['country', 'state', 'serving'].some(k => h.includes(k))) colCountry = i;
        if (h.includes('code')) colCode = i;
    });

    (targetTable as cheerio.Cheerio<cheerio.Element>).find('tr').slice(1).each((_, row) => {
        const cells = $(row).find('td, th');
        if (cells.length <= Math.max(colCountry, colCode)) return;

        const country = cleanText($(cells[colCountry]).text());
        const codeRaw = cleanText($(cells[colCode]).text());
        const flag = resolveFlagUrl($(cells[colCountry]).html() || '');

        const match = codeRaw.match(/[\+\d][\d\s\-\(\),]* /); // Removed invalid possessive quantifier
        if (match) {
            let code = match[0].trim();
            if (!code.startsWith('+')) code = '+' + code;
            results.push({ code, country, flag });
        }
    });

    results.sort((a, b) => a.country.localeCompare(b.country));
    fs.writeFileSync(path.join(DATA_DIR, 'telephone_codes.json'), JSON.stringify(results, null, 2));
    console.log(`Generated ${results.length} Telephone Codes.`);
}

async function generateVehicleCodes() {
    const url = 'https://en.wikipedia.org/wiki/International_vehicle_registration_code';
    const $ = await fetchTableData(url);

    let targetTable: cheerio.Cheerio<cheerio.Element> | null = null;

    $('table').each((_, table) => {
        const headers = $(table).find('tr').first().find('th').map((_, th) => $(th).text().toLowerCase()).get();
        if (headers.includes('code') && headers.includes('country') && $(table).find('tr').length > 5) {
            targetTable = $(table);
            return false;
        }
    });

    if (!targetTable) {
        // Fallback: look for AFG row
        $('table').each((_, table) => {
            $(table).find('tr').each((_, row) => {
                const firstCell = $(row).find('td').first().text().trim();
                if (firstCell === 'AFG') {
                    targetTable = $(table);
                    return false; // break row loop
                }
            });
            if (targetTable) return false; // break table loop
        });
    }

    if (!targetTable) {
        console.error("Could not find Vehicle Codes table.");
        return;
    }

    const results: any[] = [];
    let headerSeen = false;

    (targetTable as cheerio.Cheerio<cheerio.Element>).find('tr').each((_, row) => {
        const cells = $(row).find('td, th');
        if (cells.length < 2) return;

        const firstText = $(cells[0]).text().trim().toLowerCase();
        if (!headerSeen) {
            if (firstText === 'code') {
                headerSeen = true;
                return;
            }
        }

        const code = cleanText($(cells[0]).text());
        const country = cleanText($(cells[1]).text());
        const flag = resolveFlagUrl($(cells[1]).html() || '');

        if (!code || !country) return;

        // Skip header if it wasn't caught
        if (code.toLowerCase() === 'code' && country.toLowerCase() === 'country') return;

        results.push({ code, country, flag });
    });

    results.sort((a, b) => a.code.localeCompare(b.code));
    fs.writeFileSync(path.join(DATA_DIR, 'vehicle_codes.json'), JSON.stringify(results, null, 2));
    console.log(`Generated ${results.length} Vehicle Codes.`);
}

// Main
async function main() {
    await generateCCTLDs();
    await generateDrivingSides();
    await generateTelephoneCodes();
    await generateVehicleCodes();
}

main().catch(console.error);
