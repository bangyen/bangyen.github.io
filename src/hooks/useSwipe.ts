import { useRef, TouchEvent } from 'react';

interface SwipeInput {
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
}

export function useSwipe({
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
}: SwipeInput) {
    const touchStart = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);
    const touchYStart = useRef<number | null>(null);
    const touchYEnd = useRef<number | null>(null);

    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        const touch = e.targetTouches[0];
        if (!touch) return;

        touchEnd.current = null;
        touchYEnd.current = null;
        touchStart.current = touch.clientX;
        touchYStart.current = touch.clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        const touch = e.targetTouches[0];
        if (!touch) return;
        touchEnd.current = touch.clientX;
        touchYEnd.current = touch.clientY;
    };

    const onTouchEnd = () => {
        if (
            touchStart.current === null ||
            touchEnd.current === null ||
            touchYStart.current === null ||
            touchYEnd.current === null
        )
            return;

        const distanceX = touchStart.current - touchEnd.current;
        const distanceY = touchYStart.current - touchYEnd.current;
        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

        if (isHorizontalSwipe) {
            if (Math.abs(distanceX) > minSwipeDistance) {
                if (distanceX > 0) {
                    onSwipeLeft?.();
                } else {
                    onSwipeRight?.();
                }
            }
        } else {
            if (Math.abs(distanceY) > minSwipeDistance) {
                if (distanceY > 0) {
                    onSwipeUp?.();
                } else {
                    onSwipeDown?.();
                }
            }
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}
