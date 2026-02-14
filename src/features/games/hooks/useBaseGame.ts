import { useReducer, useEffect, useMemo, useCallback, useRef } from 'react';

import { useGamePersistence } from './useGamePersistence';
import { useGridSize } from './useGridSize';
import { usePageTitle } from './usePageTitle';
import { useResponsiveBoardSize } from './useResponsiveBoardSize';
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
    /** Grid sizing configuration (see useGridSize) */
    gridConfig: {
        defaultSize: number | null;
        minSize?: number;
        maxSize?: number;
        headerOffset: {
            mobile: number;
            desktop: number;
        };
        paddingOffset: number | { x: number; y: number };
        widthLimit?: number;
        cellSizeReference: number | { mobile: number; desktop: number };
        mobileRowOffset?: number;
    };
    /** Board rendering configuration */
    boardConfig: {
        paddingOffset:
            | number
            | { x: number; y: number }
            | ((mobile: boolean) => number | { x: number; y: number });
        boardMaxWidth: number;
        boardSizeFactor: number;
        maxCellSize: number;
        remBase: number;
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
    const {
        rows,
        cols,
        dynamicSize,
        handlePlus,
        handleMinus,
        mobile,
        minSize,
        maxSize,
    } = useGridSize({
        storageKey: storageKeys.size,
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
        storageKey: storageKeys.state,
        rows,
        cols,
        state,
        onRestore: saved => {
            dispatch({ type: 'restore', state: saved });
            // Also handle 'hydrate' if that's what Slant uses
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

    const resolvedPaddingOffset = useMemo(() => {
        if (typeof boardConfig.paddingOffset === 'function') {
            return boardConfig.paddingOffset(mobile);
        }
        return boardConfig.paddingOffset;
    }, [boardConfig, mobile]);

    const size = useResponsiveBoardSize({
        rows: rows + (boardConfig.rowOffset ?? 0),
        cols: cols + (boardConfig.colOffset ?? 0),
        headerOffset: gridConfig.headerOffset,
        ...boardConfig,
        paddingOffset: resolvedPaddingOffset,
    });

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
