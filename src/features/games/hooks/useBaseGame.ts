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
 *     ├── useWinTransition      - auto-advance after solve
 *     └── usePageTitle          - document.title
 */

import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react';

import {
    DEFAULT_BOARD_CONFIG,
    DEFAULT_GRID_CONFIG,
    GAME_CONSTANTS,
    createStorageKeys,
} from '../config';
import { useGamePersistence } from './useGamePersistence';
import { useGridSize } from './useGridSize';
import { usePageTitle } from './usePageTitle';
import { calculateBoardSize } from './useResponsiveBoardSize';
import { useWinTransition } from './useWinTransition';

import type { BaseGameState, BaseGameAction } from '@/utils/gameUtils';

/**
 * Flat configuration for initializing a game with full state management.
 *
 * Combines grid sizing, board rendering, and game logic into a single level
 * with sensible defaults so each game only specifies what differs.
 */
interface BaseGameConfig<S, A> {
    /** Storage key prefix — auto-generates `{prefix}-size` and `{prefix}-state` keys. */
    storageKey: string;
    /** Page title for the document */
    pageTitle: string;

    // --- Grid sizing (previously nested in gridConfig) ---
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

    // --- Board rendering (previously nested in boardConfig) ---
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

    // --- Game logic ---
    /** State reducer function */
    reducer: (state: S, action: A | BaseGameAction<S>) => S;
    /** Function to create initial state for given grid dimensions */
    getInitialState: (rows: number, cols: number) => S;
    /** Function to check if current state is solved */
    isSolved: (state: S) => boolean;
    /** Delay before advancing after win (ms, default: 2000). */
    winAnimationDelay?: number;
    /** Custom serialization/deserialization for persistence */
    persistence?: {
        serialize?: (state: S) => unknown;
        deserialize?: (saved: unknown) => S;
        enabled?: boolean;
    };
    /** When true, skip the automatic resize dispatch so the consumer can handle generation asynchronously. */
    manualResize?: boolean;
    /** Optional override for the "next puzzle" callback used by win transition and refresh. */
    onNext?: () => void;
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
 *   storageKeys: { size: 'lights-out-size', state: 'lights-out-state' },
 *   pageTitle: 'Lights Out',
 *   gridConfig: { ... },
 *   boardConfig: { ... },
 *   reducer: lightsOutReducer,
 *   getInitialState: (rows, cols) => initializeLightsOut(rows, cols),
 *   isSolved: (state) => state.board.every(cell => !cell),
 *   winAnimationDelay: 2000
 * });
 *
 * if (solved) {
 *   return <WinScreen onNext={() => dispatch({ type: 'new' })} />;
 * }
 * ```
 */
export function useBaseGame<
    S extends BaseGameState,
    A extends { type: string },
>({
    storageKey: storageKeyPrefix,
    pageTitle,
    // Grid sizing fields (with defaults)
    defaultSize = null,
    minSize: minSizeOpt,
    maxSize: maxSizeOpt,
    headerOffset: headerOffsetOpt,
    gridPadding,
    widthLimit,
    cellSizeReference,
    mobileRowOffset,
    // Board rendering fields (with defaults)
    boardPadding,
    boardMaxWidth,
    boardSizeFactor,
    maxCellSize,
    remBase,
    rowOffset,
    colOffset,
    // Game logic
    reducer,
    getInitialState,
    isSolved,
    winAnimationDelay = GAME_CONSTANTS.timing.winAnimationDelay,
    persistence,
    manualResize = false,
    onNext,
}: BaseGameConfig<S, A>) {
    const keys = createStorageKeys(storageKeyPrefix);

    // Build the grid config by merging caller overrides with defaults.
    const gridConfig = {
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
        ...gridConfig,
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
    usePageTitle(pageTitle);

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
            headerOffset: gridConfig.headerOffset,
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
        gridConfig.headerOffset,
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
