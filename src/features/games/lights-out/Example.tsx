import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Grid, Box } from '../../../components/mui';
import { EmojiEventsRounded } from '../../../components/icons';
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
    palette: Palette,
    speed = 1
): Record<
    string,
    { opacity: number; content: string; color: string; transform: string }
> {
    const length = states.length;
    const frames: Record<
        string,
        { opacity: number; content: string; color: string; transform: string }
    > = {};

    const stepSize = 100 / length;

    for (let k = 0; k < length; k++) {
        const start = k * stepSize;
        const end = (k + 1) * stepSize;

        let color = palette.secondary;
        let match = false;
        let predictedContent = '';

        const currentState = states[k];
        const nextState = k + 1 < length ? states[k + 1] : null;

        if (currentState && nextState) {
            const predicted = flipAdj(row, col, currentState);
            match = true;
            for (let r = 0; r < dims; r++) {
                const predictedRow = predicted[r];
                const nextRowState = nextState[r];
                if (!predictedRow || !nextRowState) {
                    match = false;
                    break;
                }
                for (let c = 0; c < dims; c++) {
                    if (predictedRow[c] !== nextRowState[c]) {
                        match = false;
                        break;
                    }
                }
                if (!match) break;
            }

            if (match) {
                const isOne = currentState[row]?.[col] === 1;
                color = isOne ? palette.secondary : palette.primary;
                predictedContent = `"${String(k + 1)}"`;
            }
        }

        if (match) {
            // Entrance (Pop In)
            frames[`${String(start)}%`] = {
                opacity: 0,
                content: predictedContent,
                color,
                transform: 'scale(0.5)',
            };
            frames[`${String(start + stepSize * (0.1 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1.2)',
            };
            frames[`${String(start + stepSize * (0.2 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1)',
            };

            // Hold
            frames[`${String(end - stepSize * (0.1 / speed))}%`] = {
                opacity: 1,
                content: predictedContent,
                color,
                transform: 'scale(1)',
            };

            // Exit (Fade Out)
            frames[`${String(end)}%`] = {
                opacity: 0,
                content: predictedContent,
                color,
                transform: 'scale(0.5)',
            };
        } else {
            // Keep hidden
            frames[`${String(start)}%`] = {
                opacity: 0,
                content: '""',
                color,
                transform: 'scale(0.5)',
            };
            frames[`${String(end)}%`] = {
                opacity: 0,
                content: '""',
                color,
                transform: 'scale(0.5)',
            };
        }
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
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
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

function inputIconHandler(
    states: number[][],
    dims: number,
    id: string,
    palette: Palette
) {
    return (row: number, col: number): Record<string, unknown> => {
        const length = states.length;
        const frames: Record<
            string,
            {
                opacity: number;
                content: string;
                color: string;
                transform: string;
            }
        > = {};

        const stepSize = 100 / length;
        const speed = 2; // 2x speed for input

        for (let k = 0; k < length; k++) {
            const start = k * stepSize;
            const end = (k + 1) * stepSize;

            let color = palette.secondary;
            let match = false;
            let predictedContent = '';

            const currentState = states[k];
            const nextState = k + 1 < length ? states[k + 1] : null;

            if (currentState && nextState) {
                // Input states are just rows (number[]), so we check the specific cell
                if (currentState[col] !== nextState[col]) {
                    match = true;
                    const isOne = currentState[col] === 1;
                    color = isOne ? palette.secondary : palette.primary;
                    predictedContent = `"${String(k + 1)}"`;
                }
            }

            if (match) {
                // Entrance (Pop In) - Faster for input
                frames[`${String(start)}%`] = {
                    opacity: 0,
                    content: predictedContent,
                    color,
                    transform: 'scale(0.5)',
                };
                frames[`${String(start + stepSize * (0.1 / speed))}%`] = {
                    opacity: 1,
                    content: predictedContent,
                    color,
                    transform: 'scale(1.2)',
                };
                frames[`${String(start + stepSize * (0.2 / speed))}%`] = {
                    opacity: 1,
                    content: predictedContent,
                    color,
                    transform: 'scale(1)',
                };

                // Hold (End sooner for input to feel snappier)
                frames[`${String(end - stepSize * (0.1 / speed))}%`] = {
                    opacity: 1,
                    content: predictedContent,
                    color,
                    transform: 'scale(1)',
                };

                // Exit (Fade Out)
                frames[`${String(end)}%`] = {
                    opacity: 0,
                    content: predictedContent,
                    color,
                    transform: 'scale(0.5)',
                };
            } else {
                frames[`${String(start)}%`] = {
                    opacity: 0,
                    content: '""',
                    color,
                    transform: 'scale(0.5)',
                };
                frames[`${String(end)}%`] = {
                    opacity: 0,
                    content: '""',
                    color,
                    transform: 'scale(0.5)',
                };
            }
        }

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
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
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
                ...(baseProps.sx as object),
                position: 'relative',
            },
        };
    };

    const inputGetters = useCalculatorHandler(
        inputStates[remainder] ?? [],
        dims,
        palette
    );
    const outputGetters = useCalculatorHandler(
        outputStates[remainder] ?? [],
        dims,
        palette
    );
    const baseInputProps = getOutput(inputGetters);
    const outputProps = getOutput(outputGetters);

    // Icon animation handler for input row
    const getInputIcon = inputIconHandler(
        inputStates,
        dims,
        'example',
        palette
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
                ...(baseProps.sx as object),
                position: 'relative',
            },
        };
    };

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
                    wrap="nowrap"
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <Grid
                        size={6}
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
                                    const allOn = finalState
                                        ?.flat()
                                        .every((cell: number) => cell === 1);
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
        </GridWithKeyframes>
    );
}

function GridWithKeyframes({
    boardStates,
    inputStates,
    dims,
    id,
    palette,
    children,
}: {
    boardStates: number[][][];
    inputStates: number[][];
    dims: number;
    id: string;
    palette: Palette;
    children: React.ReactNode;
}) {
    const keyframes = useMemo(() => {
        const boardKF = boardStates.flatMap((_, r) =>
            Array.from({ length: dims }, (_, c) => {
                const name = `${id}-board-icon-${String(r)}-${String(c)}`;
                const frames = getIconFrames(boardStates, r, c, dims, palette);
                return { name, frames };
            })
        );
        const inputKF = inputStates.flatMap((_, c) => {
            const name = `${id}-input-icon-0-${String(c)}`;
            // Re-use logic for input
            const frames: Record<string, unknown> = {};
            const length = inputStates.length;
            const stepSize = 100 / length;
            const speed = 2;
            for (let k = 0; k < length; k++) {
                const start = k * stepSize;
                const end = (k + 1) * stepSize;
                let match = false;
                let color = palette.secondary;
                let predictedContent = '';
                const currentState = inputStates[k];
                const nextState = k + 1 < length ? inputStates[k + 1] : null;
                if (
                    currentState &&
                    nextState &&
                    currentState[c] !== nextState[c]
                ) {
                    match = true;
                    predictedContent = `"${String(k + 1)}"`;
                    color =
                        currentState[c] === 1
                            ? palette.secondary
                            : palette.primary;
                }
                if (match) {
                    frames[`${String(start)}%`] = {
                        opacity: 0,
                        content: predictedContent,
                        color,
                        transform: 'scale(0.5)',
                    };
                    frames[`${String(start + stepSize * (0.1 / speed))}%`] = {
                        opacity: 1,
                        content: predictedContent,
                        color,
                        transform: 'scale(1.2)',
                    };
                    frames[`${String(start + stepSize * (0.2 / speed))}%`] = {
                        opacity: 1,
                        content: predictedContent,
                        color,
                        transform: 'scale(1)',
                    };
                    frames[`${String(end - stepSize * (0.1 / speed))}%`] = {
                        opacity: 1,
                        content: predictedContent,
                        color,
                        transform: 'scale(1)',
                    };
                    frames[`${String(end)}%`] = {
                        opacity: 0,
                        content: predictedContent,
                        color,
                        transform: 'scale(0.5)',
                    };
                } else {
                    frames[`${String(start)}%`] = {
                        opacity: 0,
                        content: '""',
                        color,
                    };
                    frames[`${String(end)}%`] = {
                        opacity: 0,
                        content: '""',
                        color,
                    };
                }
            }
            return { name, frames };
        });
        return [...boardKF, ...inputKF];
    }, [boardStates, inputStates, dims, id, palette]);

    return (
        <>
            <style>
                {keyframes
                    .map(
                        kf => `
                @keyframes ${kf.name} {
                    ${Object.entries(
                        kf.frames as Record<string, Record<string, string>>
                    )
                        .map(
                            ([p, s]) => `
                        ${p} {
                            ${Object.entries(s)
                                .map(
                                    ([k, v]) =>
                                        `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${v};`
                                )
                                .join(' ')}
                        }
                    `
                        )
                        .join('')}
                }
            `
                    )
                    .join('')}
            </style>
            {children}
        </>
    );
}
