import { useEffect } from 'react';

/**
 * Runs an effect after a debounce delay, resetting the timer whenever
 * `deps` change before the delay elapses.
 *
 * This is the delayed counterpart of `useEffect`: the callback fires
 * only once the dependencies have been stable for `delayMs`.  Useful
 * for expensive side-effects that respond to rapidly changing inputs
 * (e.g. persisting state while the user is dragging).
 *
 * @param callback - The side-effect to run (cleanup is handled by the
 *   debounce timer itself, so no cleanup return is needed)
 * @param delayMs - Debounce interval in milliseconds
 * @param deps - Dependency array (same semantics as `useEffect`)
 *
 * @example
 * ```tsx
 * useDebouncedEffect(
 *   () => { localStorage.setItem('state', JSON.stringify(state)); },
 *   300,
 *   [state],
 * );
 * ```
 */
export function useDebouncedEffect(
    callback: () => void,
    delayMs: number,
    deps: React.DependencyList,
) {
    useEffect(() => {
        const timeout = setTimeout(callback, delayMs);
        return () => {
            clearTimeout(timeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, delayMs]);
}
