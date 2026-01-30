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

    // Collision Avoidance: If next move hits body, try to find a random safe turn
    const nextPos = gridMove(head, velocity, rows, cols);
    if (board[nextPos] && board[nextPos] > 0) {
        const potentialMoves = [-2, 2, -1, 1]; // Up, Down, Left, Right
        const validMoves: number[] = [];

        for (const move of potentialMoves) {
            // Can't reverse and no point trying the same blocked path
            if (move === -velocity || move === velocity) continue;

            const checkPos = gridMove(head, move, rows, cols);
            // Safe if empty (undefined) or food (-1)
            // Note: board already has tail reduced by mapBoard above
            if (board[checkPos] === undefined || board[checkPos] < 0) {
                validMoves.push(move);
            }
        }

        if (validMoves.length > 0) {
            velocity =
                validMoves[Math.floor(Math.random() * validMoves.length)];
        }
    }

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

            // Check for diagonal keys
            const isDiagonal = [
                'NorthWest',
                'NorthEast',
                'SouthWest',
                'SouthEast',
            ].includes(payload.key as string);

            if (isDiagonal) {
                // Determine components based on key name
                const key = payload.key as string;
                const up = -2;
                const down = 2;
                const left = -1;
                const right = 1;

                let first = 0;
                let second = 0;

                if (key === 'NorthWest') {
                    first = up;
                    second = left;
                } else if (key === 'NorthEast') {
                    first = up;
                    second = right;
                } else if (key === 'SouthWest') {
                    first = down;
                    second = left;
                } else if (key === 'SouthEast') {
                    first = down;
                    second = right;
                }

                // Get current actual direction (last in buffer or current velocity)
                const current =
                    buffer.length > 0
                        ? buffer[buffer.length - 1]
                        : state.velocity;

                // If moving vertical (up/down +/-2)
                // If moving vertical (up/down +/-2)
                if (Math.abs(current) === 2) {
                    if (current === first) {
                        // Already moving in 'first' direction. Queue 'second' then 'first' (step).
                        buffer = [...buffer, second, first];
                    } else if (current === -first) {
                        // Moving opposite to 'first'. Can't switch to 'first' immediately.
                        // Must turn to 'second', then 'first'.
                        buffer = [...buffer, second, first];
                    }
                } else {
                    // Moving horizontal (left/right +/-1)
                    // If moving Left, press Up-Left (NorthWest):
                    // Already moving Left (second). Queue Up (first).

                    if (current === second) {
                        // Already moving in 'second' direction. Queue 'first' then 'second' (step).
                        buffer = [...buffer, first, second];
                    } else if (current === -second) {
                        // Moving Right, want Up-Left.
                        // Turn Up (first), then Left (second).
                        buffer = [...buffer, first, second];
                    }
                }

                // Handle the case where we are stopped (0)
                if (current === 0) {
                    // Can start with either? Let's favor first (vertical) then second?
                    // Or just first. Snake usually starts moving in one dir.
                    // Let's queue first.
                    buffer = [...buffer, first];
                }
            } else {
                if (velocity) buffer = [...buffer, velocity];
            }

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
