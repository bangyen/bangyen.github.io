import React, { useEffect, useCallback, useRef } from 'react';

import { useAnalysisMode } from './useAnalysisMode';
import { useDimensionRegeneration } from './useDimensionRegeneration';
import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { getSlantGameConfig } from '../config';
import { STORAGE_KEYS } from '../config/constants';
import type { SlantAction, SlantState } from '../types';
import { useGenerationWorker } from './useGenerationWorker';
import { useSlantProps } from './useSlantProps';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { getInitialState, handleBoard } from '../utils/boardHandlers';
import {
    serializeSlantState,
    isSavedSlantState,
    deserializeSlantState,
    persistSlantState,
} from '../utils/persistence';

import { createCellIndex } from '@/features/games/types';
import { useDisclosure } from '@/hooks';

/**
 * Orchestrates all Slant-specific game logic: worker-based puzzle
 * generation, analysis mode, drag interaction, cell prop factories,
 * and dimension-change detection.
 *
 * Extracted from Slant.tsx so the page component is pure JSX
 * composition, mirroring the LightsOut page pattern.
 */
export function useSlantGame() {
    const [isAnalysisMode, setIsAnalysisMode] = React.useState(false);
    const { isOpen: infoOpen, toggle: toggleInfo } = useDisclosure();

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

    // useMobile is already called inside useBaseGame via useGridSize,
    // so we derive mobile from the baseGame result instead of subscribing twice
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

    const { handleKeyDown: handleGridNav } = useGridNavigation({ rows, cols });

    const { getDragProps } = useDrag({
        onToggle: (r: number, c: number, isRightClick: boolean) => {
            dispatch({
                type: 'toggle',
                row: createCellIndex(r),
                col: createCellIndex(c),
                reverse: isRightClick,
            });
        },
        checkEnabled: () => !state.solved,
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
    });

    const getEnhancedDragProps = useCallback(
        (pos: string) => {
            const dragProps = getDragProps(pos);
            return {
                ...dragProps,
                onKeyDown: (e: React.KeyboardEvent) => {
                    dragProps.onKeyDown(e);
                    handleGridNav(e);
                },
            };
        },
        [getDragProps, handleGridNav],
    );

    return {
        ...useSlantProps({
            game: {
                state,
                rows,
                cols,
                size,
                mobile,
                isAnalysisMode,
                generating,
                scaling,
            },
            analysis: {
                analysisMoves,
                handleAnalysisMove,
                handleAnalysisCopy,
                handleAnalysisClear,
                handleAnalysisClose,
                handleAnalysisApply,
                handleBoxClick,
                handleOpenAnalysis,
                boardSx,
            },
            info: { infoOpen, toggleInfo },
            getDragProps: getEnhancedDragProps,
        }),
        gameState: {
            ...baseGame,
            solved: state.solved,
            handleNext: handleNextAsync,
        },
    };
}
