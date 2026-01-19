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
        touchEnd.current = null;
        touchYEnd.current = null;
        touchStart.current = e.targetTouches[0].clientX;
        touchYStart.current = e.targetTouches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        touchEnd.current = e.targetTouches[0].clientX;
        touchYEnd.current = e.targetTouches[0].clientY;
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
