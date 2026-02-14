import { useMediaQuery } from '@mui/material';
import { renderHook, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

import { getWindow, useSize, useWindow, useMobile } from '../layout';

// Mock useMediaQuery
vi.mock('@mui/material', () => ({
    useMediaQuery: vi.fn(),
}));

describe('Layout Hooks and Helpers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset window dimensions
        Object.defineProperty(globalThis, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(globalThis, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 768,
        });
    });

    describe('getWindow', () => {
        test('returns current window dimensions', () => {
            const size = getWindow();
            expect(size).toEqual({ width: 1024, height: 768 });
        });
    });

    describe('useSize', () => {
        test('updates size on resize event', () => {
            const getSize = vi.fn(() => ({ width: 100, height: 100 }));
            const { result } = renderHook(() => useSize(getSize));

            expect(result.current.size).toEqual({ width: 100, height: 100 });

            act(() => {
                getSize.mockReturnValue({ width: 200, height: 200 });
                globalThis.dispatchEvent(new Event('resize'));
            });

            expect(result.current.size).toEqual({ width: 200, height: 200 });
        });
    });

    describe('useWindow', () => {
        test('returns window size', () => {
            const { result } = renderHook(() => useWindow());
            expect(result.current).toEqual({ width: 1024, height: 768 });
        });
    });

    describe('useMobile', () => {
        test('calls useMediaQuery with proper breakpoint', () => {
            (useMediaQuery as Mock).mockReturnValue(true);
            const { result } = renderHook(() => useMobile('md'));

            expect(result.current).toBe(true);
            const mockCalls = (useMediaQuery as Mock).mock.calls as [
                [
                    (theme: {
                        breakpoints: { down: (s: string) => string };
                    }) => string,
                ],
            ];
            const queryFn = mockCalls[0][0];
            const mockTheme = {
                breakpoints: { down: (s: string) => `down-${s}` },
            };
            expect(queryFn(mockTheme)).toBe('down-md');
        });
    });
});
