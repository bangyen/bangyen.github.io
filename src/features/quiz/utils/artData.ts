import { ArtItem } from '../types/quiz';

const WIKI_REST_API = 'https://en.wikipedia.org/api/rest_v1/page/summary/';

export const ART_SEED_TITLES: string[] = []; // Deprecated: Data is now loaded from art_data.json

/**
 * Fetches artwork metadata from Wikipedia REST API.
 */
export async function fetchArtMetadata(title: string): Promise<ArtItem | null> {
    try {
        const url = `${WIKI_REST_API}${encodeURIComponent(title.replace(/ /g, '_'))}`;
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();

        // Basic extraction logic
        let artist = 'Unknown';
        let year = 'Unknown';
        let period = 'Unknown';

        // Try to find artist in description
        const desc = data.description || '';
        const artistMatch = desc.match(/by ([\w\s.-]+)/i);
        if (artistMatch) {
            artist = artistMatch[1].trim();
        }

        // Try to find year/century in extract
        const extract = data.extract || '';
        const yearMatch = extract.match(/\b(1[4-9]\d{2}|20[0-2]\d)\b/);
        if (yearMatch) {
            year = yearMatch[0];
        } else {
            const centuryMatch = extract.match(
                /(\d{1,2}(st|nd|rd|th)-century)/i
            );
            if (centuryMatch) {
                year = centuryMatch[0];
            }
        }

        // Try to guess period from keywords
        const periods = [
            'Renaissance',
            'Baroque',
            'Romanticism',
            'Impressionism',
            'Post-Impressionism',
            'Surrealism',
            'Cubism',
            'Modernism',
        ];
        for (const p of periods) {
            if (extract.includes(p) || desc.includes(p)) {
                period = p;
                break;
            }
        }

        return {
            title: data.title,
            artist: artist,
            year: year,
            period: period,
            imageUrl:
                data.originalimage?.source || data.thumbnail?.source || '',
            wikiUrl: data.content_urls?.desktop?.page || '',
            description: extract,
            country: '',
        };
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch art data for ${title}:`, error);
        return null;
    }
}

/**
 * Fetches all art items for the quiz.
 */
export async function fetchAllArt(
    titles: string[] = ART_SEED_TITLES
): Promise<ArtItem[]> {
    const results = await Promise.all(titles.map(t => fetchArtMetadata(t)));
    return results.filter((i): i is ArtItem => i !== null);
}
