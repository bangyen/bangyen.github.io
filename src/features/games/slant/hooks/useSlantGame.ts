import React, { useEffect, useCallback, useRef, useMemo } from 'react';

import { useAnalysisMode } from './useAnalysisMode';
import { useDimensionRegeneration } from './useDimensionRegeneration';
import { useGenerationWorker } from './useGenerationWorker';
import { useSlantBoard } from './useSlantBoard';
import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useGameInfo } from '../../hooks/useGameInfo';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { getSlantGameConfig } from '../config';
import { STORAGE_KEYS, LAYOUT_CONSTANTS } from '../config/constants';
import type { SlantAction, SlantState } from '../types';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import {
    serializeSlantState,
    isSavedSlantState,
    deserializeSlantState,
    persistSlantState,
} from '../utils/persistence';

/**
 * Orchestrates all Slant-specific game logic and prepares props for the UI.
 * Consolidates puzzle generation, analysis mode, and UI-ready prop bundles.
 */
export function useSlantGame() {
    const [isAnalysisMode, setIsAnalysisMode] = React.useState(false);
    const { open: infoOpen, toggleOpen: toggleInfo } = useGameInfo();

    // Refs kept in sync with useBaseGame output, shared with the worker hook.
    const dispatchRef = useRef<React.Dispatch<
        SlantAction | { type: 'hydrate'; state: SlantState }
    > | null>(null);
    const dimsRef = useRef({ rows: 0, cols: 0 });

    const handleStaleResult = useCallback(
        (staleState: SlantState, r: number, c: number) => {
            if (isAnalysisMode) return;
            persistSlantState(staleState, r, c);
        },
        [isAnalysisMode],
    );

    const {
        generating,
        requestGeneration,
        handleNextAsync,
        prefetch,
        cancelGeneration,
    } = useGenerationWorker({
        getInitialState,
        dispatchRef,
        dimsRef,
        onStaleResult: handleStaleResult,
    });

    const baseGame = useBaseGame<SlantState, SlantAction>({
        ...getSlantGameConfig(),
        logic: {
            reducer: handleBoard,
            getInitialState: (rows: number, cols: number) =>
                getInitialState(rows, cols),
            onNext: handleNextAsync,
            isSolved: (s: SlantState) => s.solved,
            manualResize: true,
            persistence: {
                enabled: !isAnalysisMode,
                serialize: serializeSlantState,
                deserialize: (saved: unknown) => {
                    if (!isSavedSlantState(saved)) {
                        throw new Error(
                            `Corrupt Slant state in localStorage: expected a valid SavedSlantState object but received ${JSON.stringify(saved).slice(0, 100)}`,
                        );
                    }
                    return deserializeSlantState(saved);
                },
            },
        },
    });

    const { state, dispatch, layout } = baseGame;
    const { rows, cols, size, mobile, scaling } = layout;

    // Keep refs in sync with latest values from useBaseGame.
    dispatchRef.current = dispatch;
    dimsRef.current = { rows, cols };

    // Analysis mode state and handlers.
    const {
        analysisMoves,
        boardSx,
        handleAnalysisMove,
        handleAnalysisCopy,
        handleAnalysisClear,
        handleAnalysisClose,
        handleAnalysisApply,
        handleBoxClick,
        handleOpenAnalysis,
    } = useAnalysisMode({
        isAnalysisMode,
        setIsAnalysisMode,
        state,
        rows,
        cols,
        storageKey: STORAGE_KEYS.ANALYSIS_MOVES,
        toggleInfo,
        dispatch,
    });

    useDimensionRegeneration({
        rows,
        cols,
        isAnalysisMode,
        requestGeneration,
        cancelGeneration,
    });

    // Prefetch the next puzzle as soon as the current one is solved so
    // generation overlaps with the win animation instead of waiting.
    useEffect(() => {
        if (state.solved && !isAnalysisMode) {
            prefetch(rows, cols);
        }
    }, [state.solved, isAnalysisMode, rows, cols, prefetch]);

    const { getDragProps: getBaseDragProps } = useDrag({
        onToggle: (r: number, c: number, isRightClick: boolean) => {
            dispatch({
                type: 'toggle',
                row: r,
                col: c,
                reverse: isRightClick,
            });
        },
        checkEnabled: () => !state.solved,
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
    });

    const { handleKeyDown: handleGridNav } = useGridNavigation({
        rows,
        cols,
    });

    const getDragProps = useCallback(
        (pos: string) => {
            const dragProps = getBaseDragProps(pos);
            return {
                ...dragProps,
                onKeyDown: (e: React.KeyboardEvent) => {
                    dragProps.onKeyDown(e);
                    handleGridNav(e);
                },
            };
        },
        [getBaseDragProps, handleGridNav],
    );

    // UI Props derivations (formerly in useSlantProps)
    const { cellProps, overlayProps } = useSlantBoard({
        state,
        size,
        getDragProps,
    });

    const contentSx = useMemo(
        () => ({
            px: mobile ? '1rem' : '2rem',
            pt: mobile ? '1rem' : '2rem',
        }),
        [mobile],
    );
    const dimensionsMismatch = rows !== state.rows || cols !== state.cols;

    const boardProps = useMemo(
        () => ({
            isAnalysisMode,
            generating,
            dimensionsMismatch,
            rows,
            cols,
            state,
            size,
            analysis: {
                moves: analysisMoves,
                onMove: handleAnalysisMove,
                onCopy: handleAnalysisCopy,
                onClear: handleAnalysisClear,
                onClose: handleAnalysisClose,
                onApply: handleAnalysisApply,
            },
            cellProps,
            overlayProps,
        }),
        [
            isAnalysisMode,
            generating,
            dimensionsMismatch,
            rows,
            cols,
            state,
            size,
            analysisMoves,
            handleAnalysisMove,
            handleAnalysisCopy,
            handleAnalysisClear,
            handleAnalysisClose,
            handleAnalysisApply,
            cellProps,
            overlayProps,
        ],
    );

    const layoutProps = useMemo(
        () => ({
            boardSx,
            contentSx,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
        }),
        [boardSx, contentSx],
    );

    const infoProps = useMemo(
        () => ({
            open: infoOpen,
            toggleOpen: toggleInfo,
            handleOpenAnalysis,
            handleBoxClick,
        }),
        [infoOpen, toggleInfo, handleOpenAnalysis, handleBoxClick],
    );

    const trophyProps = useMemo(
        () => ({
            scaling,
        }),
        [scaling],
    );

    return {
        boardProps,
        layoutProps,
        infoProps,
        gameState: {
            ...baseGame,
            solved: state.solved,
            handleNext: handleNextAsync,
        },
        trophyProps,
    };
}
