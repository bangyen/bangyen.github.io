import Grid from '@mui/material/Grid2';
import { CustomGrid, Controls } from '../helpers';
import { useWindow, useKeys } from '../hooks';
import { useMemo, useCallback, useReducer, useEffect } from 'react';
import { convertPixels } from '../calculate';
import { createNoise3D, createNoise4D } from 'simplex-noise';
import { getDirection, gridMove } from '../calculate';
import { BoyRounded, DirectionsWalkRounded } from '@mui/icons-material';
import * as colors from '@mui/material/colors';
import { getContrastRatio } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

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

function useRandom({ sector, rows, cols }) {
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

    let newIcon = direction % 2
        ? DirectionsWalkRounded
        : BoyRounded;

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
        direction,
        Icon: newIcon,
        position: newPosition
    };
}

export default function Terrain() {
    const { height, width } = useWindow();
    const { create } = useKeys();

    const mobile = useMediaQuery(
        theme => theme.breakpoints.down('sm'));
    const size = mobile ? 3 : 5;

    let { rows, cols } = useMemo(
        () => convertPixels(
            size, height, width),
        [size, height, width]);

    rows -= 1;
    cols -= 1;

    const [state, dispatch] = useReducer(
        handleAction, {
            Icon: BoyRounded,
            sector: [0, 0],
            position: 0,
            rows,
            cols
        });

    const {
        palette,
        getColor,
        getBorder,
        getFiller
    } = useRandom(state);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload:
                { rows, cols }
        });
    }, [rows, cols]);

    useEffect(() => {
        document.title
            = 'Terrain | Bangyen';

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

            const {
                position,
                direction,
                Icon
            } = state;

            const index
                = row * cols + col;

            const iconProps = {
                fontSize: mobile
                    ? 'medium'
                    : 'large',
                sx: {
                    transform:
                        direction === -1
                            ? 'scaleX(-1)'
                            : 'scaleX(1)'
                }
            };

            const children
                = index === position
                    ? <Icon {...iconProps} />
                    : null;

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
