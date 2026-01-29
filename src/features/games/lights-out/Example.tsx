import React, { useState, useEffect } from 'react';
import { Typography, Grid, Box } from '../../../components/mui';
import { CircleRounded } from '../../../components/icons';

import { getStates } from './chaseHandlers';
import { flipAdj } from './boardHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';

import {
    useHandler as useBoardHandler,
    Board,
    Palette,
} from '../components/Board';
import { getOutput, useHandler as useCalculatorHandler } from './calculator';
import { COLORS } from '../../../config/theme';

interface Getters {
    getColor: (row: number, col: number) => { front: string; back: string };
    getBorder: (row: number, col: number) => React.CSSProperties;
    getFiller: (row: number, col: number) => string;
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
    getFrontProps: (
        getters: Getters
    ) => (row: number, col: number) => Record<string, unknown>;
    getBackProps: (
        getters: Getters
    ) => (row: number, col: number) => Record<string, unknown>;
}

// Helper functions removed as we pass states directly

export default function Example({
    start = [],
    dims = 3,
    size,
    palette,
    getFrontProps,
    getBackProps,
}: ExampleProps): React.ReactElement {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame(prev => prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const states = getStates(start as number[], dims);
    const width = size;

    const { boardStates, inputStates, outputStates } = states;
    const remainder = frame % inputStates.length;

    const gridState = {
        grid: boardStates[remainder],
        rows: dims,
        cols: dims,
    };

    const boardGetters = useBoardHandler(gridState, palette);
    const frontProps = getFrontProps(boardGetters);
    const backProps = getBackProps(boardGetters);

    const inputGetters = useCalculatorHandler(
        inputStates[remainder],
        dims,
        palette
    );
    const outputGetters = useCalculatorHandler(
        outputStates[remainder],
        dims,
        palette
    );
    const inputProps = getOutput(inputGetters);
    const outputProps = getOutput(outputGetters);

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
                    <Board
                        size={width}
                        rows={dims}
                        cols={dims}
                        frontProps={frontProps}
                        backProps={backProps}
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
                            cellProps={inputProps}
                            space={0}
                        />
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <CustomGrid
                            rows={1}
                            cols={dims}
                            size={width}
                            cellProps={outputProps}
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
