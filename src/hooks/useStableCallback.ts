import { useRef, useCallback } from 'react';

/**
 * Returns a function with a stable identity that always delegates to the
 * latest version of `callback`.
 *
 * This eliminates the boilerplate of manually storing a callback in a ref
 * and reading `.current` inside effects or memoised functions.  The
 * returned wrapper never changes identity, so it is safe to include in
 * dependency arrays without causing spurious re-runs.
 *
 * @template T - The callback signature
 * @param callback - The latest version of the callback
 * @returns A stable-identity wrapper that forwards to the latest callback
 *
 * @example
 * ```tsx
 * const stableOnChange = useStableCallback(props.onChange);
 *
 * useEffect(() => {
 *   stableOnChange(value);
 * }, [value, stableOnChange]); // stableOnChange never triggers re-runs
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStableCallback<T extends (...args: any[]) => any>(
    callback: T,
): T {
    const ref = useRef(callback);
    ref.current = callback;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    return useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}
