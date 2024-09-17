import Grid from '@mui/material/Grid2';

import { useWindow, useTimer, useKeys } from '../hooks';
import { useMemo, useCallback, useRef, useReducer, useEffect } from 'react';
import { CustomGrid, Controls } from '../helpers';
import { convertPixels, gridMove, getDirection } from '../calculate';

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

    const max = rows * cols;

    board = mapBoard(board, -1);
    head  = gridMove(
        head, velocity,
        rows, cols);

    if (head in board) {
        const value = board[head];
        board[head] = length;

        if (value > 0) {
            board = mapBoard(board, -value);
        } else {
            board = mapBoard(board, 1);
            board = addNext(max, board);
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

    const { velocity, buffer, keepFlag }
        = payload.current;

    let newVelocity = velocity;
    let newBuffer   = buffer;

    if (!keepFlag) {
        newVelocity
            = buffer || velocity;
        newBuffer = null;
    }

    payload.current = {
        velocity: newVelocity,
        buffer: newBuffer,
        keepFlag: false
    };

    return reduceBoard(
        state, velocity);
}

function handleDirection(action, event) {
    const change = getDirection(event);

    if (!change)
        return;

    let { velocity, buffer, keepFlag }
        = action.current;

    if (velocity + change) {
        if (keepFlag) {
            buffer = change;
        } else if (buffer) {
            velocity = buffer;
            buffer   = change;
            keepFlag = true;
        } else {
            velocity = change;
            keepFlag = true;
        }
    }

    action.current = {
        velocity,
        keepFlag,
        buffer
    };
}

export default function Snake() {
    const action = useRef({
        velocity: 1,
        buffer: null,
        keepFlag: false
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
            event => () => {
                const key = 'arrow' + event;
                handleDirection(action, key);
            }, [action]);

    const chooseColor = useCallback(
        (row, col) => {
            const index = row * cols + col;
            const board = state.board;
            let color   = 'inherit';

            if (index in board) {
                if (board[index] > 0)
                    color = 'secondary.light';
                else
                    color = 'primary.light';
            }

            return {
                backgroundColor: color
            };
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

    useEffect(() => {
        document.title
            = 'Snake | Bangyen';
    }, []);

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
                    cellProps 
                        ={chooseColor} />
            </Grid>
            <Controls
                handler={controlHandler} />
        </Grid>
    );
}