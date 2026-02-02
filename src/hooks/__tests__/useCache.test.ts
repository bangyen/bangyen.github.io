import { renderHook, act } from '@testing-library/react';
import { useCache } from '../useCache';

describe('useCache Hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('initializes and clears cache', () => {
        const getState = jest.fn(s => s);
        const { result } = renderHook(() => useCache(getState));

        let state;
        act(() => {
            state = result.current({ type: 'clear', payload: { count: 0 } });
        });
        expect(state).toEqual({ count: 0 });
    });

    test('handles next action and increments index', () => {
        const getState = jest.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        let nextState;
        act(() => {
            nextState = result.current({ type: 'next', payload: null });
        });

        expect(nextState).toEqual({ count: 1 });
        expect(getState).toHaveBeenCalledWith({ count: 0 });
    });

    test('prevents double processing', () => {
        const getState = jest.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        let state1, state2;
        act(() => {
            state1 = result.current({ type: 'next', payload: null });
            state2 = result.current({ type: 'next', payload: null });
        });

        expect(state1).toEqual({ count: 1 });
        expect(state2).toEqual({ count: 1 }); // Same state due to prevention
        expect(getState).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(200); // Wait for resetDelay
        });

        act(() => {
            state2 = result.current({ type: 'next', payload: null });
        });
        expect(state2).toEqual({ count: 2 });
    });

    test('handles prev action', () => {
        const getState = jest.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        act(() => {
            result.current({ type: 'next', payload: null });
        });

        let prevState;
        act(() => {
            jest.advanceTimersByTime(200);
            prevState = result.current({ type: 'prev', payload: null });
        });

        expect(prevState).toEqual({ count: 0 });
    });

    test('avoids push when state does not change', () => {
        const getState = jest.fn(s => s); // Returns same state
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        act(() => {
            result.current({ type: 'next', payload: null });
        });

        // If it didn't push, index remains 0
        const state = result.current({ type: 'prev', payload: null });
        expect(state).toEqual({ count: 0 });
    });

    test('uses cached states when index is behind', () => {
        const getState = jest.fn((s: { count: number }) => ({
            count: s.count + 1,
        }));
        const { result } = renderHook(() => useCache(getState));

        act(() => {
            result.current({ type: 'clear', payload: { count: 0 } });
        });

        act(() => {
            result.current({ type: 'next', payload: null });
            jest.advanceTimersByTime(200);
            result.current({ type: 'next', payload: null });
            jest.advanceTimersByTime(200);
        });

        // Index is 2 (count: 2). Go back.
        act(() => {
            result.current({ type: 'prev', payload: null });
            jest.advanceTimersByTime(200);
        });

        // Now index is 1. Go next. Should NOT call getState.
        getState.mockClear();
        let state;
        act(() => {
            state = result.current({ type: 'next', payload: null });
        });

        expect(state).toEqual({ count: 2 });
        expect(getState).not.toHaveBeenCalled();
    });
});
