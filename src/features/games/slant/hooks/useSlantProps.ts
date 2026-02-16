/**
 * Transforms raw Slant orchestration state into the five prop objects
 * consumed by the Slant page component. Separated from `useSlantGame`
 * so the orchestration hook focuses on state management while this
 * hook focuses on shaping output for the UI.
 */

import { useMemo } from 'react';

import type { DragProps } from '../../hooks/useDrag';
import { LAYOUT_CONSTANTS, NUMBER_SIZE_RATIO } from '../config/constants';
import type { CellState, SlantState } from '../types';
import { getBackProps, getFrontProps } from '../utils/renderers';

import { useCellFactory } from '@/utils/gameUtils';

export interface UseSlantPropsParams {
    /** Current Slant game state. */
    state: SlantState;
    /** Grid row count. */
    rows: number;
    /** Grid column count. */
    cols: number;
    /** Cell size in rem units. */
    size: number;
    /** Whether ghost-mode overlay is active. */
    isGhostMode: boolean;
    /** Whether the worker is generating a new puzzle. */
    generating: boolean;
    /** Trigger the next puzzle generation. */
    handleNextAsync: () => void;
    /** Ghost-mode move map. */
    ghostMoves: Map<string, CellState>;
    /** Ghost-mode handlers. */
    handleGhostMove: (pos: string, val?: CellState) => void;
    handleGhostCopy: () => void;
    handleGhostClear: () => void;
    handleGhostClose: () => void;
    handleBoxClick: (e: React.MouseEvent) => void;
    handleOpenCalculator: () => void;
    /** Info dialog state. */
    infoOpen: boolean;
    toggleInfo: () => void;
    /** Base game controls props from useBaseGame. */
    controlsProps: {
        rows: number;
        cols: number;
        dynamicSize: { rows: number; cols: number };
        minSize: number;
        maxSize: number;
        handlePlus: () => void;
        handleMinus: () => void;
        onRefresh: () => void;
    };
    /** Drag interaction factory. */
    getDragProps: (pos: string) => DragProps;
    /** Whether the device is mobile. */
    mobile: boolean;
    /** Board wrapper styles from ghost mode. */
    boardSx?: Record<string, unknown>;
}

/**
 * Builds the five prop bundles (`boardProps`, `controlsProps`,
 * `layoutProps`, `infoProps`, `trophyProps`) from raw orchestration
 * state, using memoised cell factories and computed flags.
 */
export function useSlantProps({
    state,
    rows,
    cols,
    size,
    isGhostMode,
    generating,
    handleNextAsync,
    ghostMoves,
    handleGhostMove,
    handleGhostCopy,
    handleGhostClear,
    handleGhostClose,
    handleBoxClick,
    handleOpenCalculator,
    infoOpen,
    toggleInfo,
    controlsProps,
    getDragProps,
    mobile,
    boardSx,
}: UseSlantPropsParams) {
    const numberSize = size * NUMBER_SIZE_RATIO;

    const backProps = useCellFactory(getBackProps, getDragProps, [state, size]);

    const frontProps = useMemo(
        () => getFrontProps(state, numberSize),
        [state, numberSize],
    );

    const contentSx = useMemo(
        () => ({
            px: mobile ? '1rem' : '2rem',
            pt: mobile ? '1rem' : '2rem',
        }),
        [mobile],
    );

    const dimensionsMismatch = rows !== state.rows || cols !== state.cols;

    return {
        boardProps: {
            isGhostMode,
            generating,
            dimensionsMismatch,
            rows,
            cols,
            state,
            size,
            ghostMoves,
            onGhostMove: handleGhostMove,
            onGhostCopy: handleGhostCopy,
            onGhostClear: handleGhostClear,
            onGhostClose: handleGhostClose,
            cellProps: backProps,
            overlayProps: frontProps,
        },
        controlsProps: {
            ...controlsProps,
            onRefresh: handleNextAsync,
            disabled: generating,
            onOpenInfo: toggleInfo,
            hidden: isGhostMode,
        },
        layoutProps: {
            boardSx,
            contentSx,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
        },
        infoProps: {
            open: infoOpen,
            toggleOpen: toggleInfo,
            handleOpenCalculator,
            handleBoxClick,
        },
        trophyProps: {
            show: !isGhostMode && state.solved,
            onReset: handleNextAsync,
            size,
            iconSizeRatio: LAYOUT_CONSTANTS.ICON_SIZE_RATIO,
        },
    };
}
