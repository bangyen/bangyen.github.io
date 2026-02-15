import { Box } from '@mui/material';
import React from 'react';

import { CustomGrid } from '@/components/ui/CustomGrid';
import { LAYOUT } from '@/config/theme';

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
    overlayLayerSx?: object;
    cellLayerSx?: object;
}

/**
 * Two-layer stacked grid used by all game boards.
 *
 * Both layers default to the same dimensions (`rows` x `cols`).
 * Pass `cellRows` / `cellCols` when the bottom layer should be a
 * different size (e.g. a dual grid where vertices and faces differ).
 */
export function Board(props: BoardProps): React.ReactElement {
    const {
        overlayProps,
        cellProps,
        size,
        rows,
        cols,
        cellRows = rows,
        cellCols = cols,
        overlayLayerSx,
        cellLayerSx,
    } = props;

    const isOverlayDecorative =
        overlayLayerSx &&
        'pointerEvents' in overlayLayerSx &&
        overlayLayerSx.pointerEvents === 'none';
    const isCellDecorative =
        cellLayerSx &&
        'pointerEvents' in cellLayerSx &&
        cellLayerSx.pointerEvents === 'none';

    return (
        <Box
            sx={{
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <Box
                sx={{
                    gridArea: '1/1',
                    ...cellLayerSx,
                }}
            >
                <CustomGrid
                    space={0}
                    size={size}
                    rows={cellRows}
                    cols={cellCols}
                    cellProps={cellProps}
                    {...(isCellDecorative
                        ? { role: 'presentation', 'aria-hidden': true }
                        : {})}
                />
            </Box>
            <Box
                sx={{
                    gridArea: '1/1',
                    zIndex: LAYOUT.zIndex.base + 1,
                    ...overlayLayerSx,
                }}
            >
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={overlayProps}
                    {...(isOverlayDecorative
                        ? { role: 'presentation', 'aria-hidden': true }
                        : {})}
                />
            </Box>
        </Box>
    );
}
