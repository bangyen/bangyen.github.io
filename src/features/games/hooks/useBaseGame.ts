import { useEffect, useReducer, useMemo, useCallback, useRef } from 'react';
import type { Dispatch } from 'react';

import { calculateBoardSize } from './boardSizeUtils';
import type { BaseGameConfig, BaseControlsProps } from './types';
import {
    useWindow,
    useMobile,
    useLocalStorage,
    useDebouncedEffect,
} from '../../../hooks';
import {
    createStorageKeys,
    GAME_CONSTANTS,
    DEFAULT_GRID_CONFIG,
    DEFAULT_BOARD_CONFIG,
} from '../config/constants';
import { GAME_TOKENS } from '../config/tokens';

import type { BaseGameState, BaseGameAction } from '@/utils/gameUtils';

/**
 * Custom hook that orchestrates all game state management, including layout,
 * persistence, and state transitions.
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
    grid: callerGridConfig = {},
    board: boardConfig = {},
    logic,
}: BaseGameConfig<S, A>) {
    const keys = createStorageKeys(storageKeyPrefix);
    const { height, width } = useWindow();
    const mobile = useMobile('sm');

    const {
        reducer,
        getInitialState,
        isSolved,
        winAnimationDelay = GAME_CONSTANTS.timing.winAnimationDelay,
        persistence,
        onNext,
        manualResize = false,
    } = logic;

    // 1. Grid Dimension Management (formerly useGridSize)
    const [desiredSize, setDesiredSize] = useLocalStorage<number | null>(
        keys.SIZE,
        callerGridConfig.defaultSize ?? DEFAULT_GRID_CONFIG.defaultSize,
        {
            serialize: String,
            deserialize: raw => {
                if (raw === 'null') return null;
                const n = Number.parseInt(raw, 10);
                return Number.isNaN(n) ? undefined : n;
            },
        },
    );

    const dynamicSize = useMemo(() => {
        const headerOffset =
            callerGridConfig.headerOffset ?? DEFAULT_GRID_CONFIG.headerOffset;
        const currentHeaderOffset = mobile
            ? headerOffset.mobile
            : headerOffset.desktop;

        const cellSizeReference =
            callerGridConfig.cellSizeReference ??
            DEFAULT_GRID_CONFIG.cellSizeReference;
        const referenceSize =
            typeof cellSizeReference === 'number'
                ? cellSizeReference
                : mobile
                  ? cellSizeReference.mobile
                  : cellSizeReference.desktop;

        const gridPadding =
            callerGridConfig.gridPadding ?? DEFAULT_GRID_CONFIG.gridPadding;
        const pX = typeof gridPadding === 'number' ? 0 : gridPadding.x;
        const pY =
            typeof gridPadding === 'number' ? gridPadding : gridPadding.y;

        const remToPx = 16;
        const cellSizePx = referenceSize * remToPx;
        const availableH = height - currentHeaderOffset - pY;
        const availableW =
            Math.min(
                width,
                callerGridConfig.widthLimit ?? DEFAULT_GRID_CONFIG.widthLimit,
            ) - pX;

        let r = Math.floor(availableH / cellSizePx) - 1;
        const c = Math.floor(availableW / cellSizePx) - 1;
        if (mobile) {
            r +=
                callerGridConfig.mobileRowOffset ??
                DEFAULT_GRID_CONFIG.mobileRowOffset;
        }

        const minSize = callerGridConfig.minSize ?? DEFAULT_GRID_CONFIG.minSize;
        return {
            rows: Math.max(minSize, r),
            cols: Math.max(minSize, c),
        };
    }, [callerGridConfig, height, width, mobile]);

    const { rows, cols } = useMemo(() => {
        if (desiredSize === null) return dynamicSize;
        const mobileRowOffset =
            callerGridConfig.mobileRowOffset ??
            DEFAULT_GRID_CONFIG.mobileRowOffset;
        const extraRows = mobile ? Math.max(0, mobileRowOffset + 1) : 0;
        return {
            rows: Math.min(desiredSize + extraRows, dynamicSize.rows),
            cols: Math.min(desiredSize, dynamicSize.cols),
        };
    }, [desiredSize, dynamicSize, mobile, callerGridConfig.mobileRowOffset]);

    // 2. Board Size Calculation (formerly useBoardLayout)
    const size = useMemo(() => {
        const mergedBoard = { ...DEFAULT_BOARD_CONFIG, ...boardConfig };
        const headerOffset =
            callerGridConfig.headerOffset ?? DEFAULT_GRID_CONFIG.headerOffset;
        const boardPadding =
            typeof mergedBoard.boardPadding === 'function'
                ? mergedBoard.boardPadding(mobile)
                : mergedBoard.boardPadding;

        return calculateBoardSize({
            rows,
            cols,
            width,
            height,
            mobile,
            headerOffset,
            ...mergedBoard,
            boardPadding,
        });
    }, [
        rows,
        cols,
        width,
        height,
        mobile,
        callerGridConfig.headerOffset,
        boardConfig,
    ]);

    // 3. State Management
    const initialRef = useRef<S | null>(null);
    if (initialRef.current === null) {
        initialRef.current = getInitialState(rows, cols);
    }
    const [state, dispatch] = useReducer(reducer, initialRef.current);
    const solved = useMemo(() => isSolved(state), [state, isSolved]);

    const onNextRef = useRef(onNext);
    onNextRef.current = onNext;

    const handleNext = useCallback(() => {
        if (onNextRef.current) {
            onNextRef.current();
        } else {
            dispatch({ type: 'new' } as unknown as A);
        }
    }, []);

    // 4. Persistence (formerly useGamePersistence)
    const persistenceKey = `${keys.STATE}-${String(rows)}x${String(cols)}`;
    const lastRestoredKey = useRef<string | null>(null);

    const deserializeRef = useRef(persistence?.deserialize);
    deserializeRef.current = persistence?.deserialize;

    useEffect(() => {
        if (lastRestoredKey.current === persistenceKey) return;
        const saved = localStorage.getItem(persistenceKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as unknown;
                const hydratedState = deserializeRef.current
                    ? deserializeRef.current(parsed)
                    : (parsed as S);

                dispatch({
                    type: 'hydrate',
                    state: hydratedState,
                } as unknown as A);
            } catch {
                localStorage.removeItem(persistenceKey);
            }
        }
        lastRestoredKey.current = persistenceKey;
    }, [persistenceKey]);

    useDebouncedEffect(
        () => {
            const serialize =
                persistence?.serialize ?? ((s: S) => s as unknown);
            localStorage.setItem(
                persistenceKey,
                JSON.stringify(serialize(state)),
            );
        },
        300,
        [persistenceKey, state, persistence?.serialize],
    );

    // 5. Transitions & Resize Sync
    useEffect(() => {
        if (solved) {
            const timeout = setTimeout(() => {
                handleNext();
            }, winAnimationDelay);
            return () => {
                clearTimeout(timeout);
            };
        }
    }, [solved, winAnimationDelay, handleNext]);

    useEffect(() => {
        if (manualResize) return;
        dispatch({
            type: 'resize',
            rows,
            cols,
            newRows: rows,
            newCols: cols,
        } as unknown as A);
    }, [rows, cols, manualResize]);

    // 6. UI Controls
    const handlePlus = useCallback(() => {
        const currentSize = Math.min(rows, cols);
        const maxSize = callerGridConfig.maxSize ?? DEFAULT_GRID_CONFIG.maxSize;
        if (
            desiredSize !== null &&
            currentSize < Math.min(dynamicSize.rows, dynamicSize.cols) &&
            currentSize < maxSize
        ) {
            setDesiredSize(currentSize + 1);
        }
    }, [
        rows,
        cols,
        desiredSize,
        dynamicSize,
        callerGridConfig.maxSize,
        setDesiredSize,
    ]);

    const handleMinus = useCallback(() => {
        const currentSize = Math.min(rows, cols);
        const minSize = callerGridConfig.minSize ?? DEFAULT_GRID_CONFIG.minSize;
        if (desiredSize === null) {
            const minDim = Math.min(dynamicSize.rows, dynamicSize.cols);
            if (dynamicSize.rows === dynamicSize.cols) {
                setDesiredSize(Math.max(minSize, minDim - 1));
            } else {
                setDesiredSize(minDim);
            }
        } else if (currentSize > minSize) {
            setDesiredSize(currentSize - 1);
        }
    }, [
        rows,
        cols,
        desiredSize,
        dynamicSize,
        callerGridConfig.minSize,
        setDesiredSize,
    ]);

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
            rows,
            cols,
            size,
            mobile,
            scaling: GAME_TOKENS.scaling.default,
        },
        controlsProps: {
            rows,
            cols,
            dynamicSize,
            minSize: callerGridConfig.minSize ?? DEFAULT_GRID_CONFIG.minSize,
            maxSize: callerGridConfig.maxSize ?? DEFAULT_GRID_CONFIG.maxSize,
            handlePlus,
            handleMinus,
            onRefresh: handleNext,
        },
    };

    return result;
}
