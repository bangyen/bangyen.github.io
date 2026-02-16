import { useState, useEffect, useRef } from 'react';

/**
 * Return type for `useAsync`, providing the resolved data, a loading
 * flag, and an optional error message.
 */
export interface UseAsyncResult<T> {
    /** The resolved data, or the fallback value while loading / on error. */
    data: T;
    /** `true` while the async operation is in progress. */
    loading: boolean;
    /** Error message if the async operation failed, otherwise `null`. */
    error: string | null;
}

/**
 * Generic hook for one-shot async operations with a synchronous
 * fallback.  Provides a uniform `{ data, loading, error }` shape
 * that mirrors `useWorker` and can be reused across any feature
 * that loads data asynchronously.
 *
 * The `loader` and `fallback` functions are captured by ref so that
 * callers can pass inline closures without triggering re-fetches.
 *
 * @template T - Type of the resolved data
 * @param loader - Async function that returns the data
 * @param fallback - Synchronous function that returns default data
 *   used as the initial value and on error
 * @returns `{ data, loading, error }`
 *
 * @example
 * ```tsx
 * const { data, loading, error } = useAsync(
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

    const loaderRef = useRef(loader);
    const fallbackRef = useRef(fallback);
    loaderRef.current = loader;
    fallbackRef.current = fallback;

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await loaderRef.current();
                setData(() => result);
            } catch (error_: unknown) {
                const message =
                    error_ instanceof Error
                        ? error_.message
                        : 'An unknown error occurred';
                setError(message);
                setData(() => fallbackRef.current());
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, []);

    return { data, loading, error };
}
