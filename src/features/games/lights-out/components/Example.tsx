import { Typography, Grid, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { GridWithKeyframes } from './AnimatedGrid';
import { getOutput, useHandler as useCalculatorHandler } from './Calculator';
import { Board } from '../../components/Board';
import { LIGHTS_OUT_STYLES } from '../config';
import { useHandler as useBoardHandler } from '../hooks/boardUtils';
import type { Palette, PropsFactory } from '../types';
import type { KeyframeMap } from '../utils/animationFrames';
import {
    getBoardIconFrames,
    getInputIconFrames,
} from '../utils/animationFrames';
import { getStates } from '../utils/chaseHandlers';

import { EmojiEventsRounded } from '@/components/icons';
import { CustomGrid } from '@/components/ui/CustomGrid';
import { COLORS } from '@/config/theme';
import { useMobile } from '@/hooks';

// ---------------------------------------------------------------------------
// Shared icon-animation helpers
// ---------------------------------------------------------------------------

/** Shape returned by `createIconHandler` for each cell. */
interface AnimatedIconResult {
    icon: React.ReactNode;
    keyframes: KeyframeMap;
    keyframeName: string;
}

/**
 * Builds the shared animated-icon `<Box>` used by both the board and
 * input icon handlers.  The only difference between the two is which
 * keyframe generator produces the frames, so we parameterise that.
 */
function createIconHandler(
    getFrames: (row: number, col: number) => KeyframeMap,
    prefix: string,
    totalFrames: number,
) {
    return (row: number, col: number): AnimatedIconResult => {
        const frames = getFrames(row, col);
        const name = `${prefix}-${String(row)}-${String(col)}`;

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
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            filter: LIGHTS_OUT_STYLES.SHADOWS.DROP,
                            paddingTop: '0.15rem',
                            animation: `${name} ${String(totalFrames * 2)}s linear infinite`,
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
 * Merges a base cell-prop factory with an animated-icon factory, layering
 * the icon on top of the existing children and adding `position: relative`.
 *
 * Both the board and input cells need the same merge logic, so this
 * eliminates the duplicated inline merge blocks.
 */
function mergeWithIcons(
    baseFactory: (row: number, col: number) => Record<string, unknown>,
    iconFactory: (row: number, col: number) => AnimatedIconResult,
) {
    return (row: number, col: number) => {
        const baseProps = baseFactory(row, col);
        const { icon } = iconFactory(row, col);

        return {
            ...baseProps,
            children: (
                <>
                    {baseProps['children'] as React.ReactNode}
                    {icon}
                </>
            ),
            sx: {
                ...(baseProps['sx'] as Record<string, unknown>),
                position: 'relative',
            },
        };
    };
}

// ---------------------------------------------------------------------------
// Example component
// ---------------------------------------------------------------------------

interface ExampleProps {
    palette: Palette;
    size: number;
    dims?: number;
    start?: number[];
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

export function Example({
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

    // Unified icon handlers — one for the board grid, one for the input row.
    const boardIconHandler = createIconHandler(
        (row, col) => getBoardIconFrames(boardStates, row, col, dims, palette),
        'example-board-icon',
        boardStates.length,
    );
    const inputIconHandler = createIconHandler(
        (_row, col) => getInputIconFrames(inputStates, col, palette),
        'example-input-icon',
        inputStates.length,
    );

    const frontProps = mergeWithIcons(baseFrontProps, boardIconHandler);

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

    const inputProps = mergeWithIcons(baseInputProps, inputIconHandler);

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
                        alignContent: 'center',
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
                                layers={[
                                    {
                                        rows: dims - 1,
                                        cols: dims - 1,
                                        cellProps: backProps,
                                        decorative: true,
                                    },
                                    {
                                        rows: dims,
                                        cols: dims,
                                        cellProps: frontProps,
                                    },
                                ]}
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
