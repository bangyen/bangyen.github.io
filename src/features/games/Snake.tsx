import React, {
    useMemo,
    useCallback,
    useReducer,
    useEffect,
    useState,
    useRef,
} from 'react';
import { Grid } from '../../components/mui';

import {
    convertPixels,
    gridMove,
    getDirection,
} from '../interpreters/utils/gridUtils';
import { useWindow, useTimer, useKeys } from '../../hooks';
import { CustomGrid } from '../../components/ui/CustomGrid';
import { Controls, ArrowsButton } from '../../components/ui/Controls';
import { PAGE_TITLES } from '../../config/constants';
import { GAME_CONSTANTS } from './config/gameConfig';
import { COLORS, COMPONENT_VARIANTS } from '../../config/theme';

interface Board {
    [key: number]: number;
}

interface SnakeState {
    velocity: number;
    buffer: number[];
    length: number;
    rows: number;
    cols: number;
    head: number;
    board: Board;
}

interface Action {
    type: string;
    // eslint-disable-next-line
    payload?: any;
}

function getRandom(max: number): number {
    return Math.floor(Math.random() * max);
}

function addNext(max: number, exclude: Board): Board {
    let pos = getRandom(max);

    while (pos in exclude) if (++pos >= max) pos = 0;

    return {
        ...exclude,
        [pos]: -1,
    };
}

function mapBoard(board: Board, change: number): Board {
    const newBoard: Board = {};

    for (const cell in board) {
        const value = board[cell];

        if (value + change > 0) newBoard[cell] = value + change;
        else if (value < 0) newBoard[cell] = value;
    }

    return newBoard;
}

function handleResize(
    state: SnakeState,
    rows: number,
    cols: number
): SnakeState {
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

function reduceBoard(state: SnakeState): SnakeState {
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

function handleAction(state: SnakeState, action: Action): SnakeState {
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

export default function Snake(): React.ReactElement {
    const { create: createTimer } = useTimer(0);
    const { create: createKeys } = useKeys();

    const { height, width } = useWindow();
    const length = GAME_CONSTANTS.snake.initialLength;
    const size = GAME_CONSTANTS.snake.segmentSize;

    const [randomMovesEnabled, setRandomMovesEnabled] = useState(false);
    const randomMovesRef = useRef(false);

    const [showArrows, setShowArrows] = useState(false);

    const { rows, cols } = useMemo(
        () => convertPixels(size, height, width),
        [size, height, width]
    );

    const initial = useMemo(
        () => ({
            velocity: GAME_CONSTANTS.snake.initialVelocity,
            buffer: [],
            length,
            rows: 0,
            cols: 0,
            head: 0,
            board: {},
        }),
        [length]
    );

    const [state, dispatch] = useReducer(
        handleAction,
        handleResize(initial, rows, cols)
    );

    const controlHandler = useCallback(
        (event: string) => () => {
            const key = GAME_CONSTANTS.controls.arrowPrefix + event;

            dispatch({
                type: 'steer',
                payload: { key },
            });
        },
        []
    );

    const chooseColor = useCallback(
        (row: number, col: number) => {
            const index = row * cols + col;
            const board = state.board;
            let color = 'inherit';

            if (index in board) {
                if (board[index] > 0) color = COLORS.primary.main;
                else color = COLORS.primary.dark;
            }

            return {
                backgroundColor: color,
                boxShadow:
                    color !== 'inherit' ? `0 0 1.25rem ${color}40` : 'none',
                border:
                    color !== 'inherit' ? `0.0625rem solid ${color}` : 'none',
            };
        },
        [state, cols]
    );

    useEffect(() => {
        const wrapDispatch = () => {
            const directions = 'wasd';
            const index = getRandom(4);
            const key = directions[index];

            dispatch({
                type: 'move',
            });

            if (getRandom(2) && randomMovesRef.current) {
                dispatch({
                    type: 'steer',
                    payload: { key },
                });
            }
        };

        const wrapDirection = (event: KeyboardEvent) =>
            dispatch({
                type: 'steer',
                payload: event,
            });

        createTimer({ repeat: wrapDispatch, speed: 100 });
        createKeys(wrapDirection);
    }, [createTimer, createKeys]);

    useEffect(() => {
        randomMovesRef.current = randomMovesEnabled;
    }, [randomMovesEnabled]);

    useEffect(() => {
        dispatch({
            type: 'resize',
            payload: { rows, cols },
        });
    }, [rows, cols]);

    useEffect(() => {
        document.title = PAGE_TITLES.snake;
    }, []);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            position="relative"
            sx={{
                background: COLORS.surface.background,
                overflow: 'hidden',
            }}
        >
            <Grid
                flex={1}
                sx={{
                    ...COMPONENT_VARIANTS.flexCenter,
                    zIndex: 1,
                }}
            >
                <CustomGrid
                    size={size}
                    rows={rows}
                    cols={cols}
                    cellProps={chooseColor}
                />
            </Grid>
            <Controls
                handler={controlHandler}
                onRandom={() => setRandomMovesEnabled(!randomMovesEnabled)}
                randomEnabled={randomMovesEnabled}
                hide={showArrows}
                size="inherit"
            >
                <ArrowsButton
                    show={showArrows}
                    setShow={setShowArrows}
                    handler={controlHandler}
                />
            </Controls>
        </Grid>
    );
}
