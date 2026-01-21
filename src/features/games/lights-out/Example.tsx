import React from 'react';
import { Typography, Grid, Box } from '../../../components/mui';
import { CircleRounded } from '../../../components/icons';

import { getStates } from './chaseHandlers';
import { flipAdj } from './boardHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';

import { COLORS } from '../../../config/theme';

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
    dims: number,
    palette: Palette
): Record<string, { opacity: number; color: string }> {
    // const newStates = [[], ...states, []]; // Padding to match propHandler timing
    const length = states.length;
    const frames: Record<string, { opacity: number; color: string }> = {};

    for (let k = 0; k < length + 1; k++) {
        const percent = (100 * k) / length;
        const floor = Math.floor(percent);

        let opacity = 0;
        let color = palette.secondary; // Default

        const currentState = k > 0 && k <= length ? states[k - 1] : null;
        const nextState = k > 0 && k < length ? states[k] : null;

        if (currentState && nextState) {
            // Predict if clicking (row, col) results in nextState
            const predicted = flipAdj(row, col, currentState);

            // Compare predicted with nextState
            let match = true;
            loop: for (let r = 0; r < dims; r++) {
                for (let c = 0; c < dims; c++) {
                    if (predicted[r][c] !== nextState[r][c]) {
                        match = false;
                        break loop;
                    }
                }
            }

            if (match) {
                opacity = 1;
                // Inverse of background color
                // If cell is 1 (ON), bg is primary, icon is secondary
                // If cell is 0 (OFF), bg is secondary, icon is primary
                const isOne = currentState[row][col] === 1;
                color = isOne ? palette.secondary : palette.primary;
            }
        }

        frames[`${floor}%`] = { opacity, color };
    }

    return frames;
}

function iconHandler(
    states: number[][][],
    dims: number,
    id: string,
    palette: Palette
) {
    return (row: number, col: number): Record<string, unknown> => {
        const frames = getIconFrames(states, row, col, dims, palette);
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        [index]: frames,
                        animation,
                    }}
                >
                    <CircleRounded sx={{ fontSize: 'inherit' }} />
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

// Helper functions removed as we pass states directly

export default function Example({
    start = [],
    dims = 3,
    size,
    palette,
}: ExampleProps): React.ReactElement {
    const states = getStates(start as number[], dims);
    const width = size;

    const { boardStates, inputStates, outputStates } = states;

    const getGrid = (s: unknown[], r: number, c: number) => {
        const states = s as number[][][];
        return states.map(state => state[r][c]);
    };
    const getRow = (s: unknown[], r: number, c: number) => {
        const states = s as number[][];
        return states.map(state => state[c]);
    };

    const getBoardBg = propHandler(
        boardStates as unknown[],
        getGrid,
        palette,
        'board'
    );

    // Icon animation handler
    const getBoardIcon = iconHandler(boardStates, dims, 'board', palette);

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
        inputStates as unknown[],
        getRow,
        palette,
        'input'
    );
    const getOutput = propHandler(
        outputStates as unknown[],
        getRow,
        palette,
        'output'
    );

    return (
        <Grid container size={12} spacing={2} sx={{ height: '100%' }}>
            <Grid
                container
                size={12}
                wrap="nowrap"
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: '100%',
                }}
            >
                <Grid
                    size={6}
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
                    size={6}
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
