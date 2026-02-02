import { renderHook, act } from '@testing-library/react';
import {
    useContainer,
    useWindow,
    useTimer,
    useKeys,
    useCache,
    useMobile,
} from '../hooks';
import * as mui from '../components/mui';

// Mock useMediaQuery from MUI
jest.mock(
    '../components/mui',
    (): Record<string, unknown> => ({
        ...jest.requireActual('../components/mui'),
        useMediaQuery: jest.fn(),
    })
);

describe('Custom Hooks', () => {
    describe('useContainer', () => {
        test('returns zero dimensions when no container provided', () => {
            const { result } = renderHook(() => useContainer(null));
            expect(result.current).toEqual({ width: 0, height: 0 });
        });

        test('returns container dimensions and handles resize', () => {
            const mockElement = {
                offsetWidth: 500,
                offsetHeight: 300,
            } as HTMLElement;

            const mockContainer = {
                current: mockElement,
            };

            const { result } = renderHook(() =>
                useContainer(mockContainer as React.RefObject<HTMLElement>)
            );

            expect(result.current).toEqual({ width: 500, height: 300 });

            // Simulate resize
            act(() => {
                Object.defineProperty(mockElement, 'offsetWidth', {
                    configurable: true,
                    value: 600,
                });
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current.width).toBe(600);
        });
    });

    describe('useWindow', () => {
        test('returns window dimensions and handles resize', () => {
            const { result } = renderHook(() => useWindow());
            const initialWidth = result.current.width;

            act(() => {
                Object.defineProperty(window, 'innerWidth', {
                    configurable: true,
                    value: initialWidth + 50,
                });
                window.dispatchEvent(new Event('resize'));
            });

            expect(result.current.width).toBe(initialWidth + 50);
        });
    });

    describe('useTimer', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        test('manages timer lifecycle', () => {
            const repeatFn = jest.fn();
            const { result } = renderHook(() => useTimer(200));

            act(() => {
                result.current.create({ repeat: repeatFn, speed: 200 });
                jest.advanceTimersByTime(200);
            });
            expect(repeatFn).toHaveBeenCalled();

            act(() => {
                result.current.clear();
                jest.advanceTimersByTime(200);
            });
            expect(repeatFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('useKeys', () => {
        test('handles keydown', () => {
            const handler = jest.fn();
            const { result, unmount } = renderHook(() => useKeys());
            act(() => {
                result.current.create(handler);
            });

            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
            expect(handler).toHaveBeenCalled();

            unmount();
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
            expect(handler).toHaveBeenCalledTimes(1);
        });
    });

    describe('useMobile', () => {
        test('toggles mobile state', () => {
            (mui.useMediaQuery as jest.Mock).mockReturnValue(true);
            const { result, rerender } = renderHook(() => useMobile('sm'));
            expect(result.current).toBe(true);

            (mui.useMediaQuery as jest.Mock).mockReturnValue(false);
            rerender();
            expect(result.current).toBe(false);
        });
    });

    describe('useCache', () => {
        const getState = (s: { v: number }) => ({ ...s, v: s.v + 1 });

        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.useRealTimers();
        });

        test('cycles through states with delay aware actions', () => {
            const { result } = renderHook(() => useCache(getState));
            const initial = { v: 0 };

            act(() => {
                result.current({ type: 'clear', payload: initial });
            });

            let s1;
            act(() => {
                s1 = result.current({ type: 'next', payload: initial });
            });
            expect(s1).toEqual({ v: 1 });

            // Wait for reset delay
            act(() => {
                jest.advanceTimersByTime(100);
            });

            let s2;
            act(() => {
                s2 = result.current({ type: 'prev', payload: initial });
            });
            expect(s2).toEqual({ v: 0 });

            // Wait for reset delay
            act(() => {
                jest.advanceTimersByTime(100);
            });

            let s3;
            act(() => {
                s3 = result.current({ type: 'next', payload: initial });
            });
            // index was 0, next should be 1 (already in cache)
            expect(s3).toEqual({ v: 1 });
        });

        test('ignores actions during processing window', () => {
            const { result } = renderHook(() => useCache(getState));
            const initial = { v: 0 };
            act(() => {
                result.current({ type: 'clear', payload: initial });
            });

            act(() => {
                result.current({ type: 'next', payload: initial });
            });

            // Immediate second next - should return current (v:1) without advancing
            let blocked;
            act(() => {
                blocked = result.current({ type: 'next', payload: initial });
            });
            expect(blocked).toEqual({ v: 1 });
        });
    });
});
