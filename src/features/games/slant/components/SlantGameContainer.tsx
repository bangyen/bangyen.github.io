import React from 'react';

import { SlantAnalysisBoard } from './SlantAnalysisBoard';
import { SlantBoard } from './SlantBoard';
import { SlantLoadingSkeleton } from './SlantLoadingSkeleton';
import { AnimatedBoardContainer } from '../../components/AnimatedBoardContainer';
import type { CellState, SlantState } from '../types';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { ErrorState } from '@/components/ui/ErrorState';
import { GAME_TEXT } from '@/features/games/config/constants';

export interface SlantAnalysisConfig {
    /** Saved analysis-mode moves. */
    moves: Map<string, CellState>;
    /** Callback when an analysis move is placed or removed. */
    onMove: (pos: string, val?: CellState) => void;
    /** Copy current board into analysis layer. */
    onCopy: () => void;
    /** Clear all analysis moves. */
    onClear: () => void;
    /** Close analysis mode. */
    onClose: () => void;
    /** Apply analysis moves to the real board. */
    onApply: (moves?: Map<string, CellState>) => void;
}

export interface SlantGameContainerProps {
    /** Whether analysis-mode overlay is active. */
    isAnalysisMode: boolean;
    /** Whether the worker is currently generating a new puzzle. */
    generating: boolean;
    /** True when grid dimensions have changed but state hasn't caught up. */
    dimensionsMismatch: boolean;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** Full Slant game state (numbers, grid, etc.). */
    state: SlantState;
    /** Cell size in rem units. */
    size: number;
    /** Analysis configuration and callbacks */
    analysis: SlantAnalysisConfig;
    /** Cell factory for the bottom (interactive slash cell) layer. */
    cellProps: (row: number, col: number) => Record<string, unknown>;
    /** Cell factory for the top (number overlay) layer. */
    overlayProps: (row: number, col: number) => Record<string, unknown>;
}

/**
 * Handles the domain branching for Slant:
 * analysis-mode overlay, loading skeleton, or the normal interactive board.
 */
export function SlantGameContainer({
    isAnalysisMode,
    generating,
    dimensionsMismatch,
    rows,
    cols,
    state,
    size,
    analysis,
    cellProps,
    overlayProps,
}: SlantGameContainerProps): React.ReactElement {
    if (isAnalysisMode) {
        return (
            <ErrorBoundary
                fallback={
                    <ErrorState message="Analysis mode encountered an error. Close and reopen to continue." />
                }
            >
                <SlantAnalysisBoard
                    rows={rows}
                    cols={cols}
                    numbers={state.numbers}
                    size={size}
                    initialMoves={analysis.moves}
                    onMove={analysis.onMove}
                    onCopy={analysis.onCopy}
                    onClear={analysis.onClear}
                    onClose={analysis.onClose}
                    onApply={analysis.onApply}
                />
            </ErrorBoundary>
        );
    }

    if (generating || dimensionsMismatch) {
        return <SlantLoadingSkeleton size={size} rows={rows} cols={cols} />;
    }

    return (
        <ErrorBoundary
            FallbackComponent={FeatureErrorFallback}
            fallbackProps={{
                title: GAME_TEXT.errors.boardTitle,
                resetLabel: GAME_TEXT.errors.boardReset,
            }}
        >
            <AnimatedBoardContainer>
                <SlantBoard
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={cellProps}
                    overlayProps={overlayProps}
                />
            </AnimatedBoardContainer>
        </ErrorBoundary>
    );
}
