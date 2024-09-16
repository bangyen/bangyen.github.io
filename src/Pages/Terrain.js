import Grid from '@mui/material/Grid2';
import { CustomGrid, Controls } from '../helpers';
import { useWindow, useKeys } from '../hooks';
import { useMemo, useCallback, useReducer, useEffect } from 'react';
import { convertPixels } from '../calculate';
import { createNoise2D, createNoise4D } from 'simplex-noise';
import { getDirection, gridMove } from '../calculate';
import { DirectionsWalkRounded } from '@mui/icons-material';
import * as colors from '@mui/material/colors';

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

function getRandom(length) {
    const random = Math.random;
    const index  = 'A100';

    return Object.values(colors)
        .map(color => color[index])
        .sort(() => random() - 0.5)
        .filter(Boolean)
        .slice(0, length);
}

function handleAction(state, action) {
    const { type, payload } = action;

    const {
        position,
        sector,
        rows,
        cols
    } = state;

    if (type === 'resize') {
        const { rows, cols }
            = payload;

        const newPosition
            = Math.floor(
                (rows + 1) * cols / 2);

        return {
            ...state,
            ...payload,
            position:
                newPosition
        };
    }

    const direction
        = getDirection(
            action.type);

    const newPosition
        = gridMove(
            position,
            direction,
            rows,
            cols);

    if (newPosition > position) {
        if (direction === -2)
            sector[0]--;
        else if (direction === -1)
            sector[1]--;
    } else if (newPosition < position) {
        if (direction === 2)
            sector[0]++;
        else if (direction === 1)
            sector[1]++;
    }

    return {
        ...state,
        position:
            newPosition
    };
}

function useRandom({ sector, rows, cols }) {
    const twoDim  = useMemo(
        () => createNoise2D(), []);
    const fourDim = useMemo(
        () => createNoise4D(), []);

    const [xValue, yValue] = sector;

    const palette = useMemo(
        () => {
            const [primary, secondary]
                = getRandom(2);

            return { primary, secondary };
        }, [twoDim, xValue, yValue]);

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

export default function Terrain() {
    const { height, width } = useWindow();
    const { create } = useKeys();
    const size = 5;

    let { rows, cols } = useMemo(
        () => convertPixels(
            size, height, width),
        [size, height, width]);

    rows -= 2;
    cols -= 3;

    const [state, dispatch] = useReducer(
        handleAction, {
            sector: [0, 0],
            position: 0,
            rows,
            cols
        });

    const { palette, getColor, getBorder, getFiller }
        = useRandom(state);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload:
                { rows, cols }
        });
    }, [rows, cols]);

    useEffect(() => {
        create(event => {
            dispatch({
                type: event.key});
        });
    }, [create]);

    const frontProps 
        = (row, col) => {
            const style = getBorder(row, col);
            const value = getColor(row, col);

            const backgroundColor = value
                ? palette.primary
                : palette.secondary;

            const index = row * cols + col;
            let children = null;

            if (index === state.position)
                children = (
                    <DirectionsWalkRounded
                        fontSize='large' />
                );

            return {
                color: 'black',
                backgroundColor,
                children,
                style
            };
        };

    const backProps 
        = (row, col) => {
            const value
                = getFiller(row, col);
            const color = value
                ? palette.primary
                : palette.secondary;

            return {
                backgroundColor: color
            };
        };

    return (
        <Grid>
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
            <Controls
                handler={dir => () => dispatch({type: 'arrow' + dir})} />
        </Grid>
    );
}
