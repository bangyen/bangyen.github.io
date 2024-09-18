import { useMemo, useCallback } from 'react';
import { createNoise3D, createNoise4D } from 'simplex-noise';
import { getContrastRatio } from '@mui/material/styles';
import * as colors from '@mui/material/colors';
import Grid from '@mui/material/Grid2';
import { CustomGrid } from '../helpers';

export function Sector(props) {
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

function usePalette(xValue, yValue) {
    const threeDim = useMemo(
        () => createNoise3D(), []);

    const palette = useMemo(() => {
        let count = 0;

        const compare = () =>
            threeDim(
                xValue + 0.5,
                yValue + 0.5,
                count++);

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
    }, [threeDim, xValue, yValue]);

    return palette;
}

function useColors({ sector, rows, cols }) {
    const fourDim  = useMemo(
        () => createNoise4D(), []);
    const [xValue, yValue] = sector;

    const colors = useMemo(
        () => {
            const colors = [];

            for (let r = 0; r < rows; r++) {
                colors.push([]);

                for (let c = 0; c < cols; c++) {
                    const random = fourDim(
                        xValue, yValue, r, c);
                    colors[r].push(random > 0);
                }
            }

            return colors;
        }, [fourDim,
            xValue, yValue,
            rows, cols]);

    const colorHandler = useCallback(
        (row, col) => {
            if (row < 0 || col < 0
                    || row >= rows
                    || col >= cols)
                return -1;

            return colors[row][col];
        }, [colors, rows, cols]);

    return colorHandler;
}

export function useGetters({ sector, rows, cols }) {
    const palette = usePalette(...sector);
    const colorHandler = useColors({
        sector, rows, cols});

    const getColor = useCallback(
        (row, col) => {
            const value
                = colorHandler(row, col);

            return value
                ? palette.primary
                : palette.secondary;
        }, [colorHandler, palette]);

    const getBorder = useCallback(
        (row, col) => {
            return borderHandler(
                row, col, colorHandler);
        }, [colorHandler]);

    const getFiller = useCallback(
        (row, col) => {
            const value = fillerHandler(
                row, col, colorHandler);

            return value
                ? palette.primary
                : palette.secondary;
        }, [colorHandler, palette]);

    return {
        getColor,
        getBorder,
        getFiller
    };
}
