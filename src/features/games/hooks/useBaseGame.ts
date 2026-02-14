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

import { DEFAULT_BOARD_CONFIG, DEFAULT_GRID_CONFIG } from '../config';
import { useGamePersistence } from './useGamePersistence';
import { useGridSize } from './useGridSize';
import { usePageTitle } from './usePageTitle';
import { calculateBoardSize } from './useResponsiveBoardSize';
import { useWinTransition } from './useWinTransition';

import type { BaseGameState, BaseGameAction } from '@/utils/gameUtils';

/**
 * Configuration for initializing a game with full state management.
 */
interface BaseGameConfig<S, A> {
    /** Storage keys for grid size and game state */
    storageKeys: {
        size: string;
        state: string;
    };
    /** Page title for the document */
    pageTitle: string;
    /** Grid sizing configuration (see useGridSize).
     *  Fields with defaults from DEFAULT_GRID_CONFIG are optional. */
    gridConfig: {
        defaultSize: number | null;
        minSize?: number;
        maxSize?: number;
        headerOffset?: {
            mobile: number;
            desktop: number;
        };
        paddingOffset: number | { x: number; y: number };
        widthLimit?: number;
        cellSizeReference: number | { mobile: number; desktop: number };
        mobileRowOffset?: number;
    };
    /** Board rendering configuration.
     *  Fields with defaults from DEFAULT_BOARD_CONFIG are optional. */
    boardConfig: {
        paddingOffset:
            | number
            | { x: number; y: number }
            | ((mobile: boolean) => number | { x: number; y: number });
        boardMaxWidth?: number;
        boardSizeFactor?: number;
        maxCellSize: number;
        remBase?: number;
        rowOffset?: number;
        colOffset?: number;
    };
    /** State reducer function */
    reducer: (state: S, action: A | BaseGameAction<S>) => S;
    /** Function to create initial state for given grid dimensions */
    getInitialState: (rows: number, cols: number) => S;
    /** Optional callback when game is reset */
    onReset?: () => void;
    /** Delay before advancing after win (ms) */
    winAnimationDelay: number;
    /** Function to check if current state is solved */
    isSolved: (state: S) => boolean;
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
    storageKeys,
    pageTitle,
    gridConfig,
    boardConfig,
    reducer,
    getInitialState,
    winAnimationDelay,
    isSolved,
    persistence,
    manualResize = false,
    onNext,
}: BaseGameConfig<S, A>) {
    const mergedGrid = { ...DEFAULT_GRID_CONFIG, ...gridConfig };
    const mergedBoard = useMemo(
        () => ({ ...DEFAULT_BOARD_CONFIG, ...boardConfig }),
        [boardConfig],
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
        storageKey: storageKeys.size,
        ...mergedGrid,
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
        storageKey: storageKeys.state,
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
            headerOffset: mergedGrid.headerOffset,
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
        mergedGrid.headerOffset,
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
