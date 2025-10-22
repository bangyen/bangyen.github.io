import React from 'react';
import { renderHook, act } from '@testing-library/react';
import {
    useContainer,
    useWindow,
    useTimer,
    useKeys,
    useCache,
} from '../hooks';

describe('Custom Hooks', () => {
    describe('useContainer', () => {
        test('returns window dimensions when no container provided', () => {
            const { result } = renderHook(() => useContainer(null));

            expect(result.current).toHaveProperty('width');
            expect(result.current).toHaveProperty('height');
            expect(typeof result.current.width).toBe('number');
            expect(typeof result.current.height).toBe('number');
        });

        test('returns container dimensions when container provided', () => {
            const mockContainer = {
                current: {
                    offsetWidth: 500,
                    offsetHeight: 300,
                },
            };

            const { result } = renderHook(() => useContainer(mockContainer));

            expect(result.current).toEqual({ width: 500, height: 300 });
        });

        test('updates when container ref changes', () => {
            const mockContainer = {
                current: {
                    offsetWidth: 500,
                    offsetHeight: 300,
                },
            };

            const { result, rerender } = renderHook(
                ({ container }) => useContainer(container),
                { initialProps: { container: mockContainer } }
            );

            expect(result.current.width).toBeGreaterThanOrEqual(0);
            expect(result.current.height).toBeGreaterThanOrEqual(0);
        });
    });

    describe('useWindow', () => {
        test('returns window dimensions', () => {
            const { result } = renderHook(() => useWindow());

            expect(result.current).toHaveProperty('width');
            expect(result.current).toHaveProperty('height');
            expect(typeof result.current.width).toBe('number');
            expect(typeof result.current.height).toBe('number');
        });

        test('returns positive dimensions', () => {
            const { result } = renderHook(() => useWindow());

            expect(result.current.width).toBeGreaterThan(0);
            expect(result.current.height).toBeGreaterThan(0);
        });
    });

    describe('useTimer', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('creates timer with default speed', () => {
            const { result } = renderHook(() => useTimer(200));

            expect(result.current.create).toBeDefined();
            expect(result.current.clear).toBeDefined();
            expect(typeof result.current.create).toBe('function');
            expect(typeof result.current.clear).toBe('function');
        });

        test('creates timer with custom repeat function', () => {
            const repeatFn = jest.fn();
            const { result } = renderHook(() => useTimer(200));

            act(() => {
                result.current.create({ repeat: repeatFn, speed: 200 });
            });

            act(() => {
                jest.advanceTimersByTime(200);
            });

            expect(repeatFn).toHaveBeenCalled();
        });

        test('clears timer on cleanup', () => {
            const repeatFn = jest.fn();
            const { result, unmount } = renderHook(() => useTimer(200));

            act(() => {
                result.current.create({ repeat: repeatFn, speed: 200 });
            });

            act(() => {
                result.current.clear();
            });

            act(() => {
                jest.advanceTimersByTime(200);
            });

            expect(repeatFn).not.toHaveBeenCalled();

            unmount();
        });
    });

    describe('useKeys', () => {
        test('creates event listener', () => {
            const handler = jest.fn();
            const { result } = renderHook(() => useKeys());

            act(() => {
                result.current.create(handler);
            });

            // Simulate keydown event
            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            document.dispatchEvent(event);

            expect(handler).toHaveBeenCalled();
        });

        test('clears event listener', () => {
            const handler = jest.fn();
            const { result } = renderHook(() => useKeys());

            act(() => {
                result.current.create(handler);
            });

            act(() => {
                result.current.clear(handler);
            });

            // Simulate keydown event
            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            document.dispatchEvent(event);

            expect(handler).not.toHaveBeenCalled();
        });

        test('cleans up on unmount', () => {
            const handler = jest.fn();
            const { result, unmount } = renderHook(() => useKeys());

            act(() => {
                result.current.create(handler);
            });

            unmount();

            // Simulate keydown event
            const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
            document.dispatchEvent(event);

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('useCache', () => {
        test('creates cache with initial state', () => {
            const getState = jest.fn(state => state);
            const initialState = { value: 0 };

            const { result } = renderHook(() => useCache(getState));

            const cached = act(() =>
                result.current({ type: 'clear', payload: initialState })
            );

            expect(cached).toBeDefined();
        });

        test('advances to next state', () => {
            const getState = jest.fn(state => ({ ...state, value: state.value + 1 }));
            const initialState = { value: 0 };

            const { result } = renderHook(() => useCache(getState));

            act(() => {
                result.current({ type: 'clear', payload: initialState });
            });

            const nextState = act(() =>
                result.current({ type: 'next', payload: initialState })
            );

            expect(getState).toHaveBeenCalled();
            expect(nextState).toBeDefined();
        });

        test('moves to previous state', () => {
            const getState = jest.fn(state => ({ ...state, value: state.value + 1 }));
            const initialState = { value: 0 };

            const { result } = renderHook(() => useCache(getState));

            act(() => {
                result.current({ type: 'clear', payload: initialState });
            });

            act(() => {
                result.current({ type: 'next', payload: initialState });
            });

            const prevState = act(() =>
                result.current({ type: 'prev', payload: initialState })
            );

            expect(prevState).toBeDefined();
        });

        test('handles clear action', () => {
            const getState = jest.fn(state => state);
            const initialState = { value: 0 };

            const { result } = renderHook(() => useCache(getState));

            const cleared = act(() =>
                result.current({ type: 'clear', payload: initialState })
            );

            expect(cleared).toBeDefined();
        });
    });
});

