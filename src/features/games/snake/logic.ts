import { gridMove, getDirection } from '../../interpreters/utils/gridUtils';

export interface Board {
    [key: number]: number;
}

export interface SnakeState {
    velocity: number;
    buffer: number[];
    length: number;
    rows: number;
    cols: number;
    head: number;
    board: Board;
}

export type Action =
    | { type: 'resize'; payload: { rows: number; cols: number } }
    | { type: 'steer'; payload: { key: string } | KeyboardEvent }
    | { type: 'move'; payload?: never };

export function getRandom(max: number): number {
    return Math.floor(Math.random() * max);
}

export function addNext(max: number, exclude: Board): Board {
    let pos = getRandom(max);

    while (pos in exclude) if (++pos >= max) pos = 0;

    return {
        ...exclude,
        [pos]: -1,
    };
}

export function mapBoard(board: Board, change: number): Board {
    const newBoard: Board = {};

    for (const cell in board) {
        const value = board[cell];

        if (value + change > 0) newBoard[cell] = value + change;
        else if (value < 0) newBoard[cell] = value;
    }

    return newBoard;
}

export function handleResize(
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

export function reduceBoard(state: SnakeState): SnakeState {
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

export function handleAction(state: SnakeState, action: Action): SnakeState {
    switch (action.type) {
        case 'resize': {
            const { rows, cols } = action.payload;
            return handleResize(state, rows, cols);
        }
        case 'steer': {
            const { payload } = action;
            const velocity = getDirection(payload.key);
            let { buffer } = state;

            if (velocity) buffer = [...buffer, velocity];

            return {
                ...state,
                buffer,
            };
        }
        case 'move':
            return reduceBoard(state);
        default:
            return state;
    }
}
