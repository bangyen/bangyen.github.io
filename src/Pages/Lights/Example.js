import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { getStates } from './chaseHandlers';
import { CustomGrid } from '../../helpers';
import { useMobile } from '../../hooks';

function getFrames(states, palette) {
    const newStates = [-1, ...states, -1];
    const length = states.length;
    const frames = {};

    for (let k = 0; k < length + 1; k++) {
        const state = newStates[k];
        const next = newStates[k + 1];

        const value = state + 1 ? state : next;
        const color = value ? palette.primary : palette.secondary;

        const percent = (100 * k) / length;
        const floor = Math.floor(percent);

        frames[`${floor}%`] = {
            backgroundColor: color,
        };
    }

    return frames;
}

function propHandler(states, getter, palette, id) {
    return (row, col) => {
        const state = getter(states, row, col);
        const frames = getFrames(state, palette);
        const length = states.length;

        const name = `${id}-${row}-${col}`;
        const index = `@keyframes ${name}`;

        const animation = `
            ${name}
            ${length * 2}s
            steps(1, start)
            infinite
        `;

        const style = {
            [index]: frames,
            animation,
        };

        return { sx: style };
    };
}

function getRange(dims) {
    const keys = Array(dims).keys();

    return [...keys];
}

function gridTiles(states, dims) {
    const length = states.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    return dRange.map(r => dRange.map(c => lRange.map(k => states[k][r][c])));
}

function rowTiles(states, dims) {
    const length = states.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    return dRange.map(r => lRange.map(k => states[k][r]));
}

function Bifold({ children }) {
    return <Grid size={6}>{children}</Grid>;
}

function Title({ children }) {
    return (
        <Bifold>
            <Typography
                sx={{
                    typography: {
                        xs: 'h6',
                        sm: 'h5',
                        md: 'h4',
                    },
                }}
                justifyContent="center"
                alignItems="center"
                display="flex"
                variant="h4"
            >
                {children}
            </Typography>
        </Bifold>
    );
}

export default function Example({ start, dims, size, palette }) {
    const small = useMobile('md');
    const states = getStates(start, dims);
    const width = small ? size / 2 : size;

    const { boardStates, inputStates, outputStates } = states;

    const boardTiles = gridTiles(boardStates, dims);
    const inputTiles = rowTiles(inputStates, dims);
    const outputTiles = rowTiles(outputStates, dims);

    const getGrid = (s, r, c) => s[r][c];
    const getRow = (s, r, c) => s[c];

    const getBoard = propHandler(boardTiles, getGrid, palette, 'board');
    const getInput = propHandler(inputTiles, getRow, palette, 'input');
    const getOutput = propHandler(outputTiles, getRow, palette, 'output');

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
                <Title>Example Board</Title>
                <Title>Example Input</Title>
            </Grid>
        </Grid>
    );
}
