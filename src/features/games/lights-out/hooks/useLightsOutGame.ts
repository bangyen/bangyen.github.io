import { useCallback, useMemo } from 'react';

import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useGameInfo } from '../../hooks/useGameInfo';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { useSkipTransition } from '../../hooks/useSkipTransition';
import {
    LIGHTS_OUT_STYLES,
    getLightsOutGameConfig,
    LAYOUT_CONSTANTS,
} from '../config';
import { useHandler, usePalette } from '../hooks/boardUtils';
import type { BoardState, BoardAction } from '../types';
import { handleBoard, isSolved, getInitialState } from '../utils/boardHandlers';
import { isBoardState } from '../utils/persistence';
import {
    getBackProps,
    getCellVisualProps,
    getFrontProps,
} from '../utils/renderers';

/**
 * Orchestrates Lights Out game logic and prepares props for the UI.
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

    const { getDragProps: getBaseDragProps } = useDrag({
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

    const { handleKeyDown: handleGridNav } = useGridNavigation({
        rows,
        cols,
    });

    const getDragProps = useCallback(
        (pos: string) => {
            const dragProps = getBaseDragProps(pos);
            return {
                ...dragProps,
                onKeyDown: (e: React.KeyboardEvent) => {
                    dragProps.onKeyDown(e);
                    handleGridNav(e);
                },
            };
        },
        [getBaseDragProps, handleGridNav],
    );

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
    const bottomRowArray = useMemo(
        () => Array.from({ length: cols }, (_, c) => (bottomRow >> c) & 1),
        [bottomRow, cols],
    );

    // UI Props derivations (formerly in useLightsOutProps)
    const frontProps = useMemo(
        () => getFrontProps(getDragProps, getters, skipTransition),
        [getDragProps, getters, skipTransition],
    );
    const backProps = useMemo(
        () => getBackProps(getters, skipTransition),
        [getters, skipTransition],
    );

    const boardProps = useMemo(() => {
        const grid2D = Array.from({ length: rows }, (_, r) => {
            const rowVal = state.grid[r] ?? 0;
            return Array.from({ length: cols }, (_, c) => (rowVal >> c) & 1);
        });

        return {
            size,
            space: 0,
            grid: grid2D,
            palette,
            layers: [
                {
                    rows: rows - 1,
                    cols: cols - 1,
                    cellProps: backProps,
                },
                {
                    rows,
                    cols,
                    cellProps: frontProps,
                    decorative: true,
                },
            ],
        };
    }, [size, rows, cols, state.grid, palette, backProps, frontProps]);

    const layoutProps = useMemo(
        () => ({
            boardSx: {
                marginTop: mobile
                    ? `${String(LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                    : `${String(LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
            },
        }),
        [mobile],
    );

    const infoProps = useMemo(
        () => ({
            open,
            solved,
            toggleOpen,
            board: { rows, cols, size },
            rendering: {
                palette,
                getFrontProps: getCellVisualProps,
                getBackProps,
            },
            onApply: handleApply,
            bottomRow: bottomRowArray,
        }),
        [
            open,
            solved,
            toggleOpen,
            rows,
            cols,
            size,
            palette,
            handleApply,
            bottomRowArray,
        ],
    );

    const trophyProps = useMemo(
        () => ({
            scaling,
        }),
        [scaling],
    );

    return {
        boardProps,
        layoutProps,
        infoProps,
        gameState: baseGame,
        trophyProps,
    };
}
