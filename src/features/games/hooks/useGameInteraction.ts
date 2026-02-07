import { useRef } from 'react';
import { useDrag } from './useDrag';
import { TIMING_CONSTANTS } from '../slant/constants';

interface UseGameInteractionOptions<T> {
    onToggle: (
        row: number,
        col: number,
        isRightClick: boolean,
        draggingValue?: T
    ) => T | undefined;
    checkEnabled: () => boolean;
    touchTimeout?: number;
}

export function useGameInteraction<T>({
    onToggle,
    checkEnabled,
    touchTimeout = TIMING_CONSTANTS.TOUCH_HOLD_DELAY,
}: UseGameInteractionOptions<T>) {
    const draggingValue = useRef<T | undefined>(undefined);

    const { getDragProps } = useDrag({
        onAction: (pos, isRightClick, isInitialClick) => {
            if (!checkEnabled()) return;

            const [r, c] = pos.split(',').map(Number);
            if (r === undefined || c === undefined) return;

            if (isInitialClick) {
                const result = onToggle(r, c, isRightClick);
                if (result !== undefined) {
                    draggingValue.current = result;
                }
            } else {
                onToggle(r, c, isRightClick, draggingValue.current);
            }
        },
        checkEnabled,
        touchTimeout,
    });

    return { getDragProps };
}
