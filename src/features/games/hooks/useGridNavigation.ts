import { useCallback } from 'react';

interface UseGridNavigationOptions {
    rows: number;
    cols: number;
    posAttribute?: string;
}

const NAVIGATION_KEYS: Record<string, 'up' | 'down' | 'left' | 'right'> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    W: 'up',
    a: 'left',
    A: 'left',
    s: 'down',
    S: 'down',
    d: 'right',
    D: 'right',
};

/**
 * Hook for handling 2D grid keyboard navigation via arrow keys and WASD.
 * Finds neighbor elements using a position attribute and focuses them.
 */
export function useGridNavigation({
    rows,
    cols,
    posAttribute = 'data-pos',
}: UseGridNavigationOptions) {
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            const { key, currentTarget } = e;
            const direction = NAVIGATION_KEYS[key];
            if (!direction) {
                return;
            }

            const pos = currentTarget.getAttribute(posAttribute);
            if (!pos) return;

            const coords = pos.split(',').map(Number);
            const r = coords[0];
            const c = coords[1];
            if (r === undefined || c === undefined || isNaN(r) || isNaN(c))
                return;

            let nextR = r;
            let nextC = c;

            switch (direction) {
                case 'up': {
                    nextR = Math.max(0, r - 1);
                    break;
                }
                case 'down': {
                    nextR = Math.min(rows - 1, r + 1);
                    break;
                }
                case 'left': {
                    nextC = Math.max(0, c - 1);
                    break;
                }
                case 'right': {
                    nextC = Math.min(cols - 1, c + 1);
                    break;
                }
            }

            if (nextR === r && nextC === c) return;

            e.preventDefault();
            const nextPos = `${nextR.toString()},${nextC.toString()}`;
            const board = currentTarget.closest('[role="grid"]');
            if (!board) return;

            const nextElement = board.querySelector(
                `[${posAttribute}="${nextPos}"]`,
            );

            if (nextElement instanceof HTMLElement) {
                nextElement.focus();
            }
        },
        [rows, cols, posAttribute],
    );

    return { handleKeyDown };
}
