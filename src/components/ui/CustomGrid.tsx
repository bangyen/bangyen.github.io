import React, { useCallback, ReactNode } from 'react';
import { Box } from '../mui';
import { getSpace } from '../../features/interpreters/utils/gridUtils';
import { TYPOGRAPHY, ANIMATIONS, COMPONENT_VARIANTS } from '../../config/theme';
import { GRID_CONFIG } from '../../features/interpreters/config/interpretersConfig';

interface CellProps {
    size: number;
    children?: ReactNode;
    backgroundColor?: string;
    color?: string;
    boxShadow?: string;
    border?: string;
    opacity?: number;
    transition?: string | boolean;
    sx?: object;
    [key: string]: unknown;
}

function Cell({ size, children, ...rest }: CellProps) {
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
              : ANIMATIONS.transition;

    const props = {
        ...COMPONENT_VARIANTS.flexCenter,
        borderRadius: radius,
        height: remSize,
        width: remSize,
        fontSize: `${(size * GRID_CONFIG.cellSize.fontSizeMultiplier).toString()}rem`,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        fontFamily: 'monospace',
    };

    return (
        <Box
            {...props}
            {...domProps}
            sx={{
                backgroundColor,
                color,
                boxShadow,
                border,
                opacity,
                transition,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

interface CellOptions {
    children?: ReactNode;
    [key: string]: unknown;
}

interface RowProps {
    cols: number;
    size: number;
    index: number;
    spacing: string;
    cellProps: (row: number, col: number) => CellOptions;
}

function Row({ cols, size, index, spacing, cellProps }: RowProps) {
    const WrappedCell = (_: unknown, j: number) => (
        <Cell
            {...cellProps(index, j)}
            key={`${index.toString()}_${j.toString()}`}
            size={size}
        />
    );

    return (
        <Box
            sx={{
                display: 'flex',
                gap: spacing,
                justifyContent: 'center',
            }}
        >
            {Array.from({ length: cols }, WrappedCell)}
        </Box>
    );
}

interface CustomGridProps {
    size: number;
    rows: number;
    cols: number;
    cellProps: (row: number, col: number) => CellOptions;
    space?: number;
    sx?: object;
    [key: string]: unknown;
}

export function CustomGrid({
    size,
    rows,
    cols,
    cellProps,
    space,
    sx,
    ...rest
}: CustomGridProps) {
    const auto = getSpace(size);
    const actualSpace = space ?? auto;
    const rem = `${actualSpace.toString()}rem`;

    const getRow = useCallback(
        (_: unknown, i: number) => (
            <Row
                index={i}
                cols={cols}
                size={size}
                spacing={rem}
                key={`row_${i.toString()}`}
                cellProps={cellProps}
            />
        ),
        [cols, size, rem, cellProps]
    );

    return (
        <Box
            role="grid"
            aria-label={`Grid with ${rows.toString()} rows and ${cols.toString()} columns`}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: rem,
                ...sx,
            }}
            {...rest}
        >
            {Array.from({ length: rows }, getRow)}
        </Box>
    );
}
