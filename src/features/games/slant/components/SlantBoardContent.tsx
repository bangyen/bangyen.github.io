import React from 'react';

import { GhostCanvas } from './GhostCanvas';
import { SlantLoadingSkeleton } from './SlantLoadingSkeleton';
import { Board } from '../../components/Board';
import type { CellState, SlantState } from '../types';

interface SlantBoardContentProps {
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
export function SlantBoardContent({
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
}: SlantBoardContentProps): React.ReactElement {
    if (isGhostMode) {
        return (
            <GhostCanvas
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
        );
    }

    if (generating || dimensionsMismatch) {
        return <SlantLoadingSkeleton size={size} rows={rows} cols={cols} />;
    }

    return (
        <Board
            size={size}
            rows={rows + 1}
            cols={cols + 1}
            overlayProps={overlayProps}
            cellProps={cellProps}
            overlayLayerSx={{ pointerEvents: 'none' }}
        />
    );
}
