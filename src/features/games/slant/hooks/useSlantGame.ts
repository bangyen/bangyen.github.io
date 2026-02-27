import type React from 'react';
import { useRef, useMemo, useCallback, useState } from 'react';

import { useAnalysisMode } from './useAnalysisMode';
import { useGenerationWorker } from './useGenerationWorker';
import { GAME_CONSTANTS, BOARD_STYLES } from '../../config/constants';
import { useBaseGame } from '../../hooks/useBaseGame';
import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { LAYOUT_CONSTANTS, STORAGE_KEYS } from '../config/constants';
import { getSlantGameConfig } from '../config/index';
import type { SlantState, SlantAction, CellState } from '../types';
import { handleBoard, getInitialState } from '../utils/boardHandlers';
import {
    isSavedSlantState,
    serializeSlantState,
    deserializeSlantState,
    persistSlantState,
} from '../utils/persistence';

import { useGameInfoState } from '@/features/games/hooks/useGameInfoState';

type SlantDispatch = React.Dispatch<
    SlantAction | { type: 'hydrate'; state: SlantState }
>;

/**
 * Orchestrates Slant game logic and prepares props for the UI.
 * Consolidates layout, state, worker, analysis mode, and UI prop shaping.
 */
export function useSlantGame() {
    const [isAnalysisMode, setIsAnalysisMode] = useState(false);

    // Use shared info modal hook
    const { infoOpen, toggleInfo } = useGameInfoState();

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
    const { generating, handleNextAsync } = useGenerationWorker({
        rows,
        cols,
        isAnalysisMode,
        getInitialState,
        dispatchRef,
        dimsRef,
        onStaleResult: persistSlantState,
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

    // 4. UI Props derivation (inlined useSlantBoard)
    const cellProps = useMemo(
        () => (r: number, c: number) => {
            const pos = `${r.toString()},${c.toString()}`;
            return getDragProps(pos);
        },
        [getDragProps],
    );

    const overlayProps = useMemo(
        () => (_r: number, _c: number) => ({
            role: 'presentation',
            'aria-hidden': true,
        }),
        [],
    );

    const boardSx = useMemo(
        () => ({
            marginTop: mobile
                ? `${String(LAYOUT_CONSTANTS.OFFSET.MOBILE)}px`
                : `${String(LAYOUT_CONSTANTS.OFFSET.DESKTOP)}px`,
            padding: {
                xs: 0,
                sm: BOARD_STYLES.PADDING.DESKTOP,
            },
            borderRadius: {
                xs: 0,
                sm: BOARD_STYLES.BORDER_RADIUS,
            },
        }),
        [mobile],
    );

    const dimensionsMismatch = state.rows !== rows || state.cols !== cols;

    return {
        // State & Logic
        state,
        dispatch,
        solved: !isAnalysisMode && solved,
        generating,
        dimensionsMismatch,

        // Layout & UI
        rows,
        cols,
        size,
        mobile,
        scaling,
        boardSx,
        handleNext: handleNextAsync,

        // Props for child components
        cellProps,
        overlayProps,
        controlsProps: {
            ...controlsProps,
            hidden: isAnalysisMode,
            disabled: generating,
            onRefresh: () => {
                handleNextAsync();
                controlsProps.onRefresh();
            },
        },
        infoProps: {
            open: infoOpen,
            solved,
            toggleOpen: toggleInfo,
            board: { rows, cols, size },
            handleBoxClick: analysis.handleBoxClick,
            handleOpenAnalysis: analysis.handleOpenAnalysis,
        },
        analysis: {
            active: isAnalysisMode,
            moves: analysis.analysisMoves,
            onMove: analysis.handleAnalysisMove,
            onCopy: analysis.handleAnalysisCopy,
            onClear: analysis.handleAnalysisClear,
            onClose: analysis.handleAnalysisClose,
            onApply: analysis.handleAnalysisApply,
            ...analysis, // include raw analysis result if needed by page
        },
        trophyProps: { scaling },
    };
}
