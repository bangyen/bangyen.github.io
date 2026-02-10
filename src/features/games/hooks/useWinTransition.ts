import { useEffect, useRef } from 'react';

/**
 * Custom hook for handling win state transitions with animation delay.
 *
 * Automatically triggers a callback after a configurable delay when the
 * puzzle is solved. Uses a ref to avoid dependency issues with mutable callbacks.
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
    delay = 2000
) {
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    useEffect(() => {
        if (isSolved) {
            const timeout = setTimeout(() => {
                onCompleteRef.current();
            }, delay);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [isSolved, delay]);
}
