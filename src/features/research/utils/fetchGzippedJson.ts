import pako from 'pako';

/**
 * Fetches and parses a JSON file that may be gzip-compressed.
 *
 * Every research page stores its experiment dataset as a `.json.gz` asset.
 * This utility centralises the fetch → gzip-detection → decompress → parse
 * pipeline so each page only declares *which* URL to load, not *how*.
 */
export const fetchGzippedJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status.toString()}`);
    }

    const buffer = await response.arrayBuffer();
    const view = new Uint8Array(buffer);

    // Check for GZIP magic number (0x1f 0x8b)
    const isGzipped = view[0] === 0x1f && view[1] === 0x8b;

    const text: string = isGzipped
        ? (pako.ungzip(view, { to: 'string' }) as unknown as string)
        : new TextDecoder().decode(buffer);

    return JSON.parse(text) as T;
};
