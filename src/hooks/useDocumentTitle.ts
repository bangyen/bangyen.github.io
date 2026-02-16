import { useEffect } from 'react';

/**
 * Sets `document.title` reactively when the given title changes.
 *
 * Extracted from `PageLayout` so the layout component is free of
 * side-effects and the same logic can be reused by any component
 * that needs to manage the document title.
 *
 * @param title - The title to set. When `undefined` or empty the
 *                effect is skipped and the previous title is preserved.
 */
export function useDocumentTitle(title?: string): void {
    useEffect(() => {
        if (title) document.title = title;
    }, [title]);
}
