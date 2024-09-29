import { getContrastRatio } from '@mui/material/styles';
import * as colors from '@mui/material/colors';
import Grid from '@mui/material/Grid2';

import { useMemo, useCallback } from 'react';
import { CustomGrid } from '../helpers';

export function Board(props) {
    const {
        frontProps,
        backProps,
        size,
        rows,
        cols
    } = props;

    return (
        <Centered>
            <CustomGrid
                space={0}
                size={size}
                rows={rows - 1}
                cols={cols - 1}
                cellProps
                    ={backProps} />
            <Centered>
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps
                        ={frontProps} />
            </Centered>
        </Centered>
    );
}

function Centered({children}) {
    const style = {
        transform:
            'translate(-50%, -50%)'};

    return (
        <Grid
            top='50%'
            left='50%'
            width='100%'
            position='absolute'
            style={style}>
            {children}
        </Grid>
    );
}

function borderHandler(row, col, getColor) {
    const self  = getColor(row, col);
    const up    = getColor(row - 1, col);
    const down  = getColor(row + 1, col);
    const left  = getColor(row, col - 1);
    const right = getColor(row, col + 1);
    const props = {};

    const upCheck    = self === up;
    const downCheck  = self === down;
    const leftCheck  = self === left;
    const rightCheck = self === right;

    if (upCheck || leftCheck)
        props.borderTopLeftRadius  = 0;
    if (upCheck || rightCheck)
        props.borderTopRightRadius = 0;
    if (downCheck || leftCheck)
        props.borderBottomLeftRadius  = 0;
    if (downCheck || rightCheck)
        props.borderBottomRightRadius = 0;

    return props;
}

function fillerHandler(row, col, getColor) {
    const topLeft  = getColor(row, col);
    const topRight = getColor(row, col + 1);
    const botLeft  = getColor(row + 1, col);
    const botRight = getColor(row + 1, col + 1);
    let color = true;
    
    const total = topLeft
        + topRight
        + botLeft
        + botRight;

    if ((!topLeft || !botRight)
            && total < 3)
        color = false;

    return color;
}

function getRandom(
        length, compare, filter) {
    const index  = 'A100';

    const values = Object.values(colors)
        .map(color => color[index])
        .sort(compare)
        .filter(Boolean);

    const first  = values[0];
    const result = [first];

    for (const color of values) {
        if (result.length === length)
            break;

        if (filter(first, color))
            result.push(color);
    }

    return result;
}

export function usePalette() {
    const palette = useMemo(() => {
        const compare = () =>
            2 * Math.random() - 1;

        const filter
            = (first, second) => {
                const ratio
                    = getContrastRatio(
                        first, second);

                return ratio >= 1.5;
            };

        const [primary, secondary]
            = getRandom(2, compare, filter);

        return { primary, secondary };
    }, []);

    return palette;
}

export function useGetters(getTile, palette) {
    const getColor = useCallback(
        (row, col) => {
            const value
                = getTile(row, col);

            const front = value
                ? palette.primary
                : palette.secondary;

            const back = value
                ? palette.secondary
                : palette.primary;

            return { front, back };
        }, [getTile, palette]);

    const getBorder = useCallback(
        (row, col) => {
            return borderHandler(
                row, col, getTile);
        }, [getTile]);

    const getFiller = useCallback(
        (row, col) => {
            const value = fillerHandler(
                row, col, getTile);

            return value
                ? palette.primary
                : palette.secondary;
        }, [getTile, palette]);

    return {
        getColor,
        getBorder,
        getFiller
    };
}

export function useHandler(state, palette) {
    const { grid, rows, cols } = state;

    const getTile = useCallback(
        (row, col) => {
            if (row < 0 || col < 0
                    || row >= rows
                    || col >= cols)
                return -1;

            return grid[row][col];
        },
        [grid, rows, cols]);

    return useGetters(
        getTile, palette);
}
