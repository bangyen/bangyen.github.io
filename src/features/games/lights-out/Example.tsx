import React from 'react';
import { Typography, Grid } from '../../../components/mui';

import { getStates } from './chaseHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { useMobile } from '../../../hooks';
import { TYPOGRAPHY } from '../../../config/theme';

interface Frame {
    backgroundColor: string;
}

interface Palette {
    primary: string;
    secondary: string;
}

function getFrames(states: unknown[], palette: Palette): Record<string, Frame> {
    const newStates = [-1, ...states, -1];
    const length = states.length;
    const frames: Record<string, Frame> = {};

    for (let k = 0; k < length + 1; k++) {
        const state = newStates[k];
        const next = newStates[k + 1];

        const value = (state as number) + 1 ? state : next;
        const color = value ? palette.primary : palette.secondary;

        const percent = (100 * k) / length;
        const floor = Math.floor(percent);

        frames[`${floor}%`] = {
            backgroundColor: color,
        };
    }

    return frames;
}

function propHandler(
    states: unknown[],
    getter: (states: unknown[], row: number, col: number) => unknown[],
    palette: Palette,
    id: string
) {
    return (row: number, col: number): Record<string, unknown> => {
        const state = getter(states, row, col);
        const frames = getFrames(state as unknown[], palette);
        const length = states.length;

        const name = `${id}-${row}-${col}`;
        const index = `@keyframes ${name}`;

        const animation = `
            ${name}
            ${length * 2}s
            steps(1, start)
            infinite
        `;

        const style: Record<string, unknown> = {
            [index]: frames,
            animation,
        };

        return { sx: style };
    };
}

interface ExampleProps {
    states?: unknown[];
    getter?: (states: unknown[], row: number, col: number) => unknown[];
    palette: Palette;
    id?: string;
    rows?: number;
    cols?: number;
    size: number;
    dims?: number;
    start?: unknown[];
}

function getRange(dims: number): number[] {
    const keys = Array(dims).keys();
    return [...keys];
}

function gridTiles(states: number[][][], dims: number): number[][][] {
    const length = states.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    return dRange.map(r => dRange.map(c => lRange.map(k => states[k][r][c])));
}

function rowTiles(states: number[][], dims: number): number[][] {
    const length = states.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    return dRange.map(r => lRange.map(k => states[k][r]));
}

function Bifold({ children }: { children: React.ReactNode }) {
    return <Grid size={6}>{children}</Grid>;
}

function Title({ children }: { children: React.ReactNode }) {
    return (
        <Bifold>
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'center',
                    fontWeight: 'semibold',
                    fontSize: TYPOGRAPHY.fontSize.body,
                    lineHeight: '1.2',
                    letterSpacing: '-0.025em',
                }}
            >
                {children}
            </Typography>
        </Bifold>
    );
}

export default function Example({
    start = [],
    dims = 3,
    size,
    palette,
}: ExampleProps): React.ReactElement {
    const mobile = useMobile('lg');
    const states = getStates(start as number[], dims);
    const width = mobile ? size / 2 : size;

    const { boardStates, inputStates, outputStates } = states;

    const boardTiles = gridTiles(boardStates, dims);
    const inputTiles = rowTiles(inputStates, dims);
    const outputTiles = rowTiles(outputStates, dims);

    const getGrid = (s: unknown[], r: number, c: number) => {
        const states = s as number[][][];
        return states.map(state => state[r][c]);
    };
    const getRow = (s: unknown[], r: number, c: number) => {
        const states = s as number[][];
        return states.map(state => state[c]);
    };

    const getBoard = propHandler(
        boardTiles as unknown[],
        getGrid,
        palette,
        'board'
    );
    const getInput = propHandler(
        inputTiles as unknown[],
        getRow,
        palette,
        'input'
    );
    const getOutput = propHandler(
        outputTiles as unknown[],
        getRow,
        palette,
        'output'
    );

    return (
        <Grid container size={12} spacing={4}>
            <Grid container size={12}>
                <Bifold>
                    <CustomGrid
                        size={width}
                        rows={dims}
                        cols={dims}
                        cellProps={getBoard}
                    />
                </Bifold>
                <Grid container size={6}>
                    <CustomGrid
                        rows={1}
                        cols={dims}
                        size={width}
                        cellProps={getInput}
                    />
                    <CustomGrid
                        rows={1}
                        cols={dims}
                        size={width}
                        cellProps={getOutput}
                    />
                </Grid>
            </Grid>
            <Grid container size={12}>
                <Title>Animation Demo</Title>
                <Title>Pattern Input</Title>
            </Grid>
        </Grid>
    );
}
