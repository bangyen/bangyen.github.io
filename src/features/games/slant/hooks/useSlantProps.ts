/**
 * Transforms raw Slant orchestration state into the five prop objects
 * consumed by the Slant page component. Separated from `useSlantGame`
 * so the orchestration hook focuses on state management while this
 * hook focuses on shaping output for the UI.
 */

import { useMemo } from 'react';

import type { BaseControlsProps, GamePageProps } from '../../hooks/types';
import type { DragProps } from '../../hooks/useDrag';
import { LAYOUT_CONSTANTS, NUMBER_SIZE_RATIO } from '../config/constants';
import type { CellState, SlantState } from '../types';
import { getBackProps, getFrontProps } from '../utils/renderers';

import { useCellFactory } from '@/utils/gameUtils';

/** Core game dimensions, state, and generation flags. */
export interface SlantGameParams {
    state: SlantState;
    rows: number;
    cols: number;
    size: number;
    mobile: boolean;
    isGhostMode: boolean;
    generating: boolean;
    handleNextAsync: () => void;
}

/** Ghost-mode move map, handlers, and UI callbacks. */
export interface SlantGhostParams {
    ghostMoves: Map<string, CellState>;
    handleGhostMove: (pos: string, val?: CellState) => void;
    handleGhostCopy: () => void;
    handleGhostClear: () => void;
    handleGhostClose: () => void;
    handleBoxClick: (e: React.MouseEvent) => void;
    handleOpenCalculator: () => void;
    /** Board wrapper styles from ghost mode. */
    boardSx?: Record<string, unknown>;
}

/** Info-dialog state and callbacks. */
export interface SlantInfoParams {
    infoOpen: boolean;
    toggleInfo: () => void;
}

export interface UseSlantPropsParams {
    game: SlantGameParams;
    ghost: SlantGhostParams;
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
        isGhostMode,
        generating,
        handleNextAsync,
    },
    ghost: {
        ghostMoves,
        handleGhostMove,
        handleGhostCopy,
        handleGhostClear,
        handleGhostClose,
        handleBoxClick,
        handleOpenCalculator,
        boardSx,
    },
    info: { infoOpen, toggleInfo },
    controls: controlsProps,
    getDragProps,
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
    } satisfies GamePageProps;
}
