import { useReducer, useEffect, useMemo, useCallback } from 'react';
import { useGridSize } from './useGridSize';
import { useGamePersistence } from './useGamePersistence';
import { useWinTransition } from './useWinTransition';
import { usePageTitle } from './usePageTitle';
import { useResponsiveBoardSize } from './useResponsiveBoardSize';

interface BaseGameConfig<S, A> {
    storageKeys: {
        size: string;
        state: string;
    };
    pageTitle: string;
    gridConfig: {
        defaultSize: number | null;
        minSize?: number;
        maxSize?: number;
        headerOffset: {
            mobile: number;
            desktop: number;
        };
        paddingOffset: number;
        widthLimit?: number;
        cellSizeReference: number | { mobile: number; desktop: number };
        mobileRowOffset?: number;
    };
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
    reducer: (state: S, action: A) => S;
    getInitialState: (rows: number, cols: number) => S;
    onReset?: () => void;
    winAnimationDelay: number;
    isSolved: (state: S) => boolean;
    persistence?: {
        serialize?: (state: S) => unknown;
        deserialize?: (saved: unknown) => S;
        enabled?: boolean;
    };
}

export function useBaseGame<S, A>({
    storageKeys,
    pageTitle,
    gridConfig,
    boardConfig,
    reducer,
    getInitialState,
    winAnimationDelay,
    isSolved,
    persistence,
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

    const initial = useMemo(
        () => getInitialState(rows, cols),
        [rows, cols, getInitialState]
    );
    const [state, dispatch] = useReducer(reducer, initial);

    const solved = useMemo(() => isSolved(state), [state, isSolved]);

    const handleNext = useCallback(() => {
        dispatch({ type: 'new' } as unknown as A);
    }, [dispatch]);

    useGamePersistence<S>({
        storageKey: storageKeys.state,
        rows,
        cols,
        state,
        onRestore: saved => {
            dispatch({ type: 'restore', state: saved } as unknown as A);
            // Also handle 'hydrate' if that's what Slant uses
            dispatch({ type: 'hydrate', state: saved } as unknown as A);
        },
        ...persistence,
    });

    useWinTransition(solved, handleNext, winAnimationDelay);
    usePageTitle(pageTitle);

    useEffect(() => {
        dispatch({
            type: 'resize',
            rows,
            cols,
            newRows: rows,
            newCols: cols,
        } as unknown as A);
    }, [rows, cols, dispatch]);

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
