import type React from 'react';
import { useRef, useMemo, useCallback, useState } from 'react';

import { useAnalysisMode } from './useAnalysisMode';
import { useDimensionRegeneration } from './useDimensionRegeneration';
import { useGenerationWorker } from './useGenerationWorker';
import { useSlantBoard } from './useSlantBoard';
import { GAME_CONSTANTS } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { getSlantGameConfig } from '../config';
import { LAYOUT_CONSTANTS, STORAGE_KEYS } from '../config/constants';
import type { SlantState, SlantAction, CellState } from '../types';
import { handleBoard, getInitialState } from '../utils/boardHandlers';
import {
    isSavedSlantState,
    serializeSlantState,
    deserializeSlantState,
    persistSlantState,
} from '../utils/persistence';

type SlantDispatch = React.Dispatch<
    SlantAction | { type: 'hydrate'; state: SlantState }
>;

/**
 * Orchestrates Slant game logic and prepares props for the UI.
 * Consolidates layout, state, worker, analysis mode, and UI prop shaping.
 */
export function useSlantGame() {
    const [isAnalysisMode, setIsAnalysisMode] = useState(false);

    // Inline redundant useGameInfo
    const [infoOpen, setInfoOpen] = useState(false);
    const toggleInfo = useCallback(() => {
        setInfoOpen(prev => !prev);
    }, []);

    // Refs kept in sync with useBaseGame output, shared with the worker hook.
    // We use a broader type for the ref to bridge useBaseGame's generic with useGenerationWorker's needs
    const dispatchRef = useRef<SlantDispatch | null>(null);
    const dimsRef = useRef<{ rows: number; cols: number }>({
        rows: 0,
        cols: 0,
    });

    const baseGame = useBaseGame<SlantState, SlantAction>({
        ...getSlantGameConfig(),
        logic: {
            reducer: handleBoard,
            getInitialState,
            isSolved: (s: SlantState) => s.solved,
            manualResize: true, // we handle generation via useGenerationWorker
            persistence: {
                serialize: serializeSlantState,
                deserialize: (saved: unknown) => {
                    if (!isSavedSlantState(saved)) {
                        throw new Error('Corrupt Slant state');
                    }
                    return deserializeSlantState(saved);
                },
            },
        },
    });

    const { state, dispatch, solved, layout, controlsProps } = baseGame;
    const { rows, cols, size, mobile, scaling: rawScaling } = layout;

    // Explicitly cast scaling to avoid resolution errors in the linter
    const scaling = rawScaling as {
        iconSize: string;
        containerSize: string;
        padding: number;
    };

    // Keep refs in sync for the worker
    dispatchRef.current = dispatch as unknown as SlantDispatch;
    dimsRef.current = { rows, cols };

    // 1. Worker and Dimension Regeneration logic
    const { generating, handleNextAsync, requestGeneration, cancelGeneration } =
        useGenerationWorker({
            getInitialState,
            dispatchRef,
            dimsRef,
            onStaleResult: persistSlantState,
        });

    useDimensionRegeneration({
        rows,
        cols,
        isAnalysisMode,
        requestGeneration,
        cancelGeneration,
    });

    // 2. Interaction logic (useDrag)
    const { getDragProps: getBaseDragProps } = useDrag<CellState>({
        onToggle: (r, c, isRight, draggingValue, isInitial) => {
            if (isAnalysisMode) return;

            const gridRow = state.grid[r];
            if (!gridRow) return;
            const current = gridRow[c];
            const target = isRight ? 2 : 1;
            const next = (current === target ? 0 : target) as CellState;

            if (isInitial) {
                dispatch({ type: 'toggle', row: r, col: c, reverse: isRight });
                return next;
            } else if (
                draggingValue !== undefined &&
                current !== draggingValue
            ) {
                dispatch({ type: 'toggle', row: r, col: c, reverse: isRight });
            }
            return draggingValue;
        },
        checkEnabled: () => !solved && !generating,
        touchTimeout: GAME_CONSTANTS.timing.interactionDelay,
    });

    const { handleKeyDown: handleGridNav } = useGridNavigation({ rows, cols });

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

    // 3. Analysis mode logic
    const analysis = useAnalysisMode({
        state,
        dispatch,
        isAnalysisMode,
        setIsAnalysisMode,
        rows,
        cols,
        storageKey: STORAGE_KEYS.ANALYSIS_MOVES,
        toggleInfo,
    });

    // 4. UI Props derivation
    const { cellProps, overlayProps } = useSlantBoard({
        state,
        size,
        getDragProps,
    });

    const layoutProps = useMemo(
        () => ({
            boardSx: {
                marginTop: mobile
                    ? `${String(LAYOUT_CONSTANTS.PADDING_OFFSET)}px`
                    : `${String(LAYOUT_CONSTANTS.PADDING_OFFSET)}px`,
            },
        }),
        [mobile],
    );

    const infoProps = useMemo(
        () => ({
            open: infoOpen,
            solved,
            toggleOpen: toggleInfo,
            board: { rows, cols, size },
            rendering: {
                palette: { primary: '', secondary: '' }, // placeholder
                getFrontProps: () => ({}), // placeholder
                getBackProps: () => ({}), // placeholder
            },
            handleBoxClick: analysis.handleBoxClick,
            handleOpenAnalysis: analysis.handleOpenAnalysis,
        }),
        [
            infoOpen,
            solved,
            toggleInfo,
            rows,
            cols,
            size,
            analysis.handleBoxClick,
            analysis.handleOpenAnalysis,
        ],
    );

    const trophyProps = useMemo(() => ({ scaling }), [scaling]);

    const activeControlsProps = useMemo(
        () => ({
            ...controlsProps,
            hidden: isAnalysisMode,
            onRefresh: () => {
                handleNextAsync();
                controlsProps.onRefresh();
            },
        }),
        [controlsProps, isAnalysisMode, handleNextAsync],
    );

    const dimensionsMismatch = state.rows !== rows || state.cols !== cols;

    return {
        boardProps: {
            state,
            size,
            rows,
            cols,
            cellProps,
            overlayProps,
            isAnalysisMode,
            generating,
            dimensionsMismatch,
            analysis: {
                moves: analysis.analysisMoves,
                onMove: analysis.handleAnalysisMove,
                onCopy: analysis.handleAnalysisCopy,
                onClear: analysis.handleAnalysisClear,
                onClose: analysis.handleAnalysisClose,
                onApply: analysis.handleAnalysisApply,
            },
        },
        layoutProps,
        infoProps,
        gameState: {
            ...baseGame,
            controlsProps: activeControlsProps,
            handleNext: handleNextAsync,
        },
        analysis,
        trophyProps,
    };
}
