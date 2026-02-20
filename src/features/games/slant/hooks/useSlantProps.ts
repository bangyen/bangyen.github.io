/**
 * Transforms raw Slant orchestration state into the five prop objects
 * consumed by the Slant page component. Separated from `useSlantGame`
 * so the orchestration hook focuses on state management while this
 * hook focuses on shaping output for the UI.
 */

import type { SxProps, Theme } from '@mui/material';
import { useMemo } from 'react';

import { getSlantContentSx } from './useSlantProps.styles';
import type { GameControlsProps } from '../../components/GameControls';
import type { BaseControlsProps, GamePageProps } from '../../hooks/types';
import type { DragProps } from '../../hooks/useDrag';
import type { SlantGameContainerProps } from '../components/SlantGameContainer';
import { useSlantBoard } from '../components/useSlantBoard';
import { LAYOUT_CONSTANTS } from '../config/constants';
import type { CellState, SlantState } from '../types';

// ---------------------------------------------------------------------------
// Concrete return-shape types for compile-time safety
// ---------------------------------------------------------------------------

/** Layout overrides returned by useSlantProps. */
interface SlantLayoutReturn {
    boardSx?: Record<string, unknown>;
    contentSx: SxProps<Theme>;
    iconSizeRatio: number;
}

/** Info-dialog return shape (superset of SlantInfoProps for page use). */
interface SlantInfoReturn {
    open: boolean;
    toggleOpen: () => void;
    handleOpenAnalysis: () => void;
    handleBoxClick: (e: React.MouseEvent) => void;
}

/** Core game dimensions, state, and generation flags. */
export interface SlantGameParams {
    state: SlantState;
    rows: number;
    cols: number;
    size: number;
    mobile: boolean;
    isAnalysisMode: boolean;
    generating: boolean;
    handleNextAsync: () => void;
}

/** Analysis-mode move map, handlers, and UI callbacks. */
export interface SlantAnalysisParams {
    analysisMoves: Map<string, CellState>;
    handleAnalysisMove: (pos: string, val?: CellState) => void;
    handleAnalysisCopy: () => void;
    handleAnalysisClear: () => void;
    handleAnalysisClose: () => void;
    handleAnalysisApply: () => void;
    handleBoxClick: (e: React.MouseEvent) => void;
    handleOpenAnalysis: () => void;
    /** Board wrapper styles from analysis mode. */
    boardSx?: Record<string, unknown>;
}

/** Info-dialog state and callbacks. */
export interface SlantInfoParams {
    infoOpen: boolean;
    toggleInfo: () => void;
}

export interface UseSlantPropsParams {
    game: SlantGameParams;
    analysis: SlantAnalysisParams;
    info: SlantInfoParams;
    controls: BaseControlsProps;
    getDragProps: (pos: string) => DragProps;
}

/**
 * Builds the five prop bundles (`boardProps`, `controlsProps`,
 * `layoutProps`, `infoProps`, `trophyProps`) from raw orchestration
 * state, using memoised cell factories and computed flags.  Returns a
 * `GamePageProps`-conformant object so every game page receives a
 * structurally consistent contract.
 */
export function useSlantProps({
    game: {
        state,
        rows,
        cols,
        size,
        mobile,
        isAnalysisMode,
        generating,
        handleNextAsync,
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
    controls: controlsProps,
    getDragProps,
}: UseSlantPropsParams) {
    const { cellProps, overlayProps } = useSlantBoard({
        state,
        size,
        getDragProps,
    });

    const contentSx = useMemo(() => getSlantContentSx(mobile), [mobile]);

    const dimensionsMismatch = rows !== state.rows || cols !== state.cols;

    return {
        boardProps: {
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
        },
        controlsProps: {
            ...controlsProps,
            onRefresh: handleNextAsync,
            disabled: generating,
            onOpenInfo: toggleInfo,
            hidden: isAnalysisMode,
        },
        layoutProps: {
            boardSx,
            contentSx,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
        },
        infoProps: {
            open: infoOpen,
            toggleOpen: toggleInfo,
            handleOpenAnalysis,
            handleBoxClick,
        },
        trophyProps: {
            show: !isAnalysisMode && state.solved,
            onReset: handleNextAsync,
        },
    } satisfies GamePageProps<
        SlantGameContainerProps,
        GameControlsProps,
        SlantLayoutReturn,
        SlantInfoReturn
    >;
}
