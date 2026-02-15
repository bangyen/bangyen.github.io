import { useState, useEffect, useRef } from 'react';

/**
 * Manages the load-data-or-fallback lifecycle common to every research page.
 *
 * Shows a loading spinner while fetching experiment data and falls back to
 * synthetic data on failure.  This hook encapsulates that shared pattern so
 * page components only declare *what* to load, not *how*.
 *
 * Document title is now managed by PageLayout's `title` prop instead of
 * being set here.
 */
export function useResearchData<T>(
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
    }, []);

    return { data, loading };
}
