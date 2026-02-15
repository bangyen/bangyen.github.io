import { useEffect, useRef, useState } from 'react';

/**
 * Suppresses CSS transitions for one animation frame whenever `key` changes.
 *
 * Board regenerations (resize / refresh) cause the new state to appear
 * instantly without artifacts from border-radius and color transitions
 * animating between old and new grids.  The very first render is excluded
 * so the initial board paints normally.
 *
 * @param key - A string that changes whenever the board is regenerated.
 * @returns `true` during the single frame where transitions should be
 *   disabled, `false` otherwise.
 */
export function useSkipTransition(key: string): boolean {
    const prevKeyRef = useRef('');
    const skipRef = useRef(false);
    const [, setTick] = useState(0);

    if (key !== prevKeyRef.current) {
        // Skip transitions on every regeneration except the very first render.
        skipRef.current = prevKeyRef.current !== '';
        prevKeyRef.current = key;
    }

    useEffect(() => {
        if (!skipRef.current) return;
        const raf = requestAnimationFrame(() => {
            skipRef.current = false;
            setTick(t => t + 1);
        });
        return () => {
            cancelAnimationFrame(raf);
        };
    }, [key]);

    return skipRef.current;
}
