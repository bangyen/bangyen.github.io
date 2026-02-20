import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

import {
    boardContainerSx,
    cellLayerBaseSx,
    overlayLayerBaseSx,
} from './Board.styles';

import { CustomGrid } from '@/components/ui/CustomGrid';
import { spreadSx } from '@/utils/muiUtils';

export interface BoardLayer {
    /** Factory function for cell props in this layer. */
    cellProps: (row: number, col: number) => Record<string, unknown>;
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
        <Box
            sx={boardContainerSx}
            onContextMenu={e => {
                e.preventDefault();
            }}
        >
            {layers.map((layer, index) => (
                <Box
                    key={`layer-${String(index)}`}
                    sx={{
                        ...spreadSx(
                            index === 0 ? cellLayerBaseSx : overlayLayerBaseSx,
                        ),
                        ...spreadSx(layer.layerSx),
                    }}
                >
                    <CustomGrid
                        space={space}
                        size={size}
                        rows={layer.rows}
                        cols={layer.cols}
                        cellProps={layer.cellProps}
                        {...(layer.decorative
                            ? { role: 'presentation', 'aria-hidden': true }
                            : {})}
                    />
                </Box>
            ))}
        </Box>
    );
});
