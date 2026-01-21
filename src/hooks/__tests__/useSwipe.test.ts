/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from '@testing-library/react';
import { useSwipe } from '../useSwipe';
import { TouchEvent } from 'react';

describe('useSwipe', () => {
    it('should detect swipe up', () => {
        const onSwipeUp = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeUp }));

        act(() => {
            result.current.onTouchStart({
                targetTouches: [{ clientX: 0, clientY: 100 }],
            } as any as TouchEvent);
            result.current.onTouchMove({
                targetTouches: [{ clientX: 0, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchEnd();
        });

        expect(onSwipeUp).toHaveBeenCalled();
    });

    it('should detect swipe down', () => {
        const onSwipeDown = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeDown }));

        act(() => {
            result.current.onTouchStart({
                targetTouches: [{ clientX: 0, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchMove({
                targetTouches: [{ clientX: 0, clientY: 100 }],
            } as any as TouchEvent);
            result.current.onTouchEnd();
        });

        expect(onSwipeDown).toHaveBeenCalled();
    });

    it('should detect swipe left', () => {
        const onSwipeLeft = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeLeft }));

        act(() => {
            result.current.onTouchStart({
                targetTouches: [{ clientX: 100, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchMove({
                targetTouches: [{ clientX: 0, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchEnd();
        });

        expect(onSwipeLeft).toHaveBeenCalled();
    });

    it('should detect swipe right', () => {
        const onSwipeRight = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeRight }));

        act(() => {
            result.current.onTouchStart({
                targetTouches: [{ clientX: 0, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchMove({
                targetTouches: [{ clientX: 100, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchEnd();
        });

        expect(onSwipeRight).toHaveBeenCalled();
    });

    it('should not detect swipe if distance is less than threshold', () => {
        const onSwipeUp = jest.fn();
        const { result } = renderHook(() => useSwipe({ onSwipeUp }));

        act(() => {
            result.current.onTouchStart({
                targetTouches: [{ clientX: 0, clientY: 40 }],
            } as any as TouchEvent);
            result.current.onTouchMove({
                targetTouches: [{ clientX: 0, clientY: 0 }],
            } as any as TouchEvent);
            result.current.onTouchEnd();
        });

        expect(onSwipeUp).not.toHaveBeenCalled();
    });
});
