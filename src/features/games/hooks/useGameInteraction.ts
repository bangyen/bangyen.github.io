import { useRef, useCallback } from 'react';
import { useDrag } from './useDrag';

interface UseGameInteractionOptions<T> {
    onToggle: (
        row: number,
        col: number,
        isRightClick: boolean,
        draggingValue?: T,
        isInitialClick?: boolean
    ) => T | undefined;
    checkEnabled: () => boolean;
    touchTimeout: number;
    transition?: string;
    posAttribute?: 'data-pos' | 'data-col';
}

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
