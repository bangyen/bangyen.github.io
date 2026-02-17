import React from 'react';

import { SlantAnalysisBoard } from './SlantAnalysisBoard';
import { SlantLoadingSkeleton } from './SlantLoadingSkeleton';
import { Board } from '../../components/Board';
import { SLANT_STYLES } from '../config/constants';
import type { CellState, SlantState } from '../types';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { ErrorState } from '@/components/ui/ErrorState';
import { GAME_TEXT } from '@/features/games/config/constants';

export interface SlantBoardProps {
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
    /** Saved analysis-mode moves. */
    analysisMoves: Map<string, CellState>;
    /** Callback when an analysis move is placed or removed. */
    onAnalysisMove: (pos: string, val?: CellState) => void;
    /** Copy current board into analysis layer. */
    onAnalysisCopy: () => void;
    /** Clear all analysis moves. */
    onAnalysisClear: () => void;
    /** Close analysis mode. */
    onAnalysisClose: () => void;
    /** Cell factory for the bottom (interactive slash cell) layer. */
    cellProps: (row: number, col: number) => Record<string, unknown>;
    /** Cell factory for the top (number overlay) layer. */
    overlayProps: (row: number, col: number) => Record<string, unknown>;
}

/**
 * Renders the correct Slant board variant based on the current mode:
 * analysis-mode overlay, loading skeleton, or the normal interactive board.
 */
export function SlantBoard({
    isAnalysisMode,
    generating,
    dimensionsMismatch,
    rows,
    cols,
    state,
    size,
    analysisMoves,
    onAnalysisMove,
    onAnalysisCopy,
    onAnalysisClear,
    onAnalysisClose,
    cellProps,
    overlayProps,
}: SlantBoardProps): React.ReactElement {
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
                    initialMoves={analysisMoves}
                    onMove={onAnalysisMove}
                    onCopy={onAnalysisCopy}
                    onClear={onAnalysisClear}
                    onClose={onAnalysisClose}
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
            <style>{SLANT_STYLES.ANIMATIONS.POP_IN}</style>
            <Board
                size={size}
                rows={rows + 1}
                cols={cols + 1}
                cellRows={rows}
                cellCols={cols}
                space={0.125}
                overlayProps={overlayProps}
                cellProps={cellProps}
                overlayLayerSx={{ pointerEvents: 'none' }}
                overlayDecorative
            />
        </ErrorBoundary>
    );
}
