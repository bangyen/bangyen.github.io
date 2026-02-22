import { useCallback } from 'react';

import { useDrag, type UseDragOptions } from './useDrag';
import { useGridNavigation } from './useGridNavigation';

export type UseEnhancedDragOptions<T> = UseDragOptions<T> & {
    rows: number;
    cols: number;
};

/**
 * Enhanced drag hook that combines `useDrag` (mouse/touch/action keys)
 * with `useGridNavigation` (Arrows/WASD focus movement).
 *
 * This eliminates the boilerplate of manually merging these two
 * interaction patterns in every game orchestration hook.
 */
export function useEnhancedDrag<T = void>(options: UseEnhancedDragOptions<T>) {
    const { rows, cols, ...dragOptions } = options;

    const { getDragProps, ...dragRest } = useDrag(dragOptions);

    const posAttr = (dragOptions as { posAttribute?: string }).posAttribute;

    const { handleKeyDown: handleGridNav } = useGridNavigation({
        rows,
        cols,
        posAttribute: posAttr,
    });

    const getEnhancedDragProps = useCallback(
        (pos: string) => {
            const dragProps = getDragProps(pos);
            return {
                ...dragProps,
                onKeyDown: (e: React.KeyboardEvent) => {
                    dragProps.onKeyDown(e);
                    handleGridNav(e);
                },
            };
        },
        [getDragProps, handleGridNav],
    );

    return {
        ...dragRest,
        getDragProps: getEnhancedDragProps,
    };
}
