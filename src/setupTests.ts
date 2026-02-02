// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn(),
}));

// Mock TextEncoder for Node.js environment
global.TextEncoder = class TextEncoder {
    encoding = 'utf-8';
    encode(str: string): Uint8Array {
        return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
    }
    encodeInto(
        source: string,
        destination: Uint8Array
    ): { read: number; written: number } {
        const encoded = this.encode(source);
        destination.set(encoded);
        return { read: source.length, written: encoded.length };
    }
} as unknown as typeof TextEncoder;

global.TextDecoder = class TextDecoder {
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
Object.defineProperty(global, 'Response', {
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
Object.defineProperty(global, 'ReadableStream', {
    value: class ReadableStream {
        constructor(options: { start?: (controller: unknown) => void } = {}) {
            if (options.start) {
                const controller = {
                    enqueue: jest.fn(),
                    close: jest.fn(),
                };
                options.start(controller);
            }
        }
        getReader() {
            return {
                read: jest.fn().mockResolvedValue({ done: true }),
            };
        }
    },
    writable: true,
});

// Mock DecompressionStream
Object.defineProperty(global, 'DecompressionStream', {
    value: class DecompressionStream {
        writable = {
            getWriter: () => ({
                write: jest.fn().mockResolvedValue(undefined),
                close: jest.fn().mockResolvedValue(undefined),
            }),
        };
        readable = {
            getReader: () => ({
                read: jest.fn().mockResolvedValue({ done: true }),
            }),
        };
    },
    writable: true,
});

// All warnings have been fixed at the root cause - no suppressions needed!
