import { useCallback } from 'react';

import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useEnhancedDrag } from '../../hooks/useEnhancedDrag';
import { useGameInfo } from '../../hooks/useGameInfo';
import { useSkipTransition } from '../../hooks/useSkipTransition';
import { LIGHTS_OUT_STYLES, getLightsOutGameConfig } from '../config';
import { useHandler, usePalette } from '../hooks/boardUtils';
import { useLightsOutProps } from '../hooks/useLightsOutProps';
import type { BoardState, BoardAction } from '../types';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import { isBoardState } from '../utils/persistence';
import { getFrontProps } from '../utils/renderers';

/**
 * Orchestrates Lights Out game logic: grid state, drag interactions,
 * palette management, and modal state.
 */
export function useLightsOutGame() {
    const baseGame = useBaseGame<BoardState, BoardAction>({
        ...getLightsOutGameConfig(),
        logic: {
            reducer: handleBoard,
            getInitialState,
            isSolved: (s: BoardState) => s.initialized && isSolved(s.grid),
            persistence: {
                deserialize: (saved: unknown) => {
                    if (!isBoardState(saved)) {
                        throw new Error(
                            `Corrupt Lights Out state in localStorage: expected a valid BoardState object but received ${JSON.stringify(saved).slice(0, 100)}`,
                        );
                    }
                    return saved;
                },
            },
        },
    });

    const { state, dispatch, solved, layout } = baseGame;
    const { rows, cols, size, mobile, scaling } = layout;

    const { getDragProps } = useEnhancedDrag({
        rows,
        cols,
        onToggle: (r: number, c: number) => {
            dispatch({
                type: 'adjacent' as const,
                row: r,
                col: c,
            });
        },
        checkEnabled: () => !solved,
        touchTimeout: GAME_CONSTANTS.timing.interactionDelay,
        transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
    });

    const { open, toggleOpen } = useGameInfo();

    const palette = usePalette(state.score);
    const getters = useHandler(state, palette);

    const boardKey = `${String(rows)},${String(cols)},${String(state.score)}`;
    const skipTransition = useSkipTransition(boardKey);

    const handleApply = useCallback(
        (solution: number[]) => {
            const moves = solution
                .map((val, col) => (val ? { row: 0, col: col } : null))
                .filter((m): m is { row: number; col: number } => m !== null);
            if (moves.length > 0) {
                dispatch({ type: 'multi_adjacent', moves });
            }
            toggleOpen();
        },
        [dispatch, toggleOpen],
    );

    const bottomRow = state.grid[rows - 1] ?? 0;
    const bottomRowArray = Array.from(
        { length: cols },
        (_, c) => (bottomRow >> c) & 1,
    );

    return {
        ...useLightsOutProps({
            gameState: baseGame,
            game: { rows, cols, size, mobile, scaling },
            info: {
                open,
                toggleOpen,
                handleApply,
                bottomRow: bottomRowArray,
            },
            rendering: { palette, getters, skipTransition },
            drag: {
                getDragProps,
                frontPropsFactory: getFrontProps,
            },
        }),
        gameState: baseGame,
    };
}
