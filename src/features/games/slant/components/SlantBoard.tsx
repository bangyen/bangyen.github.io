import React from 'react';

import { Board } from '../../components/Board';

export interface SlantBoardProps {
    /** Cell size in rem units. */
    size: number;
    /** Current grid row count. */
    rows: number;
    /** Current grid column count. */
    cols: number;
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
    size,
    rows,
    cols,
    cellProps,
    renderCell,
    overlayProps,
    renderOverlay,
}: SlantBoardProps): React.ReactElement {
    return (
        <Board
            size={size}
            layers={[
                {
                    rows,
                    cols,
                    cellProps,
                    renderCell,
                },
                {
                    rows: rows + 1,
                    cols: cols + 1,
                    cellProps: overlayProps,
                    renderCell: renderOverlay,
                    layerSx: { pointerEvents: 'none' },
                    decorative: true,
                },
            ]}
            space={0.125}
        />
    );
}
