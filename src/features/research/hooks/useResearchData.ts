import { useAsync, type UseAsyncResult } from '@/hooks/useAsync';

/**
 * Manages the load-data-or-fallback lifecycle common to every research page.
 *
 * Thin wrapper around `useAsync` that preserves the existing API while
 * adding an `error` field.  Page components only declare *what* to load,
 * not *how*.
 */
export function useResearchData<T>(
    loader: () => Promise<T>,
    fallback: () => T,
): UseAsyncResult<T> {
    return useAsync(loader, fallback);
}
