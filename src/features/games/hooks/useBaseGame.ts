/**
 * Hook dependency graph:
 *
 *   useWindow / useMobile  (src/hooks/layout.ts)
 *        |
 *   useGridSize  -->  rows, cols, mobile, width, height
 *        |
 *   useBaseGame  (this hook)
 *     ├── useGridSize           - grid dimensions + responsive sizing
 *     ├── calculateBoardSize    - cell size in rem (pure function)
 *     ├── useGamePersistence    - localStorage save/restore
 *     └── useWinTransition      - auto-advance after solve
 */

import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react';

import { calculateBoardSize } from './boardSizeUtils';
import { useGamePersistence } from './useGamePersistence';
import { useGridSize } from './useGridSize';
import { useWinTransition } from './useWinTransition';
import {
    DEFAULT_BOARD_CONFIG,
    DEFAULT_GRID_CONFIG,
    GAME_CONSTANTS,
    createStorageKeys,
} from '../config/constants';

import type { BaseGameState, BaseGameAction } from '@/utils/gameUtils';

// ---------------------------------------------------------------------------
// Config sub-interfaces
// ---------------------------------------------------------------------------

/** Grid sizing — controls how many rows/cols the game has and how they
 *  respond to viewport changes. */
export interface GridConfig {
    /** Default grid size if no saved preference (null = auto-calculated). */
    defaultSize?: number | null;
    /** Minimum allowed grid size (default: 3). */
    minSize?: number;
    /** Maximum allowed grid size (default: 10). */
    maxSize?: number;
    /** Header height offsets for available-space calculation.
     *  Defaults to GAME_CONSTANTS.layout.headerHeight. */
    headerOffset?: { mobile: number; desktop: number };
    /** Extra padding subtracted from the available viewport for grid sizing. */
    gridPadding?: number | { x: number; y: number };
    /** Maximum viewport width to consider (default: 1300px). */
    widthLimit?: number;
    /** Reference cell size in rem for calculating grid dimensions. */
    cellSizeReference?: number | { mobile: number; desktop: number };
    /** Extra rows to add on mobile devices (default: 2). */
    mobileRowOffset?: number;
}

/** Board rendering — controls cell sizes and the board's pixel footprint. */
export interface BoardConfig {
    /** Padding subtracted from available space when computing cell size. */
    boardPadding?:
        | number
        | { x: number; y: number }
        | ((mobile: boolean) => number | { x: number; y: number });
    /** Maximum board width in pixels (default: 1200). */
    boardMaxWidth?: number;
    /** Factor to reduce available space (0-1, default: 0.94). */
    boardSizeFactor?: number;
    /** Maximum cell size in pixels. */
    maxCellSize?: number;
    /** Rem base value (default: 16). */
    remBase?: number;
    /** Extra row offset for board size calculation (e.g. +1 for Slant numbers). */
    rowOffset?: number;
    /** Extra col offset for board size calculation. */
    colOffset?: number;
}

/** Game logic — the reducer, win condition, persistence, and callbacks
 *  that make each game unique. */
export interface GameLogicConfig<S, A> {
    /** State reducer function. */
    reducer: (state: S, action: A | BaseGameAction<S>) => S;
    /** Function to create initial state for given grid dimensions. */
    getInitialState: (rows: number, cols: number) => S;
    /** Function to check if current state is solved. */
    isSolved: (state: S) => boolean;
    /** Delay before advancing after win (ms, default: 2000). */
    winAnimationDelay?: number;
    /** Custom serialization/deserialization for persistence. */
    persistence?: {
        serialize?: (state: S) => unknown;
        deserialize?: (saved: unknown) => S;
        enabled?: boolean;
    };
    /** When true, skip the automatic resize dispatch so the consumer
     *  can handle generation asynchronously. */
    manualResize?: boolean;
    /** Optional override for the "next puzzle" callback used by win
     *  transition and refresh. */
    onNext?: () => void;
}

// ---------------------------------------------------------------------------
// Top-level config
// ---------------------------------------------------------------------------

/**
 * Structured configuration for initializing a game with full state
 * management.  Groups concerns into `grid`, `board`, and `logic`
 * sub-objects so callers can see at a glance which fields belong
 * to which concern.
 */
export interface BaseGameConfig<S, A> {
    /** Storage key prefix — auto-generates `{prefix}-size` and
     *  `{prefix}-state` keys. */
    storageKey: string;
    /** Grid sizing configuration (all fields optional with defaults). */
    grid?: GridConfig;
    /** Board rendering configuration (all fields optional with defaults). */
    board?: BoardConfig;
    /** Game logic — reducer, win check, persistence, etc. */
    logic: GameLogicConfig<S, A>;
}

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

    // Destructure grid config with defaults.
    const {
        defaultSize = null,
        minSize: minSizeOpt,
        maxSize: maxSizeOpt,
        headerOffset: headerOffsetOpt,
        gridPadding,
        widthLimit,
        cellSizeReference,
        mobileRowOffset,
    } = grid;

    // Destructure board config with defaults.
    const {
        boardPadding,
        boardMaxWidth,
        boardSizeFactor,
        maxCellSize,
        remBase,
        rowOffset,
        colOffset,
    } = board;

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
    const gridMerged = {
        ...DEFAULT_GRID_CONFIG,
        defaultSize,
        minSize: minSizeOpt ?? DEFAULT_GRID_CONFIG.minSize,
        maxSize: maxSizeOpt ?? DEFAULT_GRID_CONFIG.maxSize,
        headerOffset: headerOffsetOpt ?? DEFAULT_GRID_CONFIG.headerOffset,
        paddingOffset: gridPadding ?? DEFAULT_GRID_CONFIG.paddingOffset,
        widthLimit: widthLimit ?? DEFAULT_GRID_CONFIG.widthLimit,
        cellSizeReference:
            cellSizeReference ?? DEFAULT_GRID_CONFIG.cellSizeReference,
        mobileRowOffset: mobileRowOffset ?? DEFAULT_GRID_CONFIG.mobileRowOffset,
    };

    // Build the board config by merging caller overrides with defaults.
    const mergedBoard = useMemo(
        () => ({
            ...DEFAULT_BOARD_CONFIG,
            paddingOffset: boardPadding ?? DEFAULT_BOARD_CONFIG.paddingOffset,
            boardMaxWidth: boardMaxWidth ?? DEFAULT_BOARD_CONFIG.boardMaxWidth,
            boardSizeFactor:
                boardSizeFactor ?? DEFAULT_BOARD_CONFIG.boardSizeFactor,
            maxCellSize: maxCellSize ?? DEFAULT_BOARD_CONFIG.maxCellSize,
            remBase: remBase ?? DEFAULT_BOARD_CONFIG.remBase,
            rowOffset,
            colOffset,
        }),
        [
            boardPadding,
            boardMaxWidth,
            boardSizeFactor,
            maxCellSize,
            remBase,
            rowOffset,
            colOffset,
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

    const size = useMemo(() => {
        const resolvedPaddingOffset =
            typeof mergedBoard.paddingOffset === 'function'
                ? mergedBoard.paddingOffset(mobile)
                : mergedBoard.paddingOffset;

        return calculateBoardSize({
            rows: rows + (mergedBoard.rowOffset ?? 0),
            cols: cols + (mergedBoard.colOffset ?? 0),
            width,
            height,
            mobile,
            headerOffset: gridMerged.headerOffset,
            ...mergedBoard,
            paddingOffset: resolvedPaddingOffset,
        });
    }, [
        rows,
        cols,
        width,
        height,
        mobile,
        mergedBoard,
        gridMerged.headerOffset,
    ]);

    return {
        rows,
        cols,
        state,
        dispatch,
        size,
        mobile,
        solved,
        handleNext,
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
    };
}
