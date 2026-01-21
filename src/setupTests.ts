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
    decode(bytes: Uint8Array): string {
        return String.fromCharCode(...bytes);
    }
} as unknown as typeof TextDecoder;

// All warnings have been fixed at the root cause - no suppressions needed!
