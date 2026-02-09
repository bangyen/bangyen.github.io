import init from 'slant-wasm';

let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

/**
 * Ensures the WASM module is initialized before use.
 * Returns a promise that resolves when initialization is complete.
 */
export async function ensureWasmInitialized(): Promise<void> {
    if (wasmInitialized) {
        return;
    }

    wasmInitPromise ??= init()
        .then(() => {
            wasmInitialized = true;
        })
        .catch((e: unknown) => {
            // eslint-disable-next-line no-console
            console.error('Failed to initialize Slant WASM:', e);
            wasmInitPromise = null; // Allow retry
            throw e;
        });

    return wasmInitPromise;
}

/**
 * Returns whether the WASM module is currently initialized.
 * Use this for synchronous checks before calling WASM functions.
 */
export function isWasmReady(): boolean {
    return wasmInitialized;
}

// Start initialization immediately
ensureWasmInitialized().catch(() => {
    // Error already logged in ensureWasmInitialized
});
