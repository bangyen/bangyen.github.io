import { useEffect } from 'react';

/**
 * Custom hook to update the document title.
 *
 * Automatically updates the browser tab title whenever the title prop changes.
 * Useful for indicating the current page or game state.
 *
 * @param title - The title to display in the browser tab
 *
 * @example
 * ```tsx
 * usePageTitle('Lights Out Puzzle');
 *
 * // Later, update the title
 * usePageTitle(`Lights Out - Level ${level}`);
 * ```
 */
export function usePageTitle(title: string) {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
