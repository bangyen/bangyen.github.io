import React, { useCallback, ReactNode } from 'react';
import { Box, Grid } from '../mui';
import { getSpace } from '../../utils/calculate';
import { CELL_SIZE } from '../../config/constants';
import { TYPOGRAPHY, ANIMATIONS, COMPONENT_VARIANTS } from '../../config/theme';

interface CellProps {
    size: number;
    children: ReactNode;
    [key: string]: any;
}

function Cell({ size, children, ...rest }: CellProps) {
    const remSize = `${size}rem`;
    const radius = `${size / CELL_SIZE.divisor}rem`;

    const props = {
        ...COMPONENT_VARIANTS.flexCenter,
        borderRadius: radius,
        height: remSize,
        width: remSize,
        fontSize: `${size * CELL_SIZE.fontSizeMultiplier}rem`,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        fontFamily: 'monospace',
        transition: ANIMATIONS.transition,
    };

    const combined = {
        ...props,
        ...rest,
    };

    return <Box {...combined}>{children}</Box>;
}

interface RowProps {
    cols: number;
    size: number;
    index: number;
    spacing: string;
    cellProps: (row: number, col: number) => any;
}

function Row({ cols, size, index, spacing, cellProps }: RowProps) {
    const WrappedCell = (_: any, j: number) => (
        <Cell {...cellProps(index, j)} key={`${index}_${j}`} size={size} />
    );

    return (
        <Grid container size={12} spacing={spacing} justifyContent="center">
            {Array.from({ length: cols }, WrappedCell)}
        </Grid>
    );
}

interface CustomGridProps {
    size: number;
    rows: number;
    cols: number;
    cellProps: (row: number, col: number) => any;
    space?: number;
    [key: string]: any;
}

export function CustomGrid({
    size,
    rows,
    cols,
    cellProps,
    ...rest
}: CustomGridProps) {
    const auto = getSpace(size);
    const { space = auto } = rest;
    const rem = `${space}rem`;

    const getRow = useCallback(
        (_: any, i: number) => (
            <Row
                index={i}
                cols={cols}
                size={size}
                spacing={rem}
                key={`row_${i}`}
                cellProps={cellProps}
            />
        ),
        [cols, size, rem, cellProps]
    );

    return (
        <Grid
            container
            size={12}
            spacing={rem}
            alignItems="center"
            role="grid"
            aria-label={`Grid with ${rows} rows and ${cols} columns`}
            {...rest}
        >
            {Array.from({ length: rows }, getRow)}
        </Grid>
    );
}
