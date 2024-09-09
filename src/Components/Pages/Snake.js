import Grid from '@mui/material/Grid2';

import { useWindow, useTimer, useKeys } from '../hooks';
import { useMemo, useCallback, useRef, useReducer, useEffect } from 'react';
import { CustomGrid, Controls, convertPixels } from '../helpers';

function getRandom(max) {
    return Math.floor(
        Math.random() * max);
}

function addNext(max, exclude) {
    let pos = getRandom(max);

    while (pos in exclude)
        if (++pos >= max)
            pos = 0;

    return {
        ...exclude,
        [pos]: -1
    };
}

function mapBoard(board, change) {
    const newBoard = {};

    for (const cell in board) {
        const value = board[cell];

        if (value + change > 0)
            newBoard[cell] = value + change;
        else if (value < 0)
            newBoard[cell] = value;
    }

    return newBoard;
}

function handleResize(state, rows, cols) {
    const max  = rows * cols;
    const head = getRandom(max);
    let   next = getRandom(max);

    if (head === next)
        next = ++next % max;

    return {
        ...state,
        rows,
        cols,
        head,
        board: {
            [head]: state.length,
            [next]: -1
        }
    };
}

function reduceBoard(state, velocity) {
    let {
        board, length,
        head, rows, cols
    } = state;

    const jump = cols - 1;
    const max  = rows * cols;

    switch (velocity) {
        case 2:
            head += cols;
            break;
        case -2:
            head -= cols;
            break;
        case 1:
            if (head % cols === jump)
                head -= jump;
            else
                head += 1;
            break;
        case -1:
            if (head % cols === 0)
                head += jump;
            else
                head -= 1;
            break;
        default:
            break;
    }

    board = mapBoard(board, -1);
    head  = (head + max) % max;

    if (head in board) {
        const value = board[head];
        board[head] = length;

        if (value > 0) {
            board = mapBoard(board, -value);
        } else {
            board = mapBoard(board, 1);
            board = addNext(max, board);
            console.log(board);
        }

        length = board[head];
    } else {
        board[head] = length;
    }

    return {
        ...state,
        length,
        board,
        head
    };
}

function handleAction(state, action) {
    const { type, payload } = action;

    if (action.type === 'resize') {
        const { rows, cols } = payload;
        return handleResize(
            state, rows, cols);
    }

    if (type !== 'move')
        return state;

    let { velocity, buffer }
        = payload.current;

    if (buffer) {
        velocity = buffer;
        buffer   = null;
    }

    payload.current = {
        move: !buffer,
        velocity,
        buffer
    };

    return reduceBoard(
        state, velocity);
}

function handleDirection(action, event) {
    let { velocity, buffer, move }
        = action.current;

    let change;

    switch (event.toLowerCase()) {
        case 'arrowup':
        case 'w':
            change = -2;
            break;
        case 'arrowdown':
        case 's':
            change = 2;
            break;
        case 'arrowleft':
        case 'a':
            change = -1;
            break;
        case 'arrowright':
        case 'd':
            change = 1;
            break;
        default:
            return;
    }

    if (velocity + change) {
        if (move) {
            velocity = change;
            move     = false;
        } else {
            buffer   = change;
        }
    }

    action.current = {
        velocity,
        buffer,
        move
    };
}

export default function Snake() {
    const action = useRef({
        velocity: 1,
        buffer: null,
        move: true
    });

    const { create: createTimer } = useTimer(100);
    const { create: createKeys  } = useKeys();

    const { height, width }
        = useWindow();
    const length = 3;
    const size   = 3;

    const { rows, cols } = useMemo(
        () => convertPixels(
            size, height, width),
        [size, height, width]);

    const [state, dispatch]
        = useReducer(
            handleAction,
            handleResize(
                {length},
                rows, cols));

    const controlHandler
        = useCallback(
            event => {
                const key = 'arrow' + event;
                handleDirection(action, key);
            }, [action]);

    const Wrapper = useCallback(
        ({Cell, row, col}) => {
            const index = row * cols + col;
            const board = state.board;
            let color   = 'inherit';

            if (index in board) {
                if (board[index] > 0)
                    color = 'secondary.light';
                else
                    color = 'primary.light';
            }

            return <Cell backgroundColor={color} />;
        }, [state, cols]);

    useEffect(() => {
        const wrapDispatch
            = () => dispatch({
                type: 'move',
                payload: action});

        const wrapDirection
            = event =>
                handleDirection(
                    action, event.key);

        createTimer({repeat: wrapDispatch});
        createKeys(wrapDirection);
    }, [createTimer, createKeys]);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: {rows, cols}});
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
                justifyContent='center'
                alignItems='center'>
                <CustomGrid
                    size={size}
                    rows={rows}
                    cols={cols}
                    Wrapper={Wrapper} />
            </Grid>
            <Controls
                handler={controlHandler} />
        </Grid>
    );
}