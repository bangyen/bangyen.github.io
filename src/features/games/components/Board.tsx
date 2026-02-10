import React from 'react';

import { Box } from '@/components/mui';
import { CustomGrid } from '@/components/ui/CustomGrid';
import { LAYOUT } from '@/config/theme';

export interface BoardProps {
    frontProps: (row: number, col: number) => Record<string, unknown>;
    backProps: (row: number, col: number) => Record<string, unknown>;
    size: number;
    rows: number;
    cols: number;
    frontLayerSx?: object;
    backLayerSx?: object;
}

export interface Palette {
    primary: string;
    secondary: string;
}

export interface Getters {
    getColor: (row: number, col: number) => { front: string; back: string };
    getBorder: (row: number, col: number) => React.CSSProperties;
    getFiller: (row: number, col: number) => string;
}

export interface CellProps {
    children?: React.ReactNode;
    sx?: object;
    [key: string]: unknown;
}

export type PropsFactory = (
    getters: Getters
) => (row: number, col: number) => CellProps;

export function Board(props: BoardProps): React.ReactElement {
    const {
        frontProps,
        backProps,
        size,
        rows,
        cols,
        frontLayerSx,
        backLayerSx,
    } = props;

    const isFrontDecorative =
        frontLayerSx &&
        'pointerEvents' in frontLayerSx &&
        frontLayerSx.pointerEvents === 'none';
    const isBackDecorative =
        backLayerSx &&
        'pointerEvents' in backLayerSx &&
        backLayerSx.pointerEvents === 'none';

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
                    ...backLayerSx,
                }}
            >
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows - 1}
                    cols={cols - 1}
                    cellProps={backProps}
                    {...(isBackDecorative
                        ? { role: 'presentation', 'aria-hidden': true }
                        : {})}
                />
            </Box>
            <Box
                sx={{
                    gridArea: '1/1',
                    zIndex: LAYOUT.zIndex.base + 1,
                    ...frontLayerSx,
                }}
            >
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={frontProps}
                    {...(isFrontDecorative
                        ? { role: 'presentation', 'aria-hidden': true }
                        : {})}
                />
            </Box>
        </Box>
    );
}
