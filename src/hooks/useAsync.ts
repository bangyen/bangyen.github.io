import { useState, useEffect, useCallback } from 'react';

import { useStableCallback } from './useStableCallback';

/**
 * Return type for `useAsync`, providing the resolved data, a loading
 * flag, an optional error message, and a manual re-trigger callback.
 */
export interface UseAsyncResult<T> {
    /** The resolved data, or the fallback value while loading / on error. */
    data: T;
    /** `true` while the async operation is in progress. */
    loading: boolean;
    /** Error message if the async operation failed, otherwise `null`. */
    error: string | null;
    /** Re-run the loader. Cancels any in-flight request first. */
    refetch: () => void;
}

/**
 * Generic hook for one-shot async operations with a synchronous
 * fallback.  Provides a uniform `{ data, loading, error, refetch }`
 * shape that mirrors `useWorker` and can be reused across any feature
 * that loads data asynchronously.
 *
 * Uses `useStableCallback` so that callers can pass inline closures
 * without triggering re-fetches.  In-flight requests are cancelled
 * on unmount and on refetch via an internal version counter, so stale
 * results from superseded loads never update state.
 *
 * @template T - Type of the resolved data
 * @param loader - Async function that returns the data
 * @param fallback - Synchronous function that returns default data
 *   used as the initial value and on error
 * @returns `{ data, loading, error, refetch }`
 *
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useAsync(
 *   () => fetch('/api/data').then(r => r.json()),
 *   () => [],
 * );
 * ```
 */
export function useAsync<T>(
    loader: () => Promise<T>,
    fallback: () => T,
): UseAsyncResult<T> {
    const [data, setData] = useState<T>(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    const stableLoader = useStableCallback(loader);
    const stableFallback = useStableCallback(fallback);

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await stableLoader();
                if (!cancelled) {
                    setData(() => result);
                }
            } catch (error_: unknown) {
                if (!cancelled) {
                    const message =
                        error_ instanceof Error
                            ? error_.message
                            : 'An unknown error occurred';
                    setError(message);
                    setData(() => stableFallback());
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadData();

        return () => {
            cancelled = true;
        };
    }, [stableLoader, stableFallback, version]);

    const refetch = useCallback(() => {
        setVersion(v => v + 1);
    }, []);

    return { data, loading, error, refetch };
}
