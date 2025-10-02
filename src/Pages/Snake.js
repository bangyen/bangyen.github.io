import { useMemo, useCallback, useReducer, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
// import * as colors from '@mui/material/colors'; // Removed unused import

import { convertPixels, gridMove, getDirection } from '../calculate';
import { useWindow, useTimer, useKeys } from '../hooks';
import { CustomGrid, Controls } from '../helpers';
import { COLORS } from '../config/constants';

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function addNext(max, exclude) {
    let pos = getRandom(max);

    while (pos in exclude) if (++pos >= max) pos = 0;

    return {
        ...exclude,
        [pos]: -1,
    };
}

function mapBoard(board, change) {
    const newBoard = {};

    for (const cell in board) {
        const value = board[cell];

        if (value + change > 0) newBoard[cell] = value + change;
        else if (value < 0) newBoard[cell] = value;
    }

    return newBoard;
}

function handleResize(state, rows, cols) {
    const max = rows * cols;
    const head = getRandom(max);
    let next = getRandom(max);

    if (head === next) next = ++next % max;

    return {
        ...state,
        rows,
        cols,
        head,
        board: {
            [head]: state.length,
            [next]: -1,
        },
    };
}

function reduceBoard(state) {
    let { board, length, head, velocity, buffer } = state;
    const { rows, cols } = state;

    const max = rows * cols;

    board = mapBoard(board, -1);
    head = gridMove(head, velocity, rows, cols);

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

    if (buffer.length) {
        const [first, ...rest] = buffer;
        buffer = rest;

        if (velocity + first) velocity = first;
    }

    return {
        ...state,
        length,
        board,
        head,
        velocity,
        buffer,
    };
}

function handleAction(state, action) {
    const { type, payload } = action;

    switch (type) {
        case 'resize':
            const { rows, cols } = payload;

            return handleResize(state, rows, cols);
        case 'steer':
            const velocity = getDirection(payload.key);
            let { buffer } = state;

            if (velocity) buffer = [...buffer, velocity];

            return {
                ...state,
                buffer,
            };
        case 'move':
            return reduceBoard(state);
        default:
            return state;
    }
}

export default function Snake() {
    const { create: createTimer } = useTimer(100);
    const { create: createKeys } = useKeys();

    const { height, width } = useWindow();
    const length = 3;
    const size = 3;

    const { rows, cols } = useMemo(
        () => convertPixels(size, height, width),
        [size, height, width]
    );

    const initial = useMemo(
        () => ({
            velocity: 1,
            buffer: [],
            length,
        }),
        []
    );

    const [state, dispatch] = useReducer(
        handleAction,
        handleResize(initial, rows, cols)
    );

    const controlHandler = useCallback(
        event => () => {
            const key = 'arrow' + event;

            dispatch({
                type: 'steer',
                payload: { key },
            });
        },
        []
    );

    const chooseColor = useCallback(
        (row, col) => {
            const index = row * cols + col;
            const board = state.board;
            let color = 'inherit';

            if (index in board) {
                if (board[index] > 0)
                    color = COLORS.primary.dark; // Snake body - dark blue
                else color = 'hsl(217, 91%, 25%)'; // Food - much darker blue shade
            }

            return {
                backgroundColor: color,
                boxShadow:
                    color !== 'inherit' ? `0 0 1.25rem ${color}40` : 'none', // 20px
                border:
                    color !== 'inherit' ? `0.0625rem solid ${color}` : 'none', // 1px
            };
        },
        [state, cols]
    );

    useEffect(() => {
        const wrapDispatch = () =>
            dispatch({
                type: 'move',
            });

        const wrapDirection = event =>
            dispatch({
                type: 'steer',
                payload: event,
            });

        createTimer({ repeat: wrapDispatch });
        createKeys(wrapDirection);
    }, [createTimer, createKeys]);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: { rows, cols },
        });
    }, [rows, cols]);

    useEffect(() => {
        document.title = 'Snake | Bangyen';
    }, []);

    return (
        <Grid
            container
            height="100vh"
            flexDirection="column"
            position="relative"
            sx={{
                background: COLORS.background.default,
                overflow: 'hidden',
            }}
        >
            <Grid
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ zIndex: 1 }}
            >
                <CustomGrid
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={chooseColor}
                />
            </Grid>
            <Controls handler={controlHandler} />
        </Grid>
    );
}
