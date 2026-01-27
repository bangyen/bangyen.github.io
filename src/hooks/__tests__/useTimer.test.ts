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
});
