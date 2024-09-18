import Grid from '@mui/material/Grid2';
import { CustomGrid, Controls } from '../helpers';
import { useWindow, useKeys } from '../hooks';
import { useMemo, useReducer, useEffect } from 'react';
import { convertPixels } from '../calculate';
import { getDirection, gridMove } from '../calculate';
import { BoyRounded, DirectionsWalkRounded } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { Centered, useRandom } from './Sector';

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

        const max  = rows * cols;
        const rand = Math.random();
        const newPosition
            = Math.floor(rand * max);

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
                handler={
                    dir => () => {
                        dispatch({
                            type: 'arrow' + dir});
                    }} />
        </Grid>
    );
}
