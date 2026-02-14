import { useState, useEffect, useRef } from 'react';

/**
 * Manages the load-data-or-fallback lifecycle common to every research page.
 *
 * Each research demo sets `document.title`, shows a loading spinner while
 * fetching experiment data, and falls back to synthetic data on failure.
 * This hook encapsulates that shared pattern so page components only
 * declare *what* to load, not *how*.
 */
export function useResearchData<T>(
    pageTitle: string,
    loader: () => Promise<T>,
    fallback: () => T,
): { data: T; loading: boolean } {
    const [data, setData] = useState<T>(fallback);
    const [loading, setLoading] = useState(true);

    // Refs keep the latest loader/fallback without triggering re-runs.
    const loaderRef = useRef(loader);
    const fallbackRef = useRef(fallback);
    loaderRef.current = loader;
    fallbackRef.current = fallback;

    useEffect(() => {
        document.title = pageTitle;

        const loadData = async () => {
            setLoading(true);

            try {
                const result = await loaderRef.current();
                setData(() => result);
            } catch {
                setData(() => fallbackRef.current());
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, [pageTitle]);

    return { data, loading };
}
