import { useCallback, useMemo } from 'react';

import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { useSkipTransition } from '../../hooks/useSkipTransition';
import {
    LIGHTS_OUT_STYLES,
    getLightsOutGameConfig,
    LIGHTS_OUT_LAYOUT_CONSTANTS,
} from '../config/index';
import type { BoardState, BoardAction } from '../types';
import {
    boardReducer,
    isSolved,
    getInitialState,
    to2DGrid,
    getCellValue,
} from '../utils/boardHandlers';
import { isBoardState } from '../utils/persistence';
import {
    getBackProps,
    getCellVisualProps,
    getFrontProps,
} from '../utils/renderers';

import { COLORS } from '@/config/theme';
import { useGameInfoState } from '@/features/games/hooks/useGameInfoState';

/**
 * Orchestrates Lights Out game logic and prepares props for the UI.
 */
export function useLightsOutGame() {
    const baseGame = useBaseGame<BoardState, BoardAction>({
        ...getLightsOutGameConfig(),
        logic: {
            reducer: boardReducer,
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
    const { rows, cols, size, mobile, scaling: rawScaling } = layout;
    const scaling = rawScaling as {
        iconSize: string;
        containerSize: string;
        padding: number;
    };

    const { getDragProps: getBaseDragProps } = useDrag({
        onToggle: (r: number, c: number) => {
            dispatch({
                type: 'adjacent',
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

    // 1. Theme/Palette
    const palette = useMemo(() => {
        const primary = COLORS.primary.main;
        const secondary = COLORS.primary.dark;
        return { primary, secondary };
    }, []);

    // 2. Logic Handlers
    const { infoOpen, toggleInfo } = useGameInfoState();

    const handleApply = useCallback(
        (solution: number[]) => {
            const moves = solution
                .map((val, col) => (val ? { row: 0, col: col } : null))
                .filter((m): m is { row: number; col: number } => m !== null);
            if (moves.length > 0) {
                dispatch({ type: 'multi_adjacent', moves });
            }
            toggleInfo();
        },
        [dispatch, toggleInfo],
    );

    const getters = useMemo(() => {
        const getColor = (r: number, c: number) => {
            const isLit = getCellValue(state.grid, r, c);
            const front = isLit ? palette.primary : palette.secondary;
            const back = isLit ? palette.secondary : palette.primary;
            return { front, back, isLit: isLit > 0 };
        };

        const getBorder = (r: number, c: number) => {
            const self = getCellValue(state.grid, r, c);
            const up = getCellValue(state.grid, r - 1, c);
            const down = getCellValue(state.grid, r + 1, c);
            const left = getCellValue(state.grid, r, c - 1);
            const right = getCellValue(state.grid, r, c + 1);
            const props: React.CSSProperties = {};

            if (self === up || self === left) props.borderTopLeftRadius = 0;
            if (self === up || self === right) props.borderTopRightRadius = 0;
            if (self === down || self === left)
                props.borderBottomLeftRadius = 0;
            if (self === down || self === right)
                props.borderBottomRightRadius = 0;
            return props;
        };

        const getFiller = (r: number, c: number) => {
            const tl = getCellValue(state.grid, r, c);
            const tr = getCellValue(state.grid, r, c + 1);
            const bl = getCellValue(state.grid, r + 1, c);
            const br = getCellValue(state.grid, r + 1, c + 1);
            const total = tl + tr + bl + br;
            const colored = !((!tl || !br) && total < 3);
            return colored ? palette.primary : palette.secondary;
        };

        return { getColor, getBorder, getFiller };
    }, [state.grid, palette]);

    const boardKey = `${String(rows)},${String(cols)},${String(state.score)}`;
    const skipTransition = useSkipTransition(boardKey);

    // 3. UI Props derivation
    const frontProps = useMemo(
        () => getFrontProps(getDragProps, getters, skipTransition),
        [getDragProps, getters, skipTransition],
    );
    const backProps = useMemo(
        () => getBackProps(getters, skipTransition),
        [getters, skipTransition],
    );

    const bottomRow = state.grid[rows - 1] ?? 0;
    const bottomRowArray = useMemo(
        () => Array.from({ length: cols }, (_, c) => (bottomRow >> c) & 1),
        [bottomRow, cols],
    );

    const boardSx = useMemo(
        () => ({
            marginTop: mobile
                ? `${String(LIGHTS_OUT_LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                : `${String(LIGHTS_OUT_LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
        }),
        [mobile],
    );

    return {
        // State & Layout
        state,
        dispatch,
        solved,
        rows,
        cols,
        size,
        mobile,
        scaling,
        boardSx,
        handleNext: baseGame.handleNext,

        // Board Components Props
        grid: useMemo(
            () => to2DGrid(state.grid, rows, cols),
            [state.grid, rows, cols],
        ),
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

        // Sub-component Props
        controlsProps: baseGame.controlsProps,
        infoProps: {
            open: infoOpen,
            solved,
            toggleOpen: toggleInfo,
            board: { rows, cols, size },
            rendering: {
                palette,
                getFrontProps: getCellVisualProps,
                getBackProps,
            },
            onApply: handleApply,
            bottomRow: bottomRowArray,
        },
        trophyProps: { scaling },
    };
}
