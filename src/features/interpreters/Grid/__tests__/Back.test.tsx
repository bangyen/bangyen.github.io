import { getState } from '../Back';
import { gridMove } from '../../utils/gridUtils';

// Mock gridUtils to control movement
jest.mock('../../utils/gridUtils', () => ({
    gridMove: jest.fn((pos, vel, rows, cols) => pos + vel), // Simple linear
}));

describe('Back Interpreter', () => {
    const initialState = {
        grid: '          ',
        select: null,
        rows: 2,
        cols: 5,
        pause: false,
        velocity: 1,
        pointer: 0,
        position: 0,
        tape: [0],
        end: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('handles basic movement (no command)', () => {
        const state = { ...initialState, grid: '.....', position: 0 };
        const newState = getState(state);
        // position 0, vel 1 -> newPos 1
        expect(newState.position).toBe(1);
    });

    test('handles end state', () => {
        const state = { ...initialState, end: true };
        const newState = getState(state);
        expect(newState).toBe(state);
    });

    test('handles reflect backslash \\', () => {
        // sum = vel>0 ? 3 : -3.
        // vel 1 -> sum 3. newVel = 3-1 = 2.
        const state = { ...initialState, grid: '\\.', velocity: 1 };
        const newState = getState(state);
        expect(newState.velocity).toBe(2);
        // And moves
        expect(newState.position).toBe(2); // 0 + 2
    });

    test('handles reflect slash /', () => {
        // sum = vel>0 ? 3 : -3.
        // vel 1 -> sum 3. newVel = 1-3 = -2.
        const state = { ...initialState, grid: '/.', velocity: 1 };
        const newState = getState(state);
        expect(newState.velocity).toBe(-2);
        expect(newState.position).toBe(-2); // 0 - 2
    });

    test('handles pointer operations < >', () => {
        // > increment
        let state = { ...initialState, grid: '>', pointer: 0, tape: [0] };
        let newState = getState(state);
        expect(newState.pointer).toBe(1);
        expect(newState.tape).toHaveLength(2); // grew

        // < decrement
        state = { ...initialState, grid: '<', pointer: 1, tape: [0, 0] };
        newState = getState(state);
        expect(newState.pointer).toBe(0);

        // < at 0 -> no change
        state = { ...initialState, grid: '<', pointer: 0 };
        newState = getState(state);
        expect(newState.pointer).toBe(0);
    });

    test('handles flip -', () => {
        const state = { ...initialState, grid: '-', tape: [0] };
        const newState = getState(state);
        expect(newState.tape[0]).toBe(1);

        const stateOne = { ...initialState, grid: '-', tape: [1] };
        const newStateOne = getState(stateOne);
        expect(newStateOne.tape[0]).toBe(0);
    });

    test('handles skip/jump +', () => {
        // +: if tape[pointer] is 0, skip until char in \/<>-+*
        // Mock gridMove to step by 1?
        // My mock gridMove above uses pos+vel.
        // grid: '+..-'. vel 1.
        // pos 0: +. tape 0.
        // loop:
        // move 0+1=1. grid[1]='.'. valid char? NO.
        // move 1+1=2. grid[2]='.'. valid? NO.
        // move 2+1=3. grid[3]='-'. valid? YES.
        // loop breaks at pos 3. (next is '-')
        // Then outside switch: position = gridMove(position, velocity) -> 3+1 = 4.

        // Implementation:
        // do { position = gridMove... next = grid[position] } while (!includes(next))
        // So loop ends when `next` IS in set.
        // position IS the position of the valid char.
        // Then after switch, it moves AGAIN.

        // Let's test.
        // Configure gridUtils to simulate steps properly.
        (gridMove as jest.Mock).mockImplementation((p, v) => p + v);

        const state = {
            ...initialState,
            grid: '+..-', // + at 0. - at 3.
            position: 0,
            velocity: 1,
            tape: [0]
        };
        const newState = getState(state);

        // It found '-' at 3.
        // Then moved again -> 4.
        expect(newState.position).toBe(4);
    });

    test('handles skip + logic when tape is 1', () => {
        // If tape is 1, no skip.
        const state = {
            ...initialState,
            grid: '+..-',
            position: 0,
            velocity: 1,
            tape: [1]
        };
        const newState = getState(state);
        // No loop.
        // Switch break.
        // Move -> 0+1 = 1.
        expect(newState.position).toBe(1);
    });
});

// Component Test
import React from 'react';
import { render, screen } from '@testing-library/react';
import BackEditor from '../Back';

jest.mock('../GridEditor', () => ({
    __esModule: true,
    default: () => <div data-testid="grid-editor-mock" />,
}));

describe('Back Component', () => {
    test('renders GridEditor', () => {
        render(<BackEditor />);
        expect(screen.getByTestId('grid-editor-mock')).toBeInTheDocument();
    });
});
