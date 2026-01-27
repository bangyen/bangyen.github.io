import { gridMove } from '../utils/gridUtils';
import GridEditor from './GridEditor';
import React from 'react';

import { GridState } from './eventHandlers';

interface BackState extends GridState {
    velocity: number;
    pointer: number;
    tape: number[];
    end: boolean;
    // position, grid, rows, cols are inherited from GridState
}

export function getState(state: BackState): BackState {
    let { velocity, position, pointer, tape } = state;
    const { grid, rows, cols, end } = state;

    if (end || position == null) return state;

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
        case '+': {
            let next: string;

            if (!tape[pointer])
                do {
                    position = gridMove(position, velocity, rows, cols);

                    if (position != null) next = grid[position];
                    else next = '';
                } while (!'\\/<>-+*'.includes(next));
            break;
        }
        default:
            break;
    }

    if (position !== null) position = gridMove(position, velocity, rows, cols);

    return {
        ...state,
        velocity,
        position,
        pointer,
        grid,
        tape,
        rows,
        cols,
        end,
    };
}

export default function Editor({
    navigation,
}: {
    navigation?: React.ReactNode;
}): React.ReactElement {
    const start: Partial<BackState> = {
        velocity: 1,
        pointer: 0,
        position: 0,
        tape: [0],
        end: false,
    };

    return (
        <GridEditor<BackState>
            name="Back"
            start={start}
            runner={getState}
            tape
            navigation={navigation}
            keys={['\\', '/', '<', '>', '-', '+', '*']}
        />
    );
}
