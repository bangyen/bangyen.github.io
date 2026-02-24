/**
 * Custom hook that orchestrates all game state management.
 *
 * This hook is a high-level orchestrator that recomposes lower-level
 * hooks for layout and state management.
 */
import { useEffect, useReducer, useMemo, useCallback, useRef } from 'react';

import type { BaseGameConfig } from './types';
import { useBoardLayout } from './useBoardLayout';
import { useGamePersistence } from './useGamePersistence';
import { useWinTransition } from './useWinTransition';
import { createStorageKeys, GAME_CONSTANTS } from '../config/constants';

import type { BaseGameState } from '@/utils/gameUtils';

/**
 * Custom hook that orchestrates all game state management.
 *
 * Combines:
 * - Grid sizing and responsiveness (via useBoardLayout)
 * - Game state management (reducer)
 * - Persistence and transitions (via useGamePersistence, useWinTransition)
 *
 * @template S - Game state type
 * @template A - Game action type
 * @param config - Complete game configuration
 * @returns Game state, dispatch, and UI control properties
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

    const {
        reducer,
        getInitialState,
        isSolved,
        winAnimationDelay = GAME_CONSTANTS.timing.winAnimationDelay,
        persistence,
        onNext,
        manualResize = false,
    } = logic;

    // 1. Manage layout and sizing
    const layout = useBoardLayout({
        storageKey: keys.SIZE,
        grid: grid as Record<string, unknown>,
        board: board as Record<string, unknown>,
    });

    const { rows, cols } = layout;

    // 2. Manage game state
    // We use a ref for initial state to ensure it's stable even if getInitialState is unstable
    const initialRef = useRef<S | null>(null);
    if (initialRef.current === null) {
        initialRef.current = getInitialState(rows, cols);
    }
    const [state, dispatch] = useReducer(reducer, initialRef.current);

    const solved = useMemo(() => isSolved(state), [state, isSolved]);

    const defaultHandleNext = useCallback(() => {
        dispatch({ type: 'new' } as unknown as A);
    }, [dispatch]);

    const handleNext = onNext ?? defaultHandleNext;

    // 3. Coordinate persistence and transitions
    useGamePersistence<S>({
        storageKey: keys.STATE,
        rows,
        cols,
        state,
        onRestore: saved => {
            dispatch({ type: 'hydrate', state: saved } as unknown as A);
        },
        ...persistence,
    });

    useWinTransition(solved, handleNext, winAnimationDelay);

    // 4. Coordinate resize events
    useEffect(() => {
        if (manualResize) return;
        dispatch({
            type: 'resize',
            rows,
            cols,
            newRows: rows,
            newCols: cols,
        } as unknown as A);
    }, [rows, cols, dispatch, manualResize]);

    return {
        // State management
        state,
        dispatch,
        solved,
        handleNext,

        // Layout and sizing
        layout: {
            rows: layout.rows,
            cols: layout.cols,
            size: layout.size,
            mobile: layout.mobile,
            scaling: layout.scaling,
        },

        // Child component props
        controlsProps: {
            rows: layout.rows,
            cols: layout.cols,
            dynamicSize: layout.dynamicSize,
            minSize: layout.minSize,
            maxSize: layout.maxSize,
            handlePlus: layout.handlePlus,
            handleMinus: layout.handleMinus,
            onRefresh: handleNext,
        },
    };
}
