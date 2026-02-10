import { renderHook, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

import {
    getWindow,
    getContainer,
    useSize,
    useWindow,
    useMobile,
    useContainer,
} from '../layout';

import { useMediaQuery } from '@/components/mui';

// Mock useMediaQuery
vi.mock('@/components/mui', () => ({
    useMediaQuery: vi.fn(),
}));

describe('Layout Hooks and Helpers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset window dimensions
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(window, 'innerHeight', {
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

    describe('getContainer', () => {
        test('returns 0 dimensions for null container', () => {
            expect(getContainer(null)).toEqual({ width: 0, height: 0 });
        });

        test('returns dimensions from ref', () => {
            const mockElement = {
                offsetWidth: 500,
                offsetHeight: 300,
            } as HTMLElement;
            const ref = { current: mockElement };
            expect(getContainer(ref)).toEqual({ width: 500, height: 300 });
        });
    });

    describe('useSize', () => {
        test('updates size on resize event', () => {
            const getSize = vi.fn(() => ({ width: 100, height: 100 }));
            const { result } = renderHook(() => useSize(getSize));

            expect(result.current.size).toEqual({ width: 100, height: 100 });

            act(() => {
                getSize.mockReturnValue({ width: 200, height: 200 });
                window.dispatchEvent(new Event('resize'));
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

    describe('useContainer', () => {
        test('updates when container ref changes', () => {
            const mockElement1 = {
                offsetWidth: 100,
                offsetHeight: 100,
            } as HTMLElement;
            const ref1 = { current: mockElement1 };

            const { result, rerender } = renderHook(
                ({ ref }) => useContainer(ref),
                {
                    initialProps: { ref: ref1 },
                }
            );

            expect(result.current).toEqual({ width: 100, height: 100 });

            const mockElement2 = {
                offsetWidth: 200,
                offsetHeight: 200,
            } as HTMLElement;
            const ref2 = { current: mockElement2 };

            rerender({ ref: ref2 });
            expect(result.current).toEqual({ width: 200, height: 200 });
        });

        test('updates on resize', () => {
            const mockElement = {
                offsetWidth: 100,
                offsetHeight: 100,
            } as HTMLElement;
            const ref = { current: mockElement };

            const { result } = renderHook(() => useContainer(ref));

            act(() => {
                Object.defineProperty(mockElement, 'offsetWidth', {
                    value: 150,
                });
                Object.defineProperty(mockElement, 'offsetHeight', {
                    value: 150,
                });
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current).toEqual({ width: 150, height: 150 });
        });
    });
});
