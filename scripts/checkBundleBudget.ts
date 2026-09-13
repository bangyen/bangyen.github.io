import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.join(import.meta.dirname, '..', 'build');
const MAX_TOTAL_JS_BYTES = 1024 * 1024;
const MAX_CHUNK_BYTES = 400 * 1024;

const files = await readdir(path.join(BUILD_DIR, 'assets'));
const javascript = await Promise.all(
    files
        .filter(file => file.endsWith('.js'))
        .map(async file => {
            const assetPath = path.join(BUILD_DIR, 'assets', file);
            const assetStat = await stat(assetPath);
            return {
                file: path.relative(BUILD_DIR, assetPath),
                bytes: assetStat.size,
            };
        }),
);
const totalBytes = javascript.reduce((sum, asset) => sum + asset.bytes, 0);
const oversized = javascript.filter(asset => asset.bytes > MAX_CHUNK_BYTES);

if (totalBytes > MAX_TOTAL_JS_BYTES || oversized.length > 0) {
    const details = oversized
        .map(asset => `${asset.file}: ${(asset.bytes / 1024).toFixed(1)} KiB`)
        .join('\n');
    throw new Error(
        `Bundle budget exceeded. Total JS ${(totalBytes / 1024).toFixed(1)} KiB / ${MAX_TOTAL_JS_BYTES / 1024} KiB.` +
            (details ? `\nOversized chunks:\n${details}` : ''),
    );
}

console.log(
    `Bundle budget passed: ${(totalBytes / 1024).toFixed(1)} KiB total JS, ${javascript.length.toString()} chunks.`,
);
