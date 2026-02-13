import { renderHook, act } from '@testing-library/react';

import { useCache } from '../useCache';

describe('useCache Hook', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('initializes and clears cache', () => {
        const getState = vi.fn((s: { count: number }) => s);
        const { result } = renderHook(() => useCache(getState));

        let state: { count: number } | undefined;
        act(() => {
            state = result.current({
                type: 'clear',
                payload: { count: 0 },
            }) as { count: number };
        });
        expect(state).toEqual({ count: 0 });
    });

    test('handles next action and increments index', () => {
        const getState = vi.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        let nextState: { count: number } | undefined;
        act(() => {
            nextState = result.current({ type: 'next', payload: null }) as {
                count: number;
            };
        });

        expect(nextState).toEqual({ count: 1 });
        expect(getState).toHaveBeenCalledWith({ count: 0 });
    });

    test('prevents double processing', () => {
        const getState = vi.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        let state1: { count: number } | undefined;
        let state2: { count: number } | undefined;
        act(() => {
            state1 = result.current({ type: 'next', payload: null }) as {
                count: number;
            };
            state2 = result.current({ type: 'next', payload: null }) as {
                count: number;
            };
        });

        expect(state1).toEqual({ count: 1 });
        expect(state2).toEqual({ count: 1 }); // Same state due to prevention
        expect(getState).toHaveBeenCalledTimes(1);

        act(() => {
            vi.advanceTimersByTime(200); // Wait for resetDelay
        });

        act(() => {
            state2 = result.current({ type: 'next', payload: null });
        });
        expect(state2).toEqual({ count: 2 });
    });

    test('handles prev action', () => {
        const getState = vi.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        act(() => {
            result.current({ type: 'next', payload: null });
        });

        let prevState: { count: number } | undefined;
        act(() => {
            vi.advanceTimersByTime(200);
            prevState = result.current({ type: 'prev', payload: null }) as {
                count: number;
            };
        });

        expect(prevState).toEqual({ count: 0 });
    });

    test('avoids push when state does not change', () => {
        const getState = vi.fn((s: { count: number }) => s); // Returns same state
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        act(() => {
            result.current({ type: 'next', payload: null });
        });

        // If it didn't push, index remains 0
        const state = result.current({ type: 'prev', payload: null }) as {
            count: number;
        };
        expect(state).toEqual({ count: 0 });
    });

    test('uses cached states when index is behind', () => {
        const getState = vi.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        act(() => {
            result.current({ type: 'next', payload: null });
            vi.advanceTimersByTime(200);
            result.current({ type: 'next', payload: null });
            vi.advanceTimersByTime(200);
        });

        // Index is 2 (count: 2). Go back.
        act(() => {
            result.current({ type: 'prev', payload: null });
            vi.advanceTimersByTime(200);
        });

        // Now index is 1. Go next. Should NOT call getState.
        getState.mockClear();
        let state: { count: number } | undefined;
        act(() => {
            state = result.current({ type: 'next', payload: null }) as {
                count: number;
            };
        });

        expect(state).toEqual({ count: 2 });
        expect(getState).not.toHaveBeenCalled();
    });

    test('handles next/prev without initial clear', () => {
        const getState = vi.fn((s: number) => s + 1);
        const { result } = renderHook(() => useCache(getState));

        // next without clear
        let state: number | undefined;
        act(() => {
            state = result.current({ type: 'next', payload: 100 });
        });
        expect(state).toBe(100);

        // prev without clear
        act(() => {
            state = result.current({ type: 'prev', payload: 200 });
        });
        expect(state).toBe(200);
    });

    test('handles unknown action type', () => {
        const getState = vi.fn((s: number) => s + 1);
        const { result } = renderHook(() => useCache(getState));

        let state: number | undefined;
        act(() => {
            state = result.current({
                type: 'unknown' as any,
                payload: 999,
            });
        });
        expect(state).toBe(999);
    });

    test('double processing with no state in cache', () => {
        const getState = vi.fn((s: number) => s + 1);
        const { result } = renderHook(() => useCache(getState));

        // Manually trigger double processing if possible,
        // but it defaults to true only if config is true.
        // Assuming GLOBAL_CONFIG.processing.doubleProcessingPrevention is true
        // as per previous report of 69% coverage.

        let state: number | undefined;
        act(() => {
            // first call to set processingRef.current = true
            result.current({ type: 'next', payload: 1 });
            // second call immediately
            state = result.current({ type: 'next', payload: 2 });
        });
        expect(state).toBe(2); // Since cache is empty, returns payload
    });

    test('double processing prev with no state in cache', () => {
        const getState = vi.fn((s: { v: number }) => ({ v: s.v + 1 }));
        const { result } = renderHook(() => useCache(getState));

        let state: { v: number } | undefined;
        act(() => {
            result.current({ type: 'prev', payload: { v: 1 } });
            state = result.current({ type: 'prev', payload: { v: 2 } }) as {
                v: number;
            };
        });
        expect(state.v).toBe(2);
    });

    test('prev at boundary (index 0)', () => {
        const getState = vi.fn((s: { v: number }) => ({ v: s.v + 1 }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { v: 10 } });
        });

        let state: { v: number } | undefined;
        act(() => {
            state = result.current({ type: 'prev', payload: null }) as {
                v: number;
            };
        });

        expect(state.v).toBe(10);
        // Repeated prev at boundary
        act(() => {
            vi.advanceTimersByTime(200);
            state = result.current({ type: 'prev', payload: null }) as {
                v: number;
            };
        });
        expect(state.v).toBe(10);
    });

    test('next when getState returns same object (no-op)', () => {
        const stateObj = { count: 1 };
        const getState = vi.fn(() => stateObj);
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: stateObj });
        });

        act(() => {
            vi.advanceTimersByTime(200);
            result.current({ type: 'next', payload: null });
        });

        // If it was a no-op, index should still be 0, and prev should return same state
        act(() => {
            vi.advanceTimersByTime(200);
            const res = result.current({ type: 'prev', payload: null }) as {
                count: number;
            };
            // Note: useCache implementation returns a NEW object via spread: { ...s }
            expect(res.count).toBe(stateObj.count);
        });
    });

    test('double processing returns current state when cache is not empty', () => {
        const getState = vi.fn((s: { v: number }) => ({ v: s.v + 1 }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { v: 10 } });
        });

        let state: { v: number } | undefined;
        act(() => {
            vi.advanceTimersByTime(200);
            // First call triggers processingRef = true
            result.current({ type: 'next', payload: null });
            // Second call immediately should return states[index.current]
            state = result.current({ type: 'next', payload: { v: 999 } }) as {
                v: number;
            };
        });

        expect(state.v).toBe(11);
        expect(state.v).not.toBe(999);
    });
});
