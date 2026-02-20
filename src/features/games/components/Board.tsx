import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { BoardContainer, LayerContainer } from './Board.styles';

import { CustomGrid } from '@/components/ui/CustomGrid';

export interface BoardLayer {
    /** Factory function for cell props in this layer. */
    cellProps?: (row: number, col: number) => Record<string, unknown>;
    /** Factory function for cell rendering. */
    renderCell?: (row: number, col: number) => React.ReactNode;
    /** Number of rows in this layer. */
    rows: number;
    /** Number of cols in this layer. */
    cols: number;
    /** Optional styles for the layer container. */
    layerSx?: SxProps<Theme>;
    /** When true, marks the layer as decorative (aria-hidden). */
    decorative?: boolean;
}

export interface BoardProps {
    /** Array of grid layers to render, from bottom to top order. */
    layers: BoardLayer[];
    /** Cell size in rem units. */
    size: number;
    /** Gap between cells in rem units. Defaults to 0. */
    space?: number;
}

/**
 * Multi-layer stacked grid used by game boards.
 *
 * Each layer can define its own dimensions, allowing overlapping
 * grids of different sizes (e.g. vertices vs faces). Layers are
 * rendered in the order provided (first element is the bottom layer).
 *
 * Memoised so that parent re-renders caused by game-state dispatch
 * (e.g. cell toggles) skip a full NxN grid reconciliation when the
 * board's own props have not changed.
 */
export const Board = React.memo(function Board(
    props: BoardProps,
): React.ReactElement {
    const { layers, size, space = 0 } = props;

    return (
        <BoardContainer
            onContextMenu={e => {
                e.preventDefault();
            }}
        >
            {layers.map((layer, index) => (
                <LayerContainer
                    key={`layer-${String(index)}`}
                    isOverlay={index !== 0}
                    sx={layer.layerSx}
                >
                    <CustomGrid
                        space={space}
                        size={size}
                        rows={layer.rows}
                        cols={layer.cols}
                        cellProps={layer.cellProps}
                        renderCell={layer.renderCell}
                        {...(layer.decorative
                            ? { role: 'presentation', 'aria-hidden': true }
                            : {})}
                    />
                </LayerContainer>
            ))}
        </BoardContainer>
    );
});
