/**
 * Fetches and parses a JSON file that may be gzip-compressed.
 *
 * Every research page stores its experiment dataset as a `.json.gz` asset.
 * This utility centralises the fetch → gzip-detection → decompress → parse
 * pipeline so each page only declares *which* URL to load, not *how*.
 *
 * Uses the native DecompressionStream API instead of third-party libraries.
 */
export const fetchGzippedJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status.toString()}`);
    }

    // Check for GZIP magic number (0x1f 0x8b) in the first two bytes
    const clone = response.clone();
    const reader = clone.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const { value } = await reader.read();
    const isGzipped = value?.[0] === 0x1f && value[1] === 0x8b;
    reader.releaseLock();

    const resultStream =
        isGzipped && response.body
            ? response.body.pipeThrough(new DecompressionStream('gzip'))
            : response.body;

    if (!resultStream) throw new Error('Decompression failed: stream is null');

    const decompressedResponse = new Response(resultStream);
    return (await decompressedResponse.json()) as T;
};
