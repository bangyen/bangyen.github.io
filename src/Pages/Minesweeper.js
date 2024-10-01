import { useReducer, useMemo, useEffect } from 'react';
import { useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useWindow } from '../hooks';

import {
    CircleRounded,
    RefreshRounded
} from '@mui/icons-material';

import {
    gridMove,
    convertPixels
} from '../calculate';

import {
    CustomGrid,
    Navigation,
    HomeButton,
    TooltipButton
} from '../helpers';

function moveHandler(
        rows, cols, list) {
    return (pos, arrow) => {
        const next = gridMove(
            pos, arrow, rows, cols);

        list.add(next);
    };
}

function getAdjacent(
        pos, rows, cols) {
    const result = new Set();
    const move   = moveHandler(
        rows, cols, result);

    result.add(pos);
    move(pos, -2);
    move(pos, 2);

    for (const tile of new Set(result)) {
        move(tile, -1);
        move(tile, 1);
    }

    return result;
}

function checkMines(
        pos, rows, cols, mines) {
    const adjacent
        = getAdjacent(
            pos, rows, cols);
    let count = 0;

    for (const tile of adjacent)
        if (mines.has(tile))
            count++;

    return count;
}

function skipRepeat(
        pos, max, mines) {
    while (mines.has(pos++))
        if (pos >= max)
            pos = 0;

    return pos;
}

function getMines(pos, rows, cols) {
    const adjacent = getAdjacent(
        pos, rows, cols);

    const max    = rows * cols;
    const mines  = max * 0.15;
    const result = new Set();

    while (result.size < mines) {
        const value = Math.random() * max;
        const start = Math.floor(value);
        const union = result
            .union(adjacent);

        const next = skipRepeat(
            start, max, union);

        result.add(next);
    }

    return result;
}

function clickTile(pos, state) {
    let {
        tiles,
        mines,
        rows,
        cols
    } = state;

    if (!tiles.has(pos))
        return state;

    if (mines.has(pos)) {
        return {
            ...state,
            done: true
        };
    }

    const adjacent = getAdjacent(
        pos, rows, cols);
    const count = checkMines(
        pos, rows, cols, mines);

    tiles = new Set(tiles);
    adjacent.delete(pos);
    tiles.delete(pos);

    if (!count) {
        for (const adj of adjacent) {
            state.tiles = tiles;

            const newState
                = clickTile(
                    adj, state);

            tiles = newState.tiles;
        }
    }

    return { ...state, tiles, done: false };
}

function resetBoard(rows, cols) {
    const max  = rows * cols;
    const arr  = Array(max);
    const keys = [...arr.keys()];

    return {
        tiles: new Set(keys),
        mines: new Set(),
        done:  true,
        rows,
        cols
    };
}

function handleBoard(state, action) {
    const { type, payload } = action;

    let {
        rows,
        cols,
        done
    } = state;

    switch (type) {
        case 'click':
            const { pos }
                = payload;

            if (done)
                state.mines = getMines(
                    pos, rows, cols);

            return clickTile(
                pos, state);
        case 'reset':
            return resetBoard(
                rows, cols);
        case 'resize':
            const {
                newRows,
                newCols
            } = payload;

            return resetBoard(
                newRows, newCols);
        default:
            break;
    }

    return state;
}

function getProps(state, dispatch) {
    const {
        tiles,
        mines,
        rows,
        cols,
        done
    } = state;

    return (row, col) => {
        const pos
            = row * cols + col;

        const props = {
            onClick: () => {
                dispatch({
                    type: 'click',
                    payload: { pos }
                });
            },
            backgroundColor:
                'primary.main',
            sx: {
                '&:hover': {
                    backgroundColor:
                        'primary.dark',
                }
            }
        };

        if (!tiles.has(pos)) {
            const count = checkMines(
                pos, rows, cols, mines);

            props.backgroundColor = 'primary.light';
            props.color = 'secondary.light';

            if (count)
                props.children = count;
        }

        if (mines.has(pos)) {
            if (done) {
                props.children
                    = <CircleRounded />;

                if (!tiles.has(pos)) {
                    props.color = 'error.light';
                }

                if (tiles.size === mines.size) {
                    props.color = 'success.light';
                }
            }
        }

        return props;
    };
}

export default function Minesweeper() {
    const mobile = useMediaQuery(
        theme => theme
            .breakpoints
            .down('sm'));

    const { height, width } = useWindow();
    let size = mobile ? 3 : 5;

    let { rows, cols } = useMemo(
        () => convertPixels(
            size, height, width),
        [size, height, width]);

    size *= 0.9;
    rows -= 3;
    cols -= 3;

    if (mobile)
        rows -= 2;

    const [state, dispatch]
        = useReducer(
            handleBoard,
            resetBoard(
                rows, cols));

    const handleReset = () => {
        dispatch({ type: 'reset' });
    };

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: {
                newRows: rows,
                newCols: cols
            }
        });
    }, [rows, cols]);

    return (
        <Grid
            container
            height='100vh'
            flexDirection='column'
            position="relative">
            <Grid
                flex={1}
                display='flex'
                alignItems='center'
                justifyContent='center'>
                <CustomGrid
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={getProps(
                        state, dispatch)}
                />
            </Grid>
            <Navigation>
                <HomeButton
                    size='inherit' />
                <TooltipButton
                    Icon={RefreshRounded}
                    title='Randomize'
                    size='inherit'
                    onClick={handleReset} />
            </Navigation>
        </Grid>
    );
}