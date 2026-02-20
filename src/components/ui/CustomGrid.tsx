import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React, { useMemo, memo } from 'react';

import {
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
    GRID_CONFIG,
    getSpace,
} from '@/config/theme';
import { spreadSx } from '@/utils/muiUtils';

/** Known styling props extracted by `Cell`; additional DOM attributes are forwarded. */
interface CellKnownProps {
    size: number;
    children?: React.ReactNode;
    backgroundColor?: string;
    color?: string;
    boxShadow?: string;
    border?: string;
    opacity?: number;
    transition?: string | boolean;
    sx?: SxProps<Theme>;
}

/** Full prop type for a single grid cell, including passthrough DOM attributes. */
export type CellProps = CellKnownProps & Record<string, unknown>;

const Cell = memo(function Cell({ size, children, ...rest }: CellProps) {
    const remSize = `${size.toString()}rem`;
    const radius = `${(size / GRID_CONFIG.cellSize.divisor).toString()}rem`;

    const {
        backgroundColor,
        color,
        boxShadow,
        border,
        opacity,
        transition: transitionProp = true,
        sx,
        ...domProps
    } = rest;

    const transition =
        transitionProp === false
            ? 'none'
            : typeof transitionProp === 'string'
              ? transitionProp
              : 'background-color 200ms ease, color 200ms ease, opacity 200ms ease, transform 200ms ease, border-radius 200ms ease';

    const props = useMemo(
        () => ({
            ...COMPONENT_VARIANTS.flexCenter,
            borderRadius: radius,
            height: remSize,
            width: remSize,
            fontSize: `${(size * GRID_CONFIG.cellSize.fontSizeMultiplier).toString()}rem`,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            fontFamily: 'monospace',
        }),
        [radius, remSize, size],
    );

    return (
        <Box
            role="gridcell"
            {...props}
            {...domProps}
            sx={{
                '--cell-radius': radius,
                backgroundColor,
                color,
                boxShadow,
                border,
                opacity,
                transition,
                ...spreadSx(sx),
            }}
        >
            {children}
        </Box>
    );
});

interface CellOptions {
    children?: React.ReactNode;
    [key: string]: unknown;
}

export interface RowProps {
    cols: number;
    size: number;
    index: number;
    spacing: string;
    cellProps?: (row: number, col: number) => CellOptions;
    renderCell?: (row: number, col: number) => React.ReactNode;
}

const Row = memo(function Row({
    cols,
    size,
    index,
    spacing,
    cellProps,
    renderCell,
}: RowProps) {
    return (
        <Box
            role="row"
            sx={{
                display: 'flex',
                gap: spacing,
                justifyContent: 'center',
            }}
        >
            {Array.from({ length: cols }, (_, j) => {
                if (renderCell) {
                    return (
                        <Cell
                            key={`${index.toString()}_${j.toString()}`}
                            size={size}
                        >
                            {renderCell(index, j)}
                        </Cell>
                    );
                }
                const props = cellProps ? cellProps(index, j) : {};
                return (
                    <Cell
                        {...props}
                        key={`${index.toString()}_${j.toString()}`}
                        size={size}
                    />
                );
            })}
        </Box>
    );
});

/** Known props for the grid container; additional DOM attributes are forwarded to the root `Box`. */
interface CustomGridKnownProps {
    size: number;
    rows: number;
    cols: number;
    cellProps?: (row: number, col: number) => CellOptions;
    renderCell?: (row: number, col: number) => React.ReactNode;
    space?: number;
    sx?: SxProps<Theme>;
}

/** Full prop type for `CustomGrid`, including passthrough DOM attributes. */
export type CustomGridProps = CustomGridKnownProps & Record<string, unknown>;

export const CustomGrid = memo(function CustomGrid({
    size,
    rows,
    cols,
    cellProps,
    renderCell,
    space,
    sx,
    ...rest
}: CustomGridProps) {
    const auto = getSpace(size);
    const actualSpace = space ?? auto;
    const rem = `${actualSpace.toString()}rem`;

    return (
        <Box
            role="grid"
            aria-label={`Grid with ${rows.toString()} rows and ${cols.toString()} columns`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: rem,
                ...spreadSx(sx),
            }}
            {...rest}
        >
            {Array.from({ length: rows }, (_, i) => (
                <Row
                    index={i}
                    cols={cols}
                    size={size}
                    spacing={rem}
                    key={`row_${i.toString()}`}
                    cellProps={cellProps}
                    renderCell={renderCell}
                />
            ))}
        </Box>
    );
});
