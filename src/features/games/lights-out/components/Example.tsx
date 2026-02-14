import { Typography, Grid, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { GridWithKeyframes } from './AnimatedGrid';
import { getOutput, useHandler as useCalculatorHandler } from './Calculator';
import type { Palette, PropsFactory } from '../../components/Board';
import { Board } from '../../components/Board';
import { LIGHTS_OUT_STYLES } from '../constants';
import { useHandler as useBoardHandler } from '../hooks/boardUtils';
import {
    getBoardIconFrames,
    getInputIconFrames,
} from '../utils/animationFrames';
import { getStates } from '../utils/chaseHandlers';

import { EmojiEventsRounded } from '@/components/icons';
import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS } from '@/config/theme';
import { useMobile } from '@/hooks';

/**
 * Creates icon handler for board cells
 * Returns a function that generates icon props for each cell
 */
function iconHandler(
    states: number[][],
    dims: number,
    id: string,
    palette: Palette,
) {
    return (row: number, col: number): Record<string, unknown> => {
        const frames = getBoardIconFrames(states, row, col, dims, palette);
        const length = states.length;

        const name = `${id}-board-icon-${String(row)}-${String(col)}`;

        return {
            icon: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 2,
                        '&::after': {
                            content: '""',
                            fontSize: { xs: '0.8rem', sm: '1.2rem' },
                            fontWeight: 'bold',
                            filter: LIGHTS_OUT_STYLES.SHADOWS.DROP,
                            paddingTop: { xs: '0.08rem', sm: '0.15rem' },
                            animation: `${name} ${String(length * 2)}s linear infinite`,
                        },
                    }}
                />
            ),
            keyframes: frames,
            keyframeName: name,
        };
    };
}

/**
 * Creates icon handler for input row cells
 * Returns a function that generates icon props for each input cell
 */
function inputIconHandler(
    states: number[][],
    dims: number,
    id: string,
    palette: Palette,
) {
    return (row: number, col: number): Record<string, unknown> => {
        const frames = getInputIconFrames(states, col, palette);
        const length = states.length;

        const name = `${id}-input-icon-${String(row)}-${String(col)}`;

        return {
            icon: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        zIndex: 2,
                        '&::after': {
                            content: '""',
                            fontSize: { xs: '0.8rem', sm: '1.2rem' },
                            fontWeight: 'bold',
                            filter: LIGHTS_OUT_STYLES.SHADOWS.DROP,
                            paddingTop: { xs: '0.08rem', sm: '0.15rem' },
                            animation: `${name} ${String(length * 2)}s linear infinite`,
                        },
                    }}
                />
            ),
            keyframes: frames,
            keyframeName: name,
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

        return () => {
            clearInterval(interval);
        };
    }, []);

    const states = getStates(start, dims);
    const width = size;

    const { boardStates, inputStates, outputStates } = states;
    const remainder = frame % inputStates.length;
    const isSolved = remainder === inputStates.length - 1;

    const gridState = {
        grid: boardStates[remainder] ?? boardStates[0] ?? [],
        rows: dims,
        cols: dims,
    };

    const boardGetters = useBoardHandler(gridState, palette);
    const baseFrontProps = getFrontProps(boardGetters);
    const backProps = getBackProps(boardGetters);

    // Icon animation handler
    const getBoardIcon = iconHandler(boardStates, dims, 'example', palette);

    // Merge props to add icons
    const frontProps = (row: number, col: number) => {
        const baseProps = baseFrontProps(row, col);
        const iconProps = getBoardIcon(row, col) as {
            icon: React.ReactNode;
            keyframeName: string;
            keyframes: Record<string, unknown>;
        };
        return {
            ...baseProps,
            children: (
                <>
                    {baseProps.children}
                    {iconProps.icon}
                </>
            ),
            sx: {
                ...baseProps.sx,
                position: 'relative',
            },
        };
    };

    const inputGetters = useCalculatorHandler(
        inputStates[remainder] ?? [],
        dims,
        palette,
    );
    const outputGetters = useCalculatorHandler(
        outputStates[remainder] ?? [],
        dims,
        palette,
    );
    const baseInputProps = getOutput(inputGetters);
    const outputProps = getOutput(outputGetters);

    // Icon animation handler for input row
    const getInputIcon = inputIconHandler(
        inputStates,
        dims,
        'example',
        palette,
    );

    // Merge props to add icons to input
    const inputProps = (row: number, col: number) => {
        const baseProps = baseInputProps(row, col);
        const iconProps = getInputIcon(row, col) as {
            icon: React.ReactNode;
            keyframeName: string;
            keyframes: Record<string, unknown>;
        };
        return {
            ...baseProps,
            children: (
                <>
                    {baseProps.children}
                    {iconProps.icon}
                </>
            ),
            sx: {
                ...baseProps.sx,
                position: 'relative',
            },
        };
    };

    const mobile = useMobile('sm');

    return (
        <GridWithKeyframes
            boardStates={boardStates}
            inputStates={inputStates}
            dims={dims}
            id="example"
            palette={palette}
        >
            <Grid container size={12} spacing={2} sx={{ height: '100%' }}>
                <Grid
                    container
                    size={12}
                    wrap={mobile ? 'wrap' : 'nowrap'}
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        height: '100%',
                        overflow: 'hidden',
                        flexDirection: mobile ? 'column' : 'row',
                    }}
                >
                    <Grid
                        size={mobile ? 12 : 6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'inline-flex',
                            }}
                        >
                            <Board
                                size={width}
                                rows={dims}
                                cols={dims}
                                frontProps={frontProps}
                                backProps={backProps}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isSolved ? 1 : 0,
                                    transform: isSolved
                                        ? 'scale(1)'
                                        : 'scale(0.5)',
                                    visibility: isSolved ? 'visible' : 'hidden',
                                    transition:
                                        'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                }}
                            >
                                {(() => {
                                    const finalState =
                                        boardStates[inputStates.length - 1];
                                    const allOn = finalState?.every(
                                        (rowVal: number) =>
                                            rowVal === (1 << dims) - 1,
                                    );
                                    return (
                                        <EmojiEventsRounded
                                            sx={{
                                                fontSize: {
                                                    xs: '2.5rem',
                                                    sm: '4rem',
                                                },
                                                color: allOn
                                                    ? palette.secondary
                                                    : palette.primary,
                                            }}
                                        />
                                    );
                                })()}
                            </Box>
                        </Box>
                    </Grid>
                    <Grid
                        container
                        size={mobile ? 12 : 6}
                        spacing={mobile ? 1 : 2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                mb: mobile ? 0 : 2,
                                textAlign: 'center',
                            }}
                        >
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
        </GridWithKeyframes>
    );
}
