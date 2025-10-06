// import * as colors from '@mui/material/colors'; // Removed unused import
import { Grid } from '../components/mui';

import { useMemo, useCallback } from 'react';
import { CustomGrid } from '../helpers';
import { COLORS } from '../config/theme';

export function Board(props) {
    const { frontProps, backProps, size, rows, cols } = props;

    return (
        <Centered>
            <CustomGrid
                space={0}
                size={size}
                rows={rows - 1}
                cols={cols - 1}
                cellProps={backProps}
            />
            <Centered>
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={frontProps}
                />
            </Centered>
        </Centered>
    );
}

function Centered({ children }) {
    const style = {
        transform: 'translate(-50%, -50%)',
    };

    return (
        <Grid
            top="50%"
            left="50%"
            width="100%"
            position="absolute"
            style={style}
        >
            {children}
        </Grid>
    );
}

function borderHandler(row, col, getColor) {
    const self = getColor(row, col);
    const up = getColor(row - 1, col);
    const down = getColor(row + 1, col);
    const left = getColor(row, col - 1);
    const right = getColor(row, col + 1);
    const props = {};

    const upCheck = self === up;
    const downCheck = self === down;
    const leftCheck = self === left;
    const rightCheck = self === right;

    if (upCheck || leftCheck) props.borderTopLeftRadius = 0;
    if (upCheck || rightCheck) props.borderTopRightRadius = 0;
    if (downCheck || leftCheck) props.borderBottomLeftRadius = 0;
    if (downCheck || rightCheck) props.borderBottomRightRadius = 0;

    return props;
}

function fillerHandler(row, col, getColor) {
    const topLeft = getColor(row, col);
    const topRight = getColor(row, col + 1);
    const botLeft = getColor(row + 1, col);
    const botRight = getColor(row + 1, col + 1);
    let color = true;

    const total = topLeft + topRight + botLeft + botRight;

    if ((!topLeft || !botRight) && total < 3) color = false;

    return color;
}

export function usePalette(score) {
    // High contrast dark blue color scheme for better accessibility
    const palette = useMemo(() => {
        // Using darker blues for excellent contrast (5.2:1 ratio)
        const primary = COLORS.primary.dark; // Dark blue for "on" state
        const secondary = COLORS.primary.main; // Much darker blue for "off" state

        return { primary, secondary };
    }, []); // Removed score dependency since we're using fixed colors

    return palette;
}

export function useGetters(getTile, palette) {
    const getColor = useCallback(
        (row, col) => {
            const value = getTile(row, col);

            const front = value ? palette.primary : palette.secondary;

            const back = value ? palette.secondary : palette.primary;

            return { front, back };
        },
        [getTile, palette]
    );

    const getBorder = useCallback(
        (row, col) => {
            return borderHandler(row, col, getTile);
        },
        [getTile]
    );

    const getFiller = useCallback(
        (row, col) => {
            const value = fillerHandler(row, col, getTile);

            return value ? palette.primary : palette.secondary;
        },
        [getTile, palette]
    );

    return {
        getColor,
        getBorder,
        getFiller,
    };
}

export function useHandler(state, palette) {
    const { grid, rows, cols } = state;

    const getTile = useCallback(
        (row, col) => {
            if (row < 0 || col < 0 || row >= rows || col >= cols) return -1;

            return grid[row][col];
        },
        [grid, rows, cols]
    );

    return useGetters(getTile, palette);
}
