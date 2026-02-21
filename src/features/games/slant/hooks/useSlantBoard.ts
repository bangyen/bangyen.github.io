import { useMemo } from 'react';

import { NUMBER_SIZE_RATIO } from '../config/constants';
import type { SlantState } from '../types';
import { getBackProps, getFrontProps } from '../utils/renderers.logic';

import type { DragProps } from '@/features/games/hooks/useDrag';

export interface UseSlantBoardProps {
    /** Current Slant game state */
    state: SlantState;
    /** Cell size in rem units */
    size: number;
    /** Drag props factory function */
    getDragProps: (pos: string) => DragProps;
}

export function useSlantBoard({
    state,
    size,
    getDragProps,
}: UseSlantBoardProps) {
    const numberSize = size * NUMBER_SIZE_RATIO;

    const backProps = useMemo(
        () => getBackProps(getDragProps, state, size),
        [getDragProps, state, size],
    );

    const frontProps = useMemo(
        () => getFrontProps(state, numberSize),
        [state, numberSize],
    );

    return {
        cellProps: backProps,
        overlayProps: frontProps,
    };
}
