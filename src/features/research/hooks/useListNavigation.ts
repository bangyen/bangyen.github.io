import { useCallback } from 'react';

interface UseListNavigationOptions {
    count: number;
    containerRole?: string;
    indexAttribute?: string;
}

/**
 * Hook for handling 1D list keyboard navigation via arrow keys.
 * Implements roving-tabindex pattern: only the active item is in tab order,
 * others are tabIndex=-1. Left/Right arrows move focus between items.
 * Home/End jump to first/last.
 *
 * Used for toolbar patterns like ResearchViewSelector.
 */
export function useListNavigation({
    count,
    containerRole = 'toolbar',
    indexAttribute = 'data-index',
}: UseListNavigationOptions) {
    const getItemProps = useCallback(
        (index: number, isActive: boolean) => ({
            tabIndex: isActive ? 0 : -1,
            [indexAttribute]: index,
            onKeyDown: (e: React.KeyboardEvent) => {
                const { key, currentTarget } = e;

                let nextIndex: number | null = null;

                switch (key) {
                    case 'ArrowLeft': {
                        nextIndex = Math.max(0, index - 1);
                        break;
                    }
                    case 'ArrowRight': {
                        nextIndex = Math.min(count - 1, index + 1);
                        break;
                    }
                    case 'Home': {
                        nextIndex = 0;
                        break;
                    }
                    case 'End': {
                        nextIndex = count - 1;
                        break;
                    }
                    default: {
                        return;
                    }
                }

                // If the index didn't change, don't prevent default or focus
                if (nextIndex === index) {
                    return;
                }

                e.preventDefault();

                // Find the container and query for the next element
                const container = currentTarget.closest(
                    `[role="${containerRole}"]`,
                );
                if (!container) return;

                const nextElement = container.querySelector(
                    `[${indexAttribute}="${String(nextIndex)}"]`,
                );

                if (nextElement instanceof HTMLElement) {
                    nextElement.focus();
                }
            },
        }),
        [count, containerRole, indexAttribute],
    );

    return { getItemProps };
}
