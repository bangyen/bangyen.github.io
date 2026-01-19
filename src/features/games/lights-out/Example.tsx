import React from 'react';
import { Typography, Grid, Box } from '../../../components/mui';
import { CircleRounded } from '../../../components/icons';

import { getStates } from './chaseHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { useMobile } from '../../../hooks';
import { TYPOGRAPHY, COLORS } from '../../../config/theme';

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

function getIconFrames(
    states: number[][][],
    row: number,
    col: number,
    dims: number
): Record<string, { opacity: number }> {
    const newStates = [[], ...states, []]; // Padding to match propHandler timing
    const length = states.length;
    const frames: Record<string, { opacity: number }> = {};

    for (let k = 0; k < length + 1; k++) {
        const percent = (100 * k) / length;
        const floor = Math.floor(percent);

        // Logic: Is (row, col) the next move for state[k]?
        // Timeline:
        // k=0: newStates[0] is [], dummy.
        // k=1: newStates[1] is states[0]. We show states[0]. Next move depends on states[0].
        // ...

        // We need to align with propHandler.
        // propHandler uses: [-1, ...states, -1].
        // k=0: -1.
        // k=1: states[0].

        let opacity = 0;
        const currentState = k > 0 && k <= length ? states[k - 1] : null;

        if (currentState && row > 0) {
            // Find the first required move for this state
            let targetR = -1;
            let targetC = -1;

            // Scan row r-1 for lights
            outer: for (let r = 1; r < dims; r++) {
                for (let c = 0; c < dims; c++) {
                    if (currentState[r - 1][c] === 1) {
                        targetR = r;
                        targetC = c;
                        break outer;
                    }
                }
            }

            if (row === targetR && col === targetC) {
                opacity = 1;
            }
        }

        frames[`${floor}%`] = { opacity };
    }

    return frames;
}

function iconHandler(states: number[][][], dims: number, id: string) {
    return (row: number, col: number): Record<string, unknown> => {
        const frames = getIconFrames(states, row, col, dims);
        const length = states.length;

        const name = `${id}-icon-${row}-${col}`;
        const index = `@keyframes ${name}`;

        const animation = `
            ${name}
            ${length * 2}s
            steps(1, start)
            infinite
        `;

        return {
            children: (
                <Box
                    sx={{
                        color: 'rgba(255,255,255,0.7)', // Highlight color
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        [index]: frames,
                        animation,
                    }}
                >
                    <CircleRounded sx={{ fontSize: '60%' }} />
                </Box>
            ),
        };
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
    return Array.from({ length: dims }, (_, i) => i);
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

    const getBoardBg = propHandler(
        boardTiles as unknown[],
        getGrid,
        palette,
        'board'
    );

    // Icon animation handler
    const getBoardIcon = iconHandler(boardStates, dims, 'board');

    // Merge props
    const getBoard = (r: number, c: number) => {
        const bgProps = getBoardBg(r, c);
        const iconProps = getBoardIcon(r, c);
        return {
            ...bgProps,
            ...iconProps,
        };
    };

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
        <Grid container size={12} spacing={2} sx={{ height: '100%' }}>
            <Grid
                container
                size={12}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <CustomGrid
                        size={width}
                        rows={dims}
                        cols={dims}
                        cellProps={getBoard}
                        space={0}
                    />
                </Grid>
                <Grid
                    container
                    size={{ xs: 12, md: 6 }}
                    spacing={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, color: COLORS.text.secondary }}
                        >
                            Input
                        </Typography>
                        <CustomGrid
                            rows={1}
                            cols={dims}
                            size={width}
                            cellProps={getInput}
                            space={0}
                        />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <CustomGrid
                            rows={1}
                            cols={dims}
                            size={width}
                            cellProps={getOutput}
                            space={0}
                        />
                        <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, color: COLORS.text.secondary }}
                        >
                            Result
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}
