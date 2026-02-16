import React from 'react';

import { SlantGhostBoard } from './SlantGhostBoard';
import { SlantLoadingSkeleton } from './SlantLoadingSkeleton';
import { Board } from '../../components/Board';
import type { CellState, SlantState } from '../types';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';
import { ErrorState } from '@/components/ui/ErrorState';
import { GAME_TEXT } from '@/features/games/config/constants';

export interface SlantBoardProps {
    /** Whether ghost-mode overlay is active. */
    isGhostMode: boolean;
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
    /** Saved ghost-mode moves. */
    ghostMoves: Map<string, CellState>;
    /** Callback when a ghost move is placed or removed. */
    onGhostMove: (pos: string, val?: CellState) => void;
    /** Copy current board into ghost layer. */
    onGhostCopy: () => void;
    /** Clear all ghost moves. */
    onGhostClear: () => void;
    /** Close ghost mode. */
    onGhostClose: () => void;
    /** Cell factory for the bottom (interactive slash cell) layer. */
    cellProps: (row: number, col: number) => Record<string, unknown>;
    /** Cell factory for the top (number overlay) layer. */
    overlayProps: (row: number, col: number) => Record<string, unknown>;
}

/**
 * Renders the correct Slant board variant based on the current mode:
 * ghost-mode overlay, loading skeleton, or the normal interactive board.
 */
export function SlantBoard({
    isGhostMode,
    generating,
    dimensionsMismatch,
    rows,
    cols,
    state,
    size,
    ghostMoves,
    onGhostMove,
    onGhostCopy,
    onGhostClear,
    onGhostClose,
    cellProps,
    overlayProps,
}: SlantBoardProps): React.ReactElement {
    if (isGhostMode) {
        return (
            <ErrorBoundary
                fallback={
                    <ErrorState message="Ghost mode encountered an error. Close and reopen to continue." />
                }
            >
                <SlantGhostBoard
                    rows={rows}
                    cols={cols}
                    numbers={state.numbers}
                    size={size}
                    initialMoves={ghostMoves}
                    onMove={onGhostMove}
                    onCopy={onGhostCopy}
                    onClear={onGhostClear}
                    onClose={onGhostClose}
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
            <Board
                size={size}
                rows={rows + 1}
                cols={cols + 1}
                cellRows={rows}
                cellCols={cols}
                overlayProps={overlayProps}
                cellProps={cellProps}
                overlayLayerSx={{ pointerEvents: 'none' }}
                overlayDecorative
            />
        </ErrorBoundary>
    );
}
