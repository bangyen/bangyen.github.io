import Grid from '@mui/material/Grid2';

import { getStates } from './chaseHandlers';
import { CustomGrid } from '../helpers';

function getFrames(states, palette) {
    const newStates = [-1, ...states, -1];
    const length    = states.length;
    const frames    = {};

    for (let k = 0; k < length + 1; k++) {
        const state = newStates[k];
        const next  = newStates[k + 1];

        const value
            = state + 1
            ? state : next;
        const color = value
            ? palette.primary
            : palette.secondary;

        const percent
            = 100 * k / length;
        const floor
            = Math.floor(percent);

        frames[`${floor}%`] = {
            backgroundColor: color
        };
    }

    return frames;
}

function propHandler(states, getter, palette, name) {
    return (row, col) => {
        const state  = getter(states, row, col);
        const length = states.length;

        const frames = getFrames(
            state, palette);

        name = `${name}-${row}-${col}`;
        const index = `@keyframes ${name}`;

        const animation = `
            ${name}
            ${length * 2}s
            steps(1, start)
            infinite
        `;

        const style = {
            [index]: frames,
            animation
        };

        return {sx: style};
    };
}

function getRange(dims) {
    const keys
        = Array(dims)
            .keys();

    return [...keys];
}

function gridHandler(states, dims, palette, name) {
    const length = states.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    const tiles
        = dRange.map(
            r => dRange.map(
                c => lRange.map(
                    k => states[k][r][c])));

    return propHandler(
        tiles,
        (s, r, c) => s[r][c],
        palette, name);
}

function rowHandler(states, dims, palette, name) {
    const length = states.length;
    const dRange = getRange(dims);
    const lRange = getRange(length);

    const tiles
        = dRange.map(
            r => lRange.map(
                k => states[k][r]));

    return propHandler(
        tiles,
        (s, r, c) => s[c],
        palette, name);
}

export default function Example({
    start, dims, size, palette}) {
    const states = getStates(start, dims);

    const {
        boardStates,
        inputStates,
        outputStates
    } = states;

    const getBoard  = gridHandler(
        boardStates,  dims, palette, 'board');
    const getInput  = rowHandler(
        inputStates,  dims, palette, 'input');
    const getOutput = rowHandler(
        outputStates, dims, palette, 'output');

    return (
        <Grid container
            size={12}>
            <Grid width='50%'>
                <CustomGrid
                    size={size}
                    rows={dims}
                    cols={dims}
                    cellProps={getBoard} />
            </Grid>
            <Grid container
                width='50%'>
                <CustomGrid
                    rows={1}
                    cols={dims}
                    size={size}
                    cellProps={getInput} />
                <CustomGrid
                    rows={1}
                    cols={dims}
                    size={size}
                    cellProps={getOutput} />
            </Grid>
        </Grid>
    );
}