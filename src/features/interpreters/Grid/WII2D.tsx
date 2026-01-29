import { gridMove } from '../utils/gridUtils';
import GridEditor from './GridEditor';
import React from 'react';

import { GridState } from './eventHandlers';

export interface WII2DState extends GridState {
    velocity: number;
    output: string;
    register: number;
    end: boolean;
    // position, grid, rows, cols are inherited
}

function getDistance(x: number, y: number, cols: number): number {
    let xPos = x;
    let yPos = y;
    const xWidth = xPos % cols;
    const yWidth = yPos % cols;
    xPos -= xWidth;
    yPos -= yWidth;

    const differ = Math.abs(xPos - yPos);
    const height = Math.floor(differ / cols);
    const width = Math.abs(xWidth - yWidth);

    return height + width;
}

function getComparison(position: number, cols: number) {
    return (x: number, y: number) =>
        getDistance(position, x, cols) - getDistance(position, y, cols);
}

function getClosest(position: number, grid: string, cols: number): number {
    const warp: number[] = [];

    for (let k = 0; k < grid.length; k++) if (grid[k] === '@') warp.push(k);

    if (warp.length === 1) return position;

    const compare = getComparison(position, cols);

    warp.sort(compare);
    return warp[1];
}

export function getState(state: WII2DState): WII2DState {
    const arrows = '^<>v';

    let { position, velocity, output, register, end } = state;
    const { grid, rows, cols } = state;

    if (end) return state;

    if (position == null) {
        const index = grid.indexOf('!');
        const double = grid.lastIndexOf('!');

        if (index === -1 || index !== double) return { ...state, end: true };

        position = index;
    }

    const char = grid[position];

    if (arrows.includes(char)) {
        const index = arrows.indexOf(char);
        velocity = (index % 2) + 1;

        if (index < 2) velocity -= 3;
    } else if (+char) {
        register = +char;
    }

    switch (char) {
        case '|':
            velocity *= -1;
            break;
        case '@':
            position = getClosest(position, grid, cols);
            position -= cols;

            if (position < 0) position += rows * cols;
            break;
        case '+':
            register++;
            break;
        case '-':
            register--;
            break;
        case '*':
            register *= 2;
            break;
        case 's':
            register *= register;
            break;
        case '/':
            register = Math.floor(register / 2);
            break;
        case '~':
            output += String.fromCharCode(register);
            break;
        case '?': {
            const rand = Math.random() * 4;
            const floor = Math.floor(rand);
            velocity = floor - 2 + (floor > 1 ? 1 : 0);
            break;
        }
        case '.':
            position = null;
            end = true;
            break;
        default:
            break;
    }

    if (position !== null && char !== '@')
        position = gridMove(position, velocity, rows, cols);

    return {
        ...state,
        position,
        velocity,
        grid,
        output,
        register,
        end,
        rows,
        cols,
    };
}

export default function Editor({
    navigation,
}: {
    navigation?: React.ReactNode;
}): React.ReactElement {
    const start: Partial<WII2DState> = {
        position: null,
        velocity: -2,
        end: false,
        output: '',
        register: 0,
    };

    return (
        <GridEditor<WII2DState>
            name="WII2D"
            start={start}
            runner={getState}
            output
            register
            navigation={navigation}
            keys={[
                '^',
                '<',
                '>',
                'v',
                '|',
                "'", // Added to keys
                '"', // Added to keys
                '@',
                '+',
                '-',
                '*',
                's',
                '/',
                '~',
                '?',
                '.',
                '!',
                '0',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
            ]}
        />
    );
}
