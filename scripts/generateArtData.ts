import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { performance } from 'perf_hooks';
import * as cheerio from 'cheerio';

const HTML_CACHE_FILE = path.join(process.cwd(), 'scripts/data/most_expensive_paintings.html');

// Fetch table data helper with local caching
async function fetchTableData(url: string): Promise<cheerio.CheerioAPI> {
    if (fs.existsSync(HTML_CACHE_FILE)) {
        console.log(`Reading from local cache: ${HTML_CACHE_FILE}`);
        const text = fs.readFileSync(HTML_CACHE_FILE, 'utf-8');
        return cheerio.load(text);
    }

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

    // Save to cache
    if (!fs.existsSync(path.dirname(HTML_CACHE_FILE))) {
        fs.mkdirSync(path.dirname(HTML_CACHE_FILE), { recursive: true });
    }
    fs.writeFileSync(HTML_CACHE_FILE, text);
    console.log(`Cached HTML to ${HTML_CACHE_FILE}`);

    return cheerio.load(text);
}

// Local definition of ArtItem to allow independent execution
// STRICT: Only columns in the table
interface ArtItem {
    title: string;
    artist: string;
    year: string;
    imageUrl: string;
    wikiUrl: string;
    description: string;
    seedTitle?: string;
}

// Scrape DATA from "List of most expensive paintings"
async function fetchMostExpensivePaintings(): Promise<ArtItem[]> {
    const url = 'https://en.wikipedia.org/wiki/List_of_most_expensive_paintings';
    const $ = await fetchTableData(url);
    const items: ArtItem[] = [];

    let targetTable: cheerio.Cheerio<any> | null = null;
    const colMap: Record<string, number> = {};

    $('table').each((_, table) => {
        const headers = $(table).find('th');
        headers.each((index, th) => {
            const headerText = $(th).text().trim().toLowerCase();
            if (headerText.includes('painting') || headerText.includes('work')) colMap['title'] = index;
            if (headerText.includes('artist')) colMap['artist'] = index;
            if (headerText.includes('year') && !colMap['year']) colMap['year'] = index;
            if (headerText.includes('image')) colMap['image'] = index;
        });

        // If we found the essential columns, this is our table
        if (colMap['title'] !== undefined && colMap['artist'] !== undefined) {
            targetTable = $(table);
            return false;
        }
    });

    if (!targetTable) {
        console.error('Could not find the painting table.');
        return [];
    }

    // Default indices if detection failed slightly (fallback to standard layout)
    if (colMap['image'] === undefined) colMap['image'] = 1;

    (targetTable as cheerio.Cheerio<any>).find('tr').slice(1).each((_: number, row: any) => {
        const cells = $(row).find('th, td');
        if (cells.length === 0) return;

        // Title
        let title = '';
        if (colMap['title'] !== undefined && cells[colMap['title']]) {
            title = $(cells[colMap['title']]).text().trim();
            title = title.replace(/\[.*?\]/g, '').replace(/^"|"$/g, '');
            const italicText = $(cells[colMap['title']]).find('i').text().trim();
            if (italicText) title = italicText;
        }

        // Artist
        let artist = 'Unknown';
        if (colMap['artist'] !== undefined && cells[colMap['artist']]) {
            artist = $(cells[colMap['artist']]).text().trim();
            artist = artist.replace(/\[.*?\]/g, '');
        }

        // Year
        let year = 'Unknown';
        if (colMap['year'] !== undefined && cells[colMap['year']]) {
            year = $(cells[colMap['year']]).text().trim().replace(/\[.*?\]/g, '');
        }

        // Image
        let imageUrl = '';
        if (colMap['image'] !== undefined && cells[colMap['image']]) {
            const imgTag = $(cells[colMap['image']]).find('img');
            const src = imgTag.attr('src') || '';
            if (src) {
                imageUrl = src.startsWith('//') ? 'https:' + src : src;
                if (imageUrl.includes('/thumb/')) {
                    imageUrl = imageUrl.replace(/\/\d+px-/, '/800px-');
                }
            }
        }

        if (title && title.length > 2 && imageUrl) {
            items.push({
                title,
                artist,
                year,
                imageUrl,
                wikiUrl: url,
                description: `${title} by ${artist}`,
                seedTitle: title
            });
        }
    });

    console.log(`Scraped ${items.length} items from table directly.`);
    return items;
}

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ART_ASSETS_DIR = path.join(PUBLIC_DIR, 'assets/art');
const DATA_FILE = path.join(PUBLIC_DIR, 'assets/art_data.json');
const GZIP_FILE = path.join(PUBLIC_DIR, 'assets/art_data.json.gz');

function saveProgress(results: any[]) {
    const jsonStr = JSON.stringify(results, null, 2);
    fs.writeFileSync(DATA_FILE, jsonStr);
}

if (!fs.existsSync(ART_ASSETS_DIR)) {
    fs.mkdirSync(ART_ASSETS_DIR, { recursive: true });
}

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '_')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function downloadImage(url: string, dest: string) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://en.wikipedia.org/'
        }
    });

    if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 30000;
        console.log(`Rate limited. Waiting ${waitTime / 1000}s...`);
        await delay(waitTime);
        return downloadImage(url, dest); // Retry
    }

    if (!response.ok) throw new Error(`Failed to fetch image: ${url} (Status: ${response.status})`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(dest, buffer);
}

async function main() {
    const startTime = performance.now();

    console.log('Scraping "List of most expensive paintings"... (Strict Mode: Columns Only)');
    const scrapedItems = await fetchMostExpensivePaintings();

    // Use scraped items as the ONLY source of truth for new data structure
    // We will still load existing data to preserve ALREADY DOWNLOADED images/paths,
    // but we will NOT respect old metadata that might have inferred fields if we were rebuilding strictly.
    // However, to keep it simple, we just merge.

    const ART_SEED_TITLES = scrapedItems.map(i => i.title);

    console.log(`Starting art data generation for ${ART_SEED_TITLES.length} items...`);

    let initialData: any[] = [];
    if (fs.existsSync(DATA_FILE)) {
        try {
            initialData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            console.log(`Loaded ${initialData.length} existing items.`);
        } catch (e) {
            console.warn('Failed to parse existing art_data.json');
        }
    } else if (fs.existsSync(GZIP_FILE)) {
        try {
            const compressed = fs.readFileSync(GZIP_FILE);
            const decompressed = await gunzip(compressed);
            initialData = JSON.parse(decompressed.toString());
        } catch (e) { }
    }

    const resultsMap = new Map();
    initialData.forEach(item => {
        resultsMap.set(item.seedTitle || item.title, item);
        resultsMap.set(slugify(item.title), item);
    });

    // Merge scraped data into resultsMap
    scrapedItems.forEach(item => {
        const slug = slugify(item.title);
        const existing = resultsMap.get(item.title) || resultsMap.get(slug);

        if (!existing) {
            console.log(`Adding new scraped item: ${item.title}`);
            resultsMap.set(item.title, item);
        } else {
            // Force update fields from scrape to ensure strict compliance (e.g. if we had inferred before)
            // But we keep local image path if we have it
            const oldImage = existing.imageUrl;
            Object.assign(existing, item); // Overwrite with strict scraped data
            if (oldImage && oldImage.startsWith('./')) {
                existing.imageUrl = oldImage; // Restore local path
            }
            // Explicitly delete country/period if they exist in old data but not new?
            // "only include scraped info". Scraped item doesn't have country/period.
            // So Object.assign adds properties. It doesn't remove old ones.
            // We should strip them.
            delete existing.country;
            delete existing.period;

            resultsMap.set(item.title, existing);
        }
    });

    // Filter resultsMap to ONLY include things in the scraped list?
    // The user said "only include scraped info". This might mean "only items found in the scrape" AND "only columns found in the scrape".
    // Let's assume they want to keep the "most expensive paintings" list as the canonical source.
    // So we will only save items that are in `scrapedItems`.

    const finalItemsOnlyScraped: any[] = [];

    for (const item of scrapedItems) {
        // Get the latest merged version from map
        const merged = resultsMap.get(item.title);
        if (merged) {
            // ensure no inferred fields are leaking back
            delete merged.country;
            delete merged.period;
            finalItemsOnlyScraped.push(merged);
        }
    }

    console.log(`Filtered down to ${finalItemsOnlyScraped.length} items present in the scraped list.`);

    // SAVE INTERMEDIATE result immediately so the file is correct even if downloads fail/hang
    console.log(`Saving ${finalItemsOnlyScraped.length} items (pre-download)...`);
    saveProgress(finalItemsOnlyScraped);

    // Download images loop
    for (const item of finalItemsOnlyScraped) {
        if (item.imageUrl && !item.imageUrl.startsWith('./')) {
            const urlPath = new URL(item.imageUrl).pathname;
            let ext = path.extname(urlPath);
            if (!ext || ext.length > 5) ext = '.jpg';
            const filename = `${slugify(item.title)}${ext}`;
            const dest = path.join(ART_ASSETS_DIR, filename);

            if (fs.existsSync(dest)) {
                item.imageUrl = `./assets/art/${filename}`;
                continue;
            }

            try {
                process.stdout.write(`Downloading: ${item.title}... `);
                await downloadImage(item.imageUrl, dest);
                item.imageUrl = `./assets/art/${filename}`;
                console.log(`Done.`);
                await delay(500);
            } catch (error) {
                console.log(`Failed download: ${String(error)}`);
            }
        }
    }

    console.log(`Saving ${finalItemsOnlyScraped.length} items...`);
    saveProgress(finalItemsOnlyScraped);

    const jsonStr = JSON.stringify(finalItemsOnlyScraped, null, 2);
    const compressed = await gzip(jsonStr);
    fs.writeFileSync(GZIP_FILE, compressed);

    console.log(`Generation complete!`);
}

main().catch(console.error);
