// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock window.matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class {
    constructor() {}
    disconnect = vi.fn();
    observe = vi.fn();
    unobserve = vi.fn();
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
globalThis.ResizeObserver = class {
    constructor() {}
    disconnect = vi.fn();
    observe = vi.fn();
    unobserve = vi.fn();
} as unknown as typeof ResizeObserver;

// Mock TextEncoder for Node.js environment
globalThis.TextEncoder = class TextEncoder {
    encoding = 'utf-8';
    encode(str: string): Uint8Array {
        return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
    }
    encodeInto(
        source: string,
        destination: Uint8Array,
    ): { read: number; written: number } {
        const encoded = this.encode(source);
        destination.set(encoded);
        return { read: source.length, written: encoded.length };
    }
} as unknown as typeof TextEncoder;

globalThis.TextDecoder = class TextDecoder {
    encoding = 'utf-8';
    fatal = false;
    ignoreBOM = false;
    decode(bytes: Uint8Array | ArrayBuffer): string {
        const array =
            bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
        return Buffer.from(array).toString('utf-8');
    }
} as unknown as typeof TextDecoder;

// Mock Response for fetch and decompression
Object.defineProperty(globalThis, 'Response', {
    value: class Response {
        _data: unknown;
        constructor(data: unknown) {
            this._data = data;
        }
        async text() {
            await Promise.resolve();
            if (this._data instanceof ReadableStream) {
                return '[]';
            }
            return String(this._data);
        }
        async json() {
            return JSON.parse(await this.text()) as unknown;
        }
    },
    writable: true,
});

// Mock ReadableStream
Object.defineProperty(globalThis, 'ReadableStream', {
    value: class ReadableStream {
        constructor(options: { start?: (controller: unknown) => void } = {}) {
            if (options.start) {
                const controller = {
                    enqueue: vi.fn(),
                    close: vi.fn(),
                };
                options.start(controller);
            }
        }
        getReader() {
            return {
                read: vi.fn().mockResolvedValue({ done: true }),
            };
        }
    },
    writable: true,
});

// Mock DecompressionStream
Object.defineProperty(globalThis, 'DecompressionStream', {
    value: class DecompressionStream {
        writable = {
            getWriter: () => ({
                write: vi.fn().mockResolvedValue(undefined),
                close: vi.fn().mockResolvedValue(undefined),
            }),
        };
        readable = {
            getReader: () => ({
                read: vi.fn().mockResolvedValue({ done: true }),
            }),
        };
    },
    writable: true,
});

// Mock WASM modules
vi.mock('lights-out-wasm', () => ({
    default: vi.fn().mockResolvedValue(undefined),
    invert_matrix: vi.fn((input: BigUint64Array) => input),
}));

vi.mock('slant-wasm', () => ({
    default: vi.fn().mockResolvedValue(undefined),
    generate_puzzle_wasm: vi.fn(),
    find_cycles_wasm: vi.fn(),
}));

// All warnings have been fixed at the root cause - no suppressions needed!
