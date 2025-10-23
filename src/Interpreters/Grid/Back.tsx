import { gridMove } from '../../calculate';
import GridEditor from './GridEditor';
import React from 'react';

interface BackState {
    velocity: number;
    position: number | null;
    pointer: number;
    tape: number[];
    end: boolean;
    grid: string;
    rows: number;
    cols: number;
}

interface BackStart {
    velocity: number;
    pointer: number;
    position: number;
    tape: number[];
    end: boolean;
}

function getState(state: BackState): BackState {
    let { velocity, position, pointer, tape, end } = state;
    const { grid, rows, cols } = state;

    if (end || position === null) return state;

    const sum = velocity > 0 ? 3 : -3;
    const char = grid[position];
    tape = [...tape];

    switch (char) {
        case '\\':
            velocity = sum - velocity;
            break;
        case '/':
            velocity -= sum;
            break;
        case '<':
            if (pointer) pointer--;
            break;
        case '>':
            if (++pointer === tape.length) tape.push(0);
            break;
        case '-':
            tape[pointer] ^= 1;
            break;
        case '+':
            let next: string;

            if (!tape[pointer])
                do {
                    position = gridMove(position, velocity, rows, cols);

                    next = grid[position];
                } while (!'\\/<>-+*'.includes(next));
            break;
        case '*':
            position = null;
            end = true;
            break;
        default:
            break;
    }

    if (position !== null) position = gridMove(position, velocity, rows, cols);

    return {
        velocity,
        position: position ?? 0,
        pointer,
        grid,
        tape,
        rows,
        cols,
        end,
    };
}

export default function Editor(): React.ReactElement {
    const start: BackStart = {
        velocity: 1,
        pointer: 0,
        position: 0,
        tape: [0],
        end: false,
    };

    return <GridEditor name="Back" start={start} runner={getState} tape />;
}

