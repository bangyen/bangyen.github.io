import { useMemo, useCallback } from 'react';
import { createNoise3D, createNoise4D } from 'simplex-noise';
import { getContrastRatio } from '@mui/material/styles';
import * as colors from '@mui/material/colors';
import Grid from '@mui/material/Grid2';

export function Centered({children}) {
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

export function useRandom({ sector, rows, cols }) {
    const threeDim = useMemo(
        () => createNoise3D(), []);
    const fourDim  = useMemo(
        () => createNoise4D(), []);

    const [xValue, yValue] = sector;

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
