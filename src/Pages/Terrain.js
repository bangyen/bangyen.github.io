import Grid from '@mui/material/Grid2';
import { Controls } from '../helpers';
import { useWindow, useKeys } from '../hooks';
import { useMemo, useReducer, useEffect, useCallback } from 'react';
import { convertPixels } from '../calculate';
import { getDirection, gridMove } from '../calculate';
import { BoyRounded, DirectionsWalkRounded } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { Sector, useGetters } from './Sector';

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
        getColor,
        getBorder,
        getFiller
    } = useGetters(state);

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
            const color = getColor(row, col);

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
                backgroundColor: color,
                color: 'black',
                children,
                style
            };
        };

    const backProps 
        = (row, col) => {
            return {
                backgroundColor:
                    getFiller(row, col)
            };
        };

    const wrapDispatch
        = useCallback(
            dir => () => {
                dispatch({
                    type: 'arrow'
                        + dir});
            }, [dispatch]);

    return (
        <Grid>
            <Sector
                size={size}
                rows={rows}
                cols={cols}
                frontProps={frontProps}
                backProps={backProps} />
            <Controls
                handler={wrapDispatch} />
        </Grid>
    );
}
