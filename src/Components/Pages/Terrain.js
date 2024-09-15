import Grid from '@mui/material/Grid2';
import { CustomGrid, Controls } from '../helpers';
import { useWindow } from '../hooks';
import { useMemo, useCallback } from 'react';
import { convertPixels } from '../calculate';

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

function getRandom(seed, row, col) {
    const mult = 1.5;
    seed *= (row + 1) * mult;
    seed %= 1;
    
    seed *= (col + 1) * mult;
    return seed % 1;
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

function getHex(seed) {
    const max = 16 ** 6;
    const hex = Math
        .floor(seed * max)
        .toString(16)
        .padStart(6, '0');

    return hex;
}

function useRandom(rows, cols) {
    const seed = useMemo(
        () => Math.random(), []);

    const palette = useMemo(
        () => {
            const next = (seed * 10) % 1;
            const primary   = getHex(seed);
            const secondary = getHex(next);

            return {
                primary: `#${primary}`,
                secondary: `#${secondary}`
            };
        }, [seed]);

    const colors = useMemo(
        () => {
            const colors = [];

            for (let r = 0; r < rows; r++) {
                colors.push([]);

                for (let c = 0; c < cols; c++) {
                    const random
                        = getRandom(
                            seed, r, c);

                    colors[r].push(
                        random > 0.5);
                }
            }

            return colors;
        }, [seed, rows, cols]);

    const getColor = useCallback(
        (row, col) => {
            if (row < 0 || col < 0
                    || row >= rows
                    || col >= cols)
                return -1;

            return colors[row][col];
        }, [colors, rows, cols]);

    const getBorder =
        (row, col) => borderHandler(
            row, col, getColor);

    const getFiller =
        (row, col) => fillerHandler(
            row, col, getColor);

    return {
        palette,
        getColor,
        getBorder,
        getFiller
    };
}

export default function Snowman() {
    const { height, width } = useWindow();
    const size  = 5;

    let { rows, cols } = useMemo(
        () => convertPixels(
            size, height, width),
        [size, height, width]);

    rows -= 2;
    cols -= 3;

    const { palette, getColor, getBorder, getFiller }
        = useRandom(rows, cols);

    const FrontCell
        = ({Cell, row, col}) => {
            const props
                = getBorder(row, col);
            const value 
                = getColor(row, col);
            const color = value
                ? palette.primary
                : palette.secondary;

            return (
                <Cell
                    size={size}
                    style={props}
                    backgroundColor
                        ={color} />
            );
        };

    const BackCell
        = ({Cell, row, col}) => {
            const value
                = getFiller(row, col);
            const color = value
                ? palette.primary
                : palette.secondary;

            return (
                <Cell
                    size={size}
                    backgroundColor
                        ={color} />
            );
        };

    return (
        <Grid>
            <Centered>
                <CustomGrid
                    space={0}
                    size={size}
                    rows={rows - 1}
                    cols={cols - 1}
                    Wrapper={BackCell} />
                <Centered>
                    <CustomGrid
                        space={0}
                        size={size}
                        rows={rows}
                        cols={cols}
                        Wrapper={FrontCell} />
                </Centered>
            </Centered>
            <Controls
                velocity={{}} />
        </Grid>
    );
}
