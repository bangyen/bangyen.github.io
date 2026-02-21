import type React from 'react';
import { useState, useCallback } from 'react';

import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { useSkipTransition } from '../../hooks/useSkipTransition';
import { LIGHTS_OUT_STYLES, getLightsOutGameConfig } from '../config';
import { useHandler, usePalette } from '../hooks/boardUtils';
import { useLightsOutProps } from '../hooks/useLightsOutProps';
import type { BoardState, BoardAction } from '../types';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import { isBoardState } from '../utils/persistence';
import { getFrontProps } from '../utils/renderers';

import type { CellIndex } from '@/features/games/types/types';

/**
 * Orchestrates Lights Out game logic: grid state, drag interactions,
 * palette management, and modal state. Mimics the Slant pattern.
 */
export function useLightsOutGame() {
    // useMobile is already called inside useBaseGame via useGridSize,
    // so we derive mobile from the baseGame result instead of subscribing twice
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

    const { handleKeyDown: handleGridNav } = useGridNavigation({ rows, cols });

    const { getDragProps } = useDrag({
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

    const [open, setOpen] = useState(false);
    const toggleOpen = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    const palette = usePalette(state.score);

    const getters = useHandler(state, palette);

    const boardKey = `${String(rows)},${String(cols)},${String(state.score)}`;
    const skipTransition = useSkipTransition(boardKey);

    const handleApply = useCallback(
        (solution: number[]) => {
            const moves = solution
                .map((val, col) => (val ? { row: 0, col: col } : null))
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

    return {
        ...useLightsOutProps({
            game: { rows, cols, size, mobile, scaling },
            info: { open, toggleOpen, handleApply },
            rendering: { palette, getters, skipTransition },
            drag: {
                getDragProps: getEnhancedDragProps,
                frontPropsFactory: getFrontProps,
            },
        }),
        gameState: baseGame,
    };
}
