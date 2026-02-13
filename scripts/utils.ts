 

import fs from 'node:fs';
import path from 'node:path';

import * as cheerio from 'cheerio';

const CACHE_DIR = path.join(process.cwd(), 'scripts/.cache');

/**
 * Clean text by removing citations and trimming.
 */
export function cleanText(text: string): string {
    return text.replaceAll(/\[.*?\]/g, '').trim();
}

/**
 * Slugify a string for use in filenames.
 */
export function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replaceAll(/\s+/g, '_')
        .replaceAll(/[^\w-]+/g, '')
        .replaceAll(/--+/g, '_')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

/**
 * Fetch HTML from a URL with local disk caching.
 * Returns a CheerioAPI instance loaded with the HTML.
 */
export async function fetchWithCache(url: string, cacheFilename?: string): Promise<cheerio.CheerioAPI> {
    const shouldRefresh = process.argv.includes('--refresh');
    const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    // Generate filename from URL if not provided
    const filename = cacheFilename || slugify(url) + '.html';
    const cachePath = path.join(CACHE_DIR, filename);

    if (fs.existsSync(cachePath) && !shouldRefresh) {
        const stats = fs.statSync(cachePath);
        const age = Date.now() - stats.mtimeMs;

        if (age < MAX_AGE_MS) {
            console.log(`[Cache] Hit: ${filename} (Age: ${(age / 1000 / 60).toFixed(1)}m)`);
            const text = fs.readFileSync(cachePath, 'utf8');
            return cheerio.load(text);
        } else {
            console.log(`[Cache] Expired: ${filename} (Age: ${(age / 1000 / 60 / 60).toFixed(1)}h)`);
        }
    }

    console.log(`[Network] Fetching: ${url}`);
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
    fs.writeFileSync(cachePath, text);
    console.log(`[Cache] Saved: ${filename}`);

    return cheerio.load(text);
}

/**
 * Delay execution for a number of milliseconds.
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
