
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { fetchWithCache, cleanText } from './utils';

const DATA_DIR = path.join(process.cwd(), 'src/features/quiz/data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helpers

interface CCTLD {
    code: string;
    country: string;
    flag: string;
    explanation: string;
    notes: string;
    language: string;
}

interface DrivingSide {
    country: string;
    side: string;
    flag: string;
    explanation: string;
    switched: boolean;
}

interface PhoneCode {
    code: string;
    country: string;
    flag: string;
}

interface VehicleCode {
    code: string;
    country: string;
    flag: string;
    conventions: number[];
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
    return fetchWithCache(url);
}

// Generators

async function generateCCTLDs() {
    const url = 'https://en.wikipedia.org/wiki/Country_code_top-level_domain';
    const $ = await fetchTableData(url);

    // Find the table. Python script looked for .ad
    // We can just iterate all tables and look for one with ".ad" in the first column
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetTable: cheerio.Cheerio<any> | null = null;


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

    const results: CCTLD[] = [];
    const seen = new Set<string>();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (targetTable as cheerio.Cheerio<any>).find('tr').each((_, row) => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetTable: cheerio.Cheerio<any> | null = null;
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

    const results: DrivingSide[] = [];
    const idxCountry = colsMap['country'] ?? 0;
    const idxSide = colsMap['side'] ?? 1;
    const idxSwitch = colsMap['switch'] ?? -1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (targetTable as cheerio.Cheerio<any>).find('tr').slice(1).each((_, row) => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let targetTable: cheerio.Cheerio<any> | null = null;

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

    const results: PhoneCode[] = [];
    let colCountry = 0;
    let colCode = 1;

    // Determine cols
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers = (targetTable as cheerio.Cheerio<any>).find('tr').first().find('th').map((_, th) => $(th).text().toLowerCase()).get();
    headers.forEach((h, i) => {
        if (['country', 'state', 'serving'].some(k => h.includes(k))) colCountry = i;
        if (h.includes('code')) colCode = i;
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (targetTable as cheerio.Cheerio<any>).find('tr').slice(1).each((_, row) => {
        const cells = $(row).find('td, th');
        if (cells.length <= Math.max(colCountry, colCode)) return;

        const country = cleanText($(cells[colCountry]).text());
        const codeRaw = cleanText($(cells[colCode]).text());
        const flag = resolveFlagUrl($(cells[colCountry]).html() || '');

        const match = codeRaw.match(/[+\d][\d\s\-(),]* /); // Removed invalid possessive quantifier
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

    const vehicleCodesMap = new Map<string, VehicleCode[]>();

    const upsertEntry = (code: string, country: string, flag: string | null, convention: number | null) => {
        if (!vehicleCodesMap.has(code)) {
            vehicleCodesMap.set(code, []);
        }
        const entries = vehicleCodesMap.get(code)!;

        // Find matching entry by country name similarity
        // Heuristic: If one contains the other (e.g. "France" in "France, Algeria..."), merge.
        // Special case: "French India" contains "French" but not "France".
        // "Morocco" != "France".
        const match = entries.find(e => {
            const c1 = e.country.toLowerCase();
            const c2 = country.toLowerCase();
            return c1.includes(c2) || c2.includes(c1);
        });

        if (match) {
            // Merge
            if (convention && !match.conventions.includes(convention)) {
                match.conventions.push(convention);
            }
            // Update metadata (prefer longer/more detailed? or prefer modern?)
            // If convention is null (Table 3), prefer modern.
            // If convention is 1924, and existing is 1909, maybe preserve 1909?
            // Let's defer to "Latest update wins for Country Name" if it's a match.
            match.country = country;
            if (flag) match.flag = flag;
        } else {
            // New entry (distinct entity sharing code)
            const newEntry = {
                code,
                country,
                flag: flag || '',
                conventions: convention ? [convention] : []
            };
            entries.push(newEntry);
        }
    };

    $('table').each((i, table) => {
        // Table 1: 1909 Paris Convention
        if (i === 1) {
            $(table).find('tr').slice(1).each((_, row) => {
                const cells = $(row).find('td');
                if (cells.length >= 2) {
                    const _country = cleanText($(cells[0]).text());
                    const _code = cleanText($(cells[1]).text());
                    const _flag = resolveFlagUrl($(cells[0]).html() || '');
                }
            });
        }

        // Table 2: 1924 Paris Convention
        if (i === 2) {
            const rows = $(table).find('tr');
            console.log(`Table 2 Total Trs: ${rows.length}`);
            let rowsProcessed = 0;
            rows.slice(1).each((_, row) => {
                rowsProcessed++;
                const cells = $(row).find('td');
                if (cells.length >= 2) {
                    const country = cleanText($(cells[0]).text());
                    let code = cleanText($(cells[1]).text());
                    code = code.replace(/\[.*?\]/g, '').trim();

                    const flag = resolveFlagUrl($(cells[0]).html() || '');

                    if (code && country) {
                        // console.log(`1924 Row: "${code}" - "${country}"`);
                        upsertEntry(code, country, flag, 1924);
                    }
                }
            });
            console.log(`Table 2 Rows Processed: ${rowsProcessed}`);
        }

        // Table 3: Current Codes
        if (i === 3) {
            $(table).find('tr').slice(1).each((_, row) => {
                const cells = $(row).find('td, th');
                if (cells.length >= 2) {
                    const code = cleanText($(cells[0]).text());
                    const country = cleanText($(cells[1]).text());
                    const flag = resolveFlagUrl($(cells[1]).html() || '');

                    if (code && country) {
                        if (code.toLowerCase() === 'code' && country.toLowerCase() === 'country') return;
                        upsertEntry(code, country, flag, null);
                    }
                }
            });
        }
    });

    // Flatten results
    const results: VehicleCode[] = [];
    vehicleCodesMap.forEach(entries => results.push(...entries));
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
