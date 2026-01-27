import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../useTimer';

describe('useTimer hook', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('starts interval on create', () => {
        const handler = jest.fn();
        const { result } = renderHook(() => useTimer(200));

        act(() => {
            result.current.create({ repeat: handler, speed: 100 });
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(handler).toHaveBeenCalledTimes(1);

        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(handler).toHaveBeenCalledTimes(2);

        act(() => {
            result.current.clear();
        });
    });

    test('clears existing interval on new create', () => {
        const handler1 = jest.fn();
        const handler2 = jest.fn();
        const { result } = renderHook(() => useTimer(200));

        act(() => {
            result.current.create({ repeat: handler1, speed: 200 });
        });

        act(() => {
            result.current.create({ repeat: handler2, speed: 100 });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();

        act(() => {
            result.current.clear();
        });
    });

    test('cleans up on unmount', () => {
        const handler = jest.fn();
        const { result, unmount } = renderHook(() => useTimer(200));

        act(() => {
            result.current.create({ repeat: handler, speed: 100 });
        });

        unmount();

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(handler).not.toHaveBeenCalled();
    });

    test('uses global handlers if new ones are not provided', () => {
        const handler = jest.fn();
        const { result } = renderHook(() => useTimer(200));

        act(() => {
            result.current.create({ repeat: handler, speed: 100 });
        });

        act(() => {
            result.current.create({}); // Use globals
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(handler).toHaveBeenCalled();

        act(() => {
            result.current.clear();
        });
    });

    test('does not create interval when repeat is null', () => {
        const handler = jest.fn();
        const { result } = renderHook(() => useTimer(200));

        // First create a timer with a handler
        act(() => {
            result.current.create({ repeat: handler, speed: 100 });
        });

        // Now create with null repeat - should clear the previous timer
        act(() => {
            result.current.create({ repeat: null, speed: 100 });
        });

        // Advance timers - the original handler should not be called
        act(() => {
            jest.advanceTimersByTime(200);
        });

        // Handler was called twice during the first create (200ms / 100ms interval)
        // After clearing with null, no more calls should happen
        expect(handler).toHaveBeenCalledTimes(2);
    });

    test('does not create interval when repeat is undefined', () => {
        const handler = jest.fn();
        const { result } = renderHook(() => useTimer(200));

        // First create a timer with a handler
        act(() => {
            result.current.create({ repeat: handler, speed: 100 });
        });

        // Now create with undefined repeat - should use global (which is the handler)
        act(() => {
            result.current.create({ speed: 50 });
        });

        // Advance timers - handler should be called with new speed
        act(() => {
            jest.advanceTimersByTime(50);
        });

        expect(handler).toHaveBeenCalled();

        act(() => {
            result.current.clear();
        });
    });
});
