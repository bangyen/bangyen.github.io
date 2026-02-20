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
    cellProps: (row: number, col: number) => Record<string, unknown>;
    /** Cell factory for the top (number overlay) layer. */
    overlayProps: (row: number, col: number) => Record<string, unknown>;
}

/**
 * Pure layout component that renders the dual-layer configuration for the Slant board.
 */
export function SlantBoard({
    size,
    rows,
    cols,
    cellProps,
    overlayProps,
}: SlantBoardProps): React.ReactElement {
    return (
        <Board
            size={size}
            layers={[
                {
                    rows,
                    cols,
                    cellProps,
                },
                {
                    rows: rows + 1,
                    cols: cols + 1,
                    cellProps: overlayProps,
                    layerSx: { pointerEvents: 'none' },
                    decorative: true,
                },
            ]}
            space={0.125}
        />
    );
}
