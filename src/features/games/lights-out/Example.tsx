import React from 'react';
import { Typography, Grid, Box } from '../../../components/mui';
import { getStates } from './chaseHandlers';
import { CustomGrid } from '../../../components/ui/CustomGrid';
import { useMobile } from '../../../hooks';
import { COLORS, COMPONENT_VARIANTS } from '../../../config/theme';
import { AdsClickRounded } from '../../../components/icons';

interface Frame {
    backgroundColor?: string;
    opacity?: number;
    transform?: string;
}

interface Palette {
    primary: string;
    secondary: string;
}

function getFrames(
    states: unknown[],
    palette: Palette,
    type: 'color' | 'icon'
): Record<string, Frame> {
    const newStates = [-1, ...states, -1];
    const length = states.length;
    const frames: Record<string, Frame> = {};

    for (let k = 0; k < length + 1; k++) {
        const state = newStates[k];
        const next = newStates[k + 1];

        const percent = (100 * k) / length;
        const floor = Math.floor(percent);

        if (type === 'color') {
            const value = (state as number) + 1 ? state : next;
            const color = value ? palette.primary : palette.secondary;
            frames[`${floor}%`] = { backgroundColor: color };
        } else {
            const active = (state as number) === 1;
            frames[`${floor}%`] = {
                opacity: active ? 1 : 0,
                transform: active ? 'scale(1)' : 'scale(0.5)',
            };
        }
    }

    return frames;
}

function propHandler(
    states: unknown[],
    presses: unknown[],
    getter: (states: unknown[], row: number, col: number) => unknown[],
    palette: Palette,
    id: string
) {
    return (row: number, col: number): Record<string, unknown> => {
        const state = getter(states, row, col);
        const press = getter(presses, row, col);

        const colorFrames = getFrames(state as unknown[], palette, 'color');
        const iconFrames = getFrames(press as unknown[], palette, 'icon');
        const length = states.length;

        const colorName = `${id}-color-${row}-${col}`;
        const iconName = `${id}-icon-${row}-${col}`;

        const animation = (name: string) => `
            ${name}
            ${length * 2}s
            steps(1, start)
            infinite
        `;

        const style: Record<string, unknown> = {
            [`@keyframes ${colorName}`]: colorFrames,
            animation: animation(colorName),
            position: 'relative',
        };

        const iconStyle: Record<string, unknown> = {
            [`@keyframes ${iconName}`]: iconFrames,
            animation: animation(iconName),
            position: 'absolute',
            color: COLORS.interactive.active,
            fontSize: '1.25rem',
            zIndex: 2,
            pointerEvents: 'none',
        };

        return {
            sx: style,
            children: (
                <Box
                    sx={{
                        ...COMPONENT_VARIANTS.flexCenter,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <Box sx={iconStyle}>
                        <AdsClickRounded />
                    </Box>
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

function pressTiles(presses: (number[] | null)[], dims: number): number[][][] {
    const length = presses.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    return dRange.map(r =>
        dRange.map(c =>
            lRange.map(k => {
                const p = presses[k];
                return p && p[0] === r && p[1] === c ? 1 : 0;
            })
        )
    );
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

    const { boardStates, inputStates, outputStates, pressStates } = states;

    const boardTiles = gridTiles(boardStates, dims);
    const boardPresses = pressTiles(pressStates, dims);
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
        boardPresses as unknown[],
        getGrid,
        palette,
        'board'
    );
    const getInput = propHandler(
        inputTiles as unknown[],
        inputTiles.map(() => inputTiles[0].map(() => 0)) as unknown[],
        getRow,
        palette,
        'input'
    );
    const getOutput = propHandler(
        outputTiles as unknown[],
        outputTiles.map(() => outputTiles[0].map(() => 0)) as unknown[],
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
