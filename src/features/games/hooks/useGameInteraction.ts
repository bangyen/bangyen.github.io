import { useRef, useCallback } from 'react';

import { useDrag } from './useDrag';

/**
 * Configuration for game cell interactions.
 */
interface UseGameInteractionOptions<T> {
    /** Callback when a cell is toggled (row, col, rightClick, draggingValue, isInitialClick) */
    onToggle: (
        row: number,
        col: number,
        isRightClick: boolean,
        draggingValue?: T,
        isInitialClick?: boolean
    ) => T | undefined;
    /** Check if interactions are enabled */
    checkEnabled: () => boolean;
    /** Touch timeout in milliseconds */
    touchTimeout: number;
    /** CSS transition property for visual feedback */
    transition?: string;
    /** Data attribute for position tracking */
    posAttribute?: 'data-pos' | 'data-col';
}

/**
 * Custom hook for managing grid cell interactions.
 *
 * Wraps useDrag to provide:
 * - Row/column coordinate parsing
 * - Value persistence during drag operations
 * - Differentiation between initial clicks and drag operations
 *
 * @template T - Type of value being dragged
 * @param options - Interaction configuration
 * @returns Object with getDragProps function for cells
 *
 * @example
 * ```tsx
 * const { getDragProps } = useGameInteraction({
 *   onToggle: (row, col, isRight, draggingValue, isInitial) => {
 *     console.log(`Toggled cell ${row},${col}`);
 *     return draggingValue;
 *   },
 *   checkEnabled: () => !gameOver,
 *   touchTimeout: 500
 * });
 *
 * return (
 *   <div {...getDragProps('0,0')}>
 *     Cell Content
 *   </div>
 * );
 * ```
 */
export function useGameInteraction<T>({
    onToggle,
    checkEnabled,
    touchTimeout,
    transition,
    posAttribute,
}: UseGameInteractionOptions<T>) {
    const draggingValue = useRef<T | undefined>(undefined);

    const onToggleRef = useRef(onToggle);
    onToggleRef.current = onToggle;

    const onAction = useCallback(
        (pos: string, isRightClick: boolean, isInitialClick: boolean) => {
            if (!checkEnabled()) return;

            const [r, c] = pos.split(',').map(Number);
            if (r === undefined || c === undefined) return;

            if (isInitialClick) {
                draggingValue.current = onToggleRef.current(
                    r,
                    c,
                    isRightClick,
                    undefined,
                    true
                );
            } else {
                onToggleRef.current(
                    r,
                    c,
                    isRightClick,
                    draggingValue.current,
                    false
                );
            }
        },
        [checkEnabled]
    );

    const { getDragProps } = useDrag({
        onAction,
        checkEnabled,
        touchTimeout,
        transition,
        posAttribute,
    });

    return { getDragProps };
}
