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
    rows: number;
    cols: number;
    overlayLayerSx?: object;
    cellLayerSx?: object;
}

export function Board(props: BoardProps): React.ReactElement {
    const {
        overlayProps,
        cellProps,
        size,
        rows,
        cols,
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
                    rows={rows - 1}
                    cols={cols - 1}
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
