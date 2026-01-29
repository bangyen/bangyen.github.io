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
    PropsFactory,
} from '../components/Board';
import { getOutput, useHandler as useCalculatorHandler } from './calculator';
import { COLORS } from '../../../config/theme';

function getIconFrames(
    states: number[][][],
    row: number,
    col: number,
    dims: number,
    palette: Palette
): Record<string, { opacity: number; color: string }> {
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
    palette: Palette;
    size: number;
    dims?: number;
    start?: number[];
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

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

    const states = getStates(start, dims);
    const width = size;

    const { boardStates, inputStates, outputStates } = states;
    const remainder = frame % inputStates.length;

    const gridState = {
        grid: boardStates[remainder],
        rows: dims,
        cols: dims,
    };

    const boardGetters = useBoardHandler(gridState, palette);
    const baseFrontProps = getFrontProps(boardGetters);
    const backProps = getBackProps(boardGetters);

    // Icon animation handler
    const getBoardIcon = iconHandler(boardStates, dims, 'board', palette);

    // Merge props to add icons
    const frontProps = (row: number, col: number) => {
        const baseProps = baseFrontProps(row, col);
        const iconProps = getBoardIcon(row, col);
        return {
            ...baseProps,
            ...iconProps,
        };
    };

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
