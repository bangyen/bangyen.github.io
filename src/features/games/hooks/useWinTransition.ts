import { useEffect } from 'react';

import { useStableCallback } from '@/hooks';

/**
 * Custom hook for handling win state transitions with animation delay.
 *
 * Automatically triggers a callback after a configurable delay when the
 * puzzle is solved. Uses `useStableCallback` so the effect only re-runs
 * when `isSolved` or `delay` change, not when the caller passes a new
 * closure.
 *
 * @param isSolved - Whether the puzzle is currently solved
 * @param onComplete - Callback to execute after the delay
 * @param delay - Delay in milliseconds before executing callback (default: 2000)
 *
 * @example
 * ```tsx
 * useWinTransition(
 *   isSolved,
 *   () => dispatch({ type: 'new' }),
 *   2000
 * );
 * ```
 */
export function useWinTransition(
    isSolved: boolean,
    onComplete: () => void,
    delay = 2000,
) {
    const stableOnComplete = useStableCallback(onComplete);

    useEffect(() => {
        if (isSolved) {
            const timeout = setTimeout(() => {
                stableOnComplete();
            }, delay);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isSolved, delay, stableOnComplete]);
}
