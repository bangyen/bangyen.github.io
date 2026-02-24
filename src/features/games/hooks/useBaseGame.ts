/**
 * Custom hook that orchestrates all game state management.
 */
import type { Dispatch } from 'react';
import { useEffect, useReducer, useMemo, useCallback, useRef } from 'react';

import type { BaseGameConfig, BaseControlsProps } from './types';
import { useBoardLayout } from './useBoardLayout';
import { useGamePersistence } from './useGamePersistence';
import { useStableCallback } from '../../../hooks/useStableCallback';
import { createStorageKeys, GAME_CONSTANTS } from '../config/constants';

import type { BaseGameState, BaseGameAction } from '@/utils/gameUtils';

/**
 * Custom hook that orchestrates all game state management.
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
        gridConfig: grid,
        boardConfig: board as Record<string, unknown>,
        manualResize,
    });

    const { rows, cols } = layout;

    // 2. Manage game state
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

    const stableHandleNext = useStableCallback(handleNext);
    useEffect(() => {
        if (solved) {
            const timeout = setTimeout(() => {
                stableHandleNext();
            }, winAnimationDelay);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [solved, winAnimationDelay, stableHandleNext]);

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

    const result: {
        state: S;
        dispatch: Dispatch<A | BaseGameAction<S>>;
        solved: boolean;
        handleNext: () => void;
        layout: {
            rows: number;
            cols: number;
            size: number;
            mobile: boolean;
            scaling: {
                iconSize: string;
                containerSize: string;
                padding: number;
            };
        };
        controlsProps: BaseControlsProps;
    } = {
        state,
        dispatch,
        solved,
        handleNext,
        layout: {
            rows: layout.rows,
            cols: layout.cols,
            size: layout.size,
            mobile: layout.mobile,
            scaling: layout.scaling,
        },
        controlsProps: {
            rows: layout.rows,
            cols: layout.cols,
            dynamicSize: layout.gridConfig.dynamicSize,
            minSize: layout.gridConfig.minSize,
            maxSize: layout.gridConfig.maxSize,
            handlePlus: layout.gridConfig.handlePlus,
            handleMinus: layout.gridConfig.handleMinus,
            onRefresh: handleNext,
        },
    };

    return result;
}
