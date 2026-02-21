import { useReducer, useMemo, useCallback, useRef } from 'react';

import { useGamePersistence } from './useGamePersistence';
import { useWinTransition } from './useWinTransition';
import { GAME_CONSTANTS } from '../config/constants';

import type { BaseGameState } from '@/utils/gameUtils';

export interface UseGameStateConfig<
    S extends BaseGameState,
    A extends { type: string },
> {
    /** localStorage key for game state. */
    storageKey: string;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** Core game logic and callbacks. */
    logic: {
        reducer: (state: S, action: A) => S;
        getInitialState: (rows: number, cols: number) => S;
        isSolved: (state: S) => boolean;
        winAnimationDelay?: number;
        persistence?: Record<string, unknown>;
        onNext?: () => void;
    };
}

/**
 * Manages game state, win detection, persistence, and transitions.
 * Extracted from useBaseGame for better separation of concerns.
 */
export function useGameState<
    S extends BaseGameState,
    A extends { type: string },
>({ storageKey, rows, cols, logic }: UseGameStateConfig<S, A>) {
    const {
        reducer,
        getInitialState,
        isSolved,
        winAnimationDelay = GAME_CONSTANTS.timing.winAnimationDelay,
        persistence,
        onNext,
    } = logic;

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

    useGamePersistence<S>({
        storageKey,
        rows,
        cols,
        state,
        onRestore: saved => {
            dispatch({ type: 'hydrate', state: saved } as unknown as A);
        },
        ...persistence,
    });

    useWinTransition(solved, handleNext, winAnimationDelay);

    return { state, dispatch, solved, handleNext };
}
