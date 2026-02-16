import { useCallback, useMemo, useReducer } from 'react';

import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useSkipTransition } from '../../hooks/useSkipTransition';
import { LIGHTS_OUT_STYLES, getLightsOutGameConfig } from '../config';
import { useHandler, usePalette } from '../hooks/boardUtils';
import { useLightsOutProps } from '../hooks/useLightsOutProps';
import type { BoardState, BoardAction } from '../types';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import { isBoardState } from '../utils/persistence';
import { getFrontProps } from '../utils/renderers';

import { createCellIndex, type CellIndex } from '@/features/games/types';
import { useMobile } from '@/hooks';

/**
 * Orchestrates Lights Out game logic: grid state, drag interactions,
 * palette management, and modal state. Mimics the Slant pattern.
 */
export function useLightsOutGame() {
    const mobile = useMobile('sm');
    const {
        rows,
        cols,
        state,
        dispatch,
        size,
        solved,
        handleNext,
        controlsProps,
    } = useBaseGame<BoardState, BoardAction>({
        ...getLightsOutGameConfig(mobile),
        logic: {
            reducer: handleBoard,
            getInitialState,
            isSolved: (s: BoardState) => s.initialized && isSolved(s.grid),
            persistence: {
                deserialize: (saved: unknown) => {
                    if (!isBoardState(saved)) {
                        throw new Error('Corrupt Lights Out state');
                    }
                    return saved;
                },
            },
        },
    });

    const { getDragProps } = useDrag({
        onToggle: (r: number, c: number) => {
            dispatch({
                type: 'adjacent' as const,
                row: createCellIndex(r),
                col: createCellIndex(c),
            });
        },
        checkEnabled: () => !solved,
        touchTimeout: GAME_CONSTANTS.timing.interactionDelay,
        transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
    });

    const [open, toggleOpen] = useReducer((open: boolean) => !open, false);

    const palette = usePalette(state.score);

    const allOn = useMemo(
        () =>
            state.initialized &&
            state.grid.every((row: number) => row === (1 << cols) - 1),
        [state.initialized, state.grid, cols],
    );

    const getters = useHandler(state, palette);

    const boardKey = `${String(rows)},${String(cols)},${String(state.score)}`;
    const skipTransition = useSkipTransition(boardKey);

    const handleApply = useCallback(
        (solution: number[]) => {
            const moves = solution
                .map((val, col) =>
                    val
                        ? { row: createCellIndex(0), col: createCellIndex(col) }
                        : null,
                )
                .filter(
                    (m): m is { row: CellIndex; col: CellIndex } => m !== null,
                );
            if (moves.length > 0) {
                dispatch({ type: 'multi_adjacent', moves });
            }
            toggleOpen();
        },
        [dispatch, toggleOpen],
    );

    return useLightsOutProps({
        rows,
        cols,
        size,
        solved,
        handleNext,
        controlsProps,
        open,
        toggleOpen,
        handleApply,
        palette,
        allOn,
        getters,
        skipTransition,
        getDragProps,
        mobile,
        frontPropsFactory: getFrontProps,
    });
}
