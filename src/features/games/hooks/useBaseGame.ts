/**
 * Hook dependency graph:
 *
 *   useWindow / useMobile  (src/hooks/layout.ts)
 *        |
 *   useGridSize  -->  rows, cols, mobile, width, height
 *        |
 *   useBaseGame  (this hook)
 *     ├── useGridSize           - grid dimensions + responsive sizing
 *     ├── useBoardSize          - cell size in rem
 *     ├── useGamePersistence    - localStorage save/restore
 *     └── useWinTransition      - auto-advance after solve
 */

import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react';

import type { BaseGameConfig, MergedBoardConfig } from './types';
import { useBoardSize } from './useBoardSize';
import { useGamePersistence } from './useGamePersistence';
import { useGameViewport } from './useGameViewport';
import { useGridSize } from './useGridSize';
import { useWinTransition } from './useWinTransition';
import {
    DEFAULT_BOARD_CONFIG,
    DEFAULT_GRID_CONFIG,
    GAME_CONSTANTS,
    createStorageKeys,
} from '../config/constants';

import type { BaseGameState } from '@/utils/gameUtils';
import { mergeDefaults } from '@/utils/objectUtils';

/**
 * Custom hook that orchestrates all game state management.
 *
 * Combines:
 * - Grid sizing and responsiveness
 * - Game state with custom reducer
 * - State persistence to localStorage
 * - Win detection and animation timing
 * - Board size calculations
 *
 * @template S - Game state type
 * @template A - Game action type
 * @param config - Complete game configuration
 * @returns Game state, dispatch, and UI control properties
 *
 * @example
 * ```tsx
 * const { rows, cols, state, dispatch, solved } = useBaseGame({
 *   storageKey: 'lights-out',
 *   grid: { maxSize: 10, headerOffset: { mobile: 64, desktop: 80 } },
 *   board: { boardPadding: { x: 40, y: 120 }, maxCellSize: 80 },
 *   logic: {
 *     reducer: lightsOutReducer,
 *     getInitialState: (rows, cols) => initializeLightsOut(rows, cols),
 *     isSolved: (state) => state.board.every(cell => !cell),
 *   },
 * });
 * ```
 */
export function useBaseGame<
    S extends BaseGameState,
    A extends { type: string },
>({
    storageKey: storageKeyPrefix,
    grid = {},
    board = {},
    logic,
}: BaseGameConfig<S, A>) {
    const keys = createStorageKeys(storageKeyPrefix);

    // Destructure logic config.
    const {
        reducer,
        getInitialState,
        isSolved,
        winAnimationDelay = GAME_CONSTANTS.timing.winAnimationDelay,
        persistence,
        manualResize = false,
        onNext,
    } = logic;

    // Build the grid config by merging caller overrides with defaults.
    const gridMerged = mergeDefaults(DEFAULT_GRID_CONFIG, {
        defaultSize: grid.defaultSize,
        minSize: grid.minSize,
        maxSize: grid.maxSize,
        headerOffset: grid.headerOffset,
        gridPadding: grid.gridPadding,
        widthLimit: grid.widthLimit,
        cellSizeReference: grid.cellSizeReference,
        mobileRowOffset: grid.mobileRowOffset,
    });

    // Build the board config by merging caller overrides with defaults.
    // `rowOffset` / `colOffset` are not in the defaults, so they're appended.
    const mergedBoard = useMemo(
        () => ({
            ...mergeDefaults<
                Omit<MergedBoardConfig, 'rowOffset' | 'colOffset'>
            >(DEFAULT_BOARD_CONFIG, {
                boardPadding: board.boardPadding,
                boardMaxWidth: board.boardMaxWidth,
                boardSizeFactor: board.boardSizeFactor,
                maxCellSize: board.maxCellSize,
                remBase: board.remBase,
            }),
            rowOffset: board.rowOffset,
            colOffset: board.colOffset,
        }),
        [
            board.boardPadding,
            board.boardMaxWidth,
            board.boardSizeFactor,
            board.maxCellSize,
            board.remBase,
            board.rowOffset,
            board.colOffset,
        ],
    );

    const {
        rows,
        cols,
        dynamicSize,
        handlePlus,
        handleMinus,
        mobile,
        width,
        height,
        minSize,
        maxSize,
    } = useGridSize({
        storageKey: keys.SIZE,
        ...gridMerged,
    });

    // Compute the initial state only once (first render). Subsequent size
    // changes are handled by the resize dispatch or by the consumer when
    // manualResize is true.
    const initialRef = useRef<S | null>(null);
    if (initialRef.current === null) {
        initialRef.current = getInitialState(rows, cols);
    }
    const [state, dispatch] = useReducer(reducer, initialRef.current);

    const solved = useMemo(() => isSolved(state), [state, isSolved]);

    const defaultHandleNext = useCallback(() => {
        dispatch({ type: 'new' });
    }, [dispatch]);

    const handleNext = onNext ?? defaultHandleNext;

    useGamePersistence<S>({
        storageKey: keys.STATE,
        rows,
        cols,
        state,
        onRestore: saved => {
            dispatch({ type: 'hydrate', state: saved });
        },
        ...persistence,
    });

    useWinTransition(solved, handleNext, winAnimationDelay);

    useEffect(() => {
        if (manualResize) return;
        dispatch({
            type: 'resize',
            rows,
            cols,
            newRows: rows,
            newCols: cols,
        });
    }, [rows, cols, dispatch, manualResize]);

    const size = useBoardSize({
        rows,
        cols,
        width,
        height,
        mobile,
        headerOffset: gridMerged.headerOffset,
        boardConfig: mergedBoard,
    });

    const { scaling } = useGameViewport();

    return {
        // State management
        state,
        dispatch,
        solved,
        handleNext,

        // Layout and sizing
        layout: {
            rows,
            cols,
            size,
            mobile,
            scaling,
        },

        // Child component props
        controlsProps: {
            rows,
            cols,
            dynamicSize,
            minSize,
            maxSize,
            handlePlus,
            handleMinus,
            onRefresh: handleNext,
        },

        // Legacy/Direct access (optional, but good for reducing refactor churn if needed)
        // For now, let's go with the clean grouped structure and update consumers.
    };
}
