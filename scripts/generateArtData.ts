import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { promisify } from 'util';
import { performance } from 'perf_hooks';

// We'll manually define the titles here to avoid path issues with tsx if src is not easily importable
// but actually fetchArtMetadata is in src/features/quiz/utils/artData.ts
// We'll use relative imports and hope for the best with tsx

const ART_SEED_TITLES = [
    'Mona Lisa',
    'The Starry Night',
    'The Scream',
    'Guernica (painting)',
    'The Persistence of Memory',
    'Girl with a Pearl Earring',
    'The Night Watch',
    'The Birth of Venus',
    'Las Meninas',
    'The Last Supper (Leonardo)',
    'American Gothic',
    'The Kiss (Klimt)',
    'Whistler\'s Mother',
    'The Garden of Earthly Delights',
    'A Sunday Afternoon on the Island of La Grande Jatte',
    'Liberty Leading the People',
    'The Hay Wain',
    'The Arnolfini Portrait',
    'The Great Wave off Kanagawa',
    'The School of Athens',
    'Wanderer above the Sea of Fog',
    'The Third of May 1808',
    'Impression, Sunrise',
    'The Gross Clinic',
    'Nighthawks (Hopper)',
    'Café Terrace at Night',
    'The Swing (Fragonard)',
    'The Gleaners',
    'Olympia (Manet)',
    'The Luncheon on the Grass',
    'Portrait of Madame X',
    'The Fighting Temeraire',
    'Rain, Steam and Speed',
    'The Stone Breakers',
    'Burial at Ornans',
    'The Raft of the Medusa',
    'Oath of the Horatii',
    'The Death of Marat',
    'The Embarkation for Cythera',
    'The Blue Boy',
    'The Anatomy Lesson of Dr. Nicolaes Tulp',
    'Girl before a Mirror',
    'Flaming June',
    'Ophelia (painting)',
    'Lady with an Ermine',
    'The Ambassadors (Holbein)',
    'The Venus of Urbino',
    'Bacchus and Ariadne',
    'The Wedding Feast at Cana',
    'Christ in the Storm on the Sea of Galilee'
];

const WIKI_REST_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

async function fetchArtMetadata(title: string) {
    try {
        const url = `${WIKI_REST_API}${encodeURIComponent(title.replace(/ /g, '_'))}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://en.wikipedia.org/'
            }
        });
        if (!response.ok) return null;
        const data: any = await response.json();

        let artist = 'Unknown';
        let year = 'Unknown';
        let period = 'Unknown';

        const desc = data.description || '';
        const artistMatch = desc.match(/by ([\w\s.-]+)/i);
        if (artistMatch) {
            artist = artistMatch[1].trim();
        }

        const extract = data.extract || '';
        const yearMatch = extract.match(/\b(1[4-9]\d{2}|20[0-2]\d)\b/);
        if (yearMatch) {
            year = yearMatch[0];
        } else {
            const centuryMatch = extract.match(/(\d{1,2}(st|nd|rd|th)-century)/i);
            if (centuryMatch) {
                year = centuryMatch[0];
            }
        }

        const periods = ['Renaissance', 'Baroque', 'Romanticism', 'Impressionism', 'Post-Impressionism', 'Surrealism', 'Cubism', 'Modernism'];
        for (const p of periods) {
            if (extract.includes(p) || desc.includes(p)) {
                period = p;
                break;
            }
        }

        const thumbUrl = data.thumbnail?.source || '';
        const originalUrl = data.originalimage?.source || '';

        let imageUrl = thumbUrl || originalUrl;

        // If it's a Wikipedia thumbnail, upgrade to a reasonable size (800px)
        if (imageUrl.includes('/thumb/')) {
            imageUrl = imageUrl.replace(/\/\d+px-/, '/800px-');
        } else if (imageUrl && !thumbUrl && imageUrl.includes('upload.wikimedia.org')) {
            // It's an original image from Wikimedia, but no thumbnail was provided.
            // We can try to construct a thumbnail URL if we really wanted to, 
            // but let's just stick to what we have or skip if it's too risky.
        }

        return {
            title: data.title,
            artist: artist,
            year: year,
            period: period,
            imageUrl: imageUrl,
            wikiUrl: data.content_urls?.desktop?.page || '',
            description: extract,
            country: ''
        };
    } catch (error) {
        console.error(`Failed to fetch art data for ${title}:`, error);
        return null;
    }
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
    console.log(`Starting art data generation for ${ART_SEED_TITLES.length} items...`);

    // 1. Load existing data to reuse metadata and images
    let initialData: any[] = [];
    if (fs.existsSync(DATA_FILE)) {
        try {
            initialData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
            console.log(`Loaded ${initialData.length} existing items from metadata.`);
        } catch (e) {
            console.warn('Failed to parse existing art_data.json');
        }
    } else if (fs.existsSync(GZIP_FILE)) {
        try {
            const compressed = fs.readFileSync(GZIP_FILE);
            const decompressed = await gunzip(compressed);
            initialData = JSON.parse(decompressed.toString());
            console.log(`Loaded ${initialData.length} existing items from ${path.basename(GZIP_FILE)}.`);
        } catch (e) {
            console.warn(`Failed to decompress ${path.basename(GZIP_FILE)}`);
        }
    }

    // 2. Build a map for lookup. Prefer seedTitle for perfect matching with our list.
    const resultsMap = new Map();
    initialData.forEach(item => {
        const key = item.seedTitle || item.title;
        resultsMap.set(key, item);
        // Also map by slug for better coverage from older versions
        resultsMap.set(slugify(item.title), item);
    });

    for (const title of ART_SEED_TITLES) {
        const itemStartTime = performance.now();
        const slug = slugify(title);

        // Try to find in cache by seed title or slug
        let item = resultsMap.get(title) || resultsMap.get(slug);

        if (item && item.imageUrl.startsWith('./')) {
            const localPath = path.join(PUBLIC_DIR, item.imageUrl);
            if (fs.existsSync(localPath)) {
                const elapsed = (performance.now() - itemStartTime).toFixed(1);
                console.log(`[${elapsed}ms] Skipping: ${title} (fully cached)`);
                continue;
            }
        }

        // 3. If not cached, we must fetch metadata
        if (!item) {
            const fetchStartTime = performance.now();
            item = await fetchArtMetadata(title);
            if (item) item.seedTitle = title; // Record the seed title for future lookups
            const fetchElapsed = (performance.now() - fetchStartTime).toFixed(1);
            console.log(`[${fetchElapsed}ms] Fetched metadata for ${title}`);
            // Small delay after network
            await delay(300);
        }

        if (item && item.imageUrl) {
            const urlPath = new URL(item.imageUrl).pathname;
            let ext = path.extname(urlPath);
            if (!ext || ext.length > 5) ext = '.jpg';

            const filename = `${slugify(item.title)}${ext}`;
            const dest = path.join(ART_ASSETS_DIR, filename);
            const originalImageUrl = item.imageUrl;

            if (fs.existsSync(dest)) {
                const elapsed = (performance.now() - itemStartTime).toFixed(1);
                console.log(`[${elapsed}ms] Skipping download: ${item.title} (file exists)`);
                item.imageUrl = `./assets/art/${filename}`;
                resultsMap.set(title, item);
                saveProgress(Array.from(resultsMap.values()));
                continue;
            }

            try {
                const downloadStartTime = performance.now();
                process.stdout.write(`Downloading: ${item.title}... `);
                await downloadImage(item.imageUrl, dest);
                item.imageUrl = `./assets/art/${filename}`;
                const downloadElapsed = (performance.now() - downloadStartTime).toFixed(1);
                console.log(`Done in ${downloadElapsed}ms.`);

                resultsMap.set(title, item);
                saveProgress(Array.from(resultsMap.values()));
                // Be very nice to Wikipedia after download
                await delay(2000);
            } catch (error) {
                console.log(`Failed (keeping remote URL): ${error instanceof Error ? error.message : String(error)}`);
                item.imageUrl = originalImageUrl;
                resultsMap.set(title, item);
                saveProgress(Array.from(resultsMap.values()));
            }
        } else {
            console.log(`Skipped ${title} (no metadata/image).`);
        }
    }

    const uniqueByTitle = new Map();
    resultsMap.forEach(item => uniqueByTitle.set(item.title, item));
    const finalResults = Array.from(uniqueByTitle.values());
    const totalElapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    console.log(`Saving final updated metadata...`);
    saveProgress(finalResults);

    console.log(`Compressing to ${GZIP_FILE}...`);
    const jsonStr = JSON.stringify(finalResults, null, 2);
    const compressed = await gzip(jsonStr);
    fs.writeFileSync(GZIP_FILE, compressed);

    console.log(`Generation complete in ${totalElapsed}s!`);
}

main().catch(console.error);
