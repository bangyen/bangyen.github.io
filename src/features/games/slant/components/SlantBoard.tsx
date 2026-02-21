import React, { useMemo } from 'react';

import { Board } from '../../components/Board';
import type { SlantState } from '../types';
import { SlantSlashCell, SlantHintCell } from '../utils/renderers';

export interface SlantBoardProps {
    /** Current Slant game state. */
    state?: SlantState;
    /** Cell size in rem units. */
    size: number;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
    /** Optional component to use for cells in the slash layer. Defaults to SlantSlashCell. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CellComponent?: React.ComponentType<any>;
    /** Optional component to use for cells in the hint layer. Defaults to SlantHintCell. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    OverlayComponent?: React.ComponentType<any>;
    /** Cell factory for the bottom (interactive slash cell) layer. */
    cellProps?: (row: number, col: number) => Record<string, unknown>;
    /** Cell renderer for the bottom (interactive slash cell) layer. */
    renderCell?: (row: number, col: number) => React.ReactNode;
    /** Cell factory for the top (number overlay) layer. */
    overlayProps?: (row: number, col: number) => Record<string, unknown>;
    /** Cell renderer for the top (number overlay) layer. */
    renderOverlay?: (row: number, col: number) => React.ReactNode;
}

/**
 * Pure layout component that renders the dual-layer configuration for the Slant board.
 */
export function SlantBoard({
    state,
    size,
    rows,
    cols,
    CellComponent = SlantSlashCell,
    OverlayComponent = SlantHintCell,
    cellProps,
    renderCell,
    overlayProps,
    renderOverlay,
}: SlantBoardProps): React.ReactElement {
    const layers = useMemo(
        () => [
            {
                rows,
                cols,
                cellProps: (r: number, c: number) => ({
                    state,
                    size,
                    isInteractive: true,
                    row: r,
                    col: c,
                    ...cellProps?.(r, c),
                }),
                renderCell,
                CellComponent,
            },
            {
                rows: rows + 1,
                cols: cols + 1,
                cellProps: (r: number, c: number) => ({
                    state,
                    size,
                    row: r,
                    col: c,
                    ...overlayProps?.(r, c),
                }),
                renderCell: renderOverlay,
                CellComponent: OverlayComponent,
                layerSx: { pointerEvents: 'none' },
                decorative: true,
            },
        ],
        [
            state,
            size,
            rows,
            cols,
            CellComponent,
            OverlayComponent,
            cellProps,
            renderCell,
            overlayProps,
            renderOverlay,
        ],
    );

    return <Board size={size} layers={layers} space={0.125} />;
}
