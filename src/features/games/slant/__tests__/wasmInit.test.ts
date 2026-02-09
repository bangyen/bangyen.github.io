import { describe, it, expect, beforeAll } from 'vitest';
import { ensureWasmInitialized, isWasmReady } from '../utils/wasmInit';

describe('WASM Initialization', () => {
    beforeAll(async () => {
        // Wait for WASM to initialize
        await ensureWasmInitialized();
    });

    it('should initialize WASM successfully', async () => {
        await ensureWasmInitialized();
        expect(isWasmReady()).toBe(true);
    });

    it('should allow calling ensureWasmInitialized multiple times', async () => {
        await ensureWasmInitialized();
        await ensureWasmInitialized();
        expect(isWasmReady()).toBe(true);
    });
});
