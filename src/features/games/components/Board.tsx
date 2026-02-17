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

export interface BoardProps {
    /** Cell factory for the top layer (higher z-index). */
    overlayProps: (row: number, col: number) => Record<string, unknown>;
    /** Cell factory for the bottom layer (base). */
    cellProps: (row: number, col: number) => Record<string, unknown>;
    size: number;
    /** Rows for the overlay (top) layer. */
    rows: number;
    /** Cols for the overlay (top) layer. */
    cols: number;
    /** Rows for the cell (bottom) layer. Defaults to `rows` (same as overlay). */
    cellRows?: number;
    /** Cols for the cell (bottom) layer. Defaults to `cols` (same as overlay). */
    cellCols?: number;
    /** Gap between cells in rem units. Defaults to 0. */
    space?: number;
    overlayLayerSx?: SxProps<Theme>;
    cellLayerSx?: SxProps<Theme>;
    /** When true, marks the overlay layer as decorative (aria-hidden). */
    overlayDecorative?: boolean;
    /** When true, marks the cell layer as decorative (aria-hidden). */
    cellDecorative?: boolean;
}

/**
 * Two-layer stacked grid used by all game boards.
 *
 * Both layers default to the same dimensions (`rows` x `cols`).
 * Pass `cellRows` / `cellCols` when the bottom layer should be a
 * different size (e.g. a dual grid where vertices and faces differ).
 *
 * Memoised so that parent re-renders caused by game-state dispatch
 * (e.g. cell toggles) skip a full NxN grid reconciliation when the
 * board's own props have not changed.
 */
export const Board = React.memo(function Board(
    props: BoardProps,
): React.ReactElement {
    const {
        overlayProps,
        cellProps,
        size,
        rows,
        cols,
        cellRows = rows,
        cellCols = cols,
        space = 0,
        overlayLayerSx,
        cellLayerSx,
        overlayDecorative = false,
        cellDecorative = false,
    } = props;

    return (
        <Box sx={boardContainerSx}>
            <Box
                sx={{
                    ...spreadSx(cellLayerBaseSx),
                    ...spreadSx(cellLayerSx),
                }}
            >
                <CustomGrid
                    space={space}
                    size={size}
                    rows={cellRows}
                    cols={cellCols}
                    cellProps={cellProps}
                    {...(cellDecorative
                        ? { role: 'presentation', 'aria-hidden': true }
                        : {})}
                />
            </Box>
            <Box
                sx={{
                    ...spreadSx(overlayLayerBaseSx),
                    ...spreadSx(overlayLayerSx),
                }}
            >
                <CustomGrid
                    space={space}
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={overlayProps}
                    {...(overlayDecorative
                        ? { role: 'presentation', 'aria-hidden': true }
                        : {})}
                />
            </Box>
        </Box>
    );
});
