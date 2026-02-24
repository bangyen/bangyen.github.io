import { useMemo } from 'react';

import type { SlantState } from '../types';

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
    state: _state,
    size: _size,
    getDragProps,
}: UseSlantBoardProps) {
    const backProps = useMemo(
        () => (r: number, c: number) => {
            const pos = `${r.toString()},${c.toString()}`;
            return getDragProps(pos);
        },
        [getDragProps],
    );

    const frontProps = useMemo(
        () => (_r: number, _c: number) => ({
            role: 'presentation',
            'aria-hidden': true,
        }),
        [],
    );

    return {
        cellProps: backProps,
        overlayProps: frontProps,
    };
}
