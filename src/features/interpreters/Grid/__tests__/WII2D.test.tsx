import { getState } from '../WII2D';
import { gridMove } from '../../utils/gridUtils';

jest.mock('../../utils/gridUtils', () => ({
    gridMove: jest.fn((pos, vel, rows, cols) => pos + vel),
}));

describe('WII2D Interpreter', () => {
    const initialState = {
        grid: '          ',
        select: null,
        rows: 2,
        cols: 5,
        pause: false,
        velocity: 1,
        position: 0,
        output: '',
        register: 0,
        end: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('initializes position if null (find !)', () => {
        // Find !. Single ! -> valid.
        const state = { ...initialState, grid: '.!..', position: null };
        const newState = getState(state);
        expect(newState.position).toBe(2); // Index of ! (1) + velocity (1)
    });

    test('ends if ! not found or ambiguous', () => {
        // No !
        const state = { ...initialState, grid: '....', position: null };
        const newState = getState(state);
        expect(newState.end).toBe(true);

        // Double !
        const stateDouble = { ...initialState, grid: '!.!.', position: null };
        const newStateDouble = getState(stateDouble);
        expect(newStateDouble.end).toBe(true);
    });

    test('handles arrows for velocity', () => {
        // Arrows: ^ < > v
        // ^: index 0. vel = 0%2 + 1 = 1. index<2 -> vel -= 3 -> -2?
        // ^ at index 0 of arrows string? No, arrows="^<>v". 
        // ^ is index 0. vel = 1. -> -2.
        // < is index 1. vel = 2. -> -1.
        // > is index 2. vel = 1.
        // v is index 3. vel = 2.

        let state = { ...initialState, grid: '>', position: 0 };
        let newState = getState(state);
        expect(newState.velocity).toBe(1);

        state = { ...initialState, grid: 'v', position: 0 };
        newState = getState(state);
        expect(newState.velocity).toBe(2);

        state = { ...initialState, grid: '<', position: 0 };
        newState = getState(state);
        expect(newState.velocity).toBe(-1);

        state = { ...initialState, grid: '^', position: 0 };
        newState = getState(state);
        expect(newState.velocity).toBe(-2);
    });

    test('handles arithmetic + - * / s', () => {
        const state = { ...initialState, position: 0, register: 4 };

        // +
        expect(getState({ ...state, grid: '+' }).register).toBe(5);
        // -
        expect(getState({ ...state, grid: '-' }).register).toBe(3);
        // *
        expect(getState({ ...state, grid: '*' }).register).toBe(8);
        // /
        expect(getState({ ...state, grid: '/' }).register).toBe(2);
        // s (square)
        expect(getState({ ...state, grid: 's' }).register).toBe(16);
    });

    test('handles register literals (digits)', () => {
        const state = { ...initialState, position: 0, grid: '5' };
        const newState = getState(state);
        expect(newState.register).toBe(5);
    });

    test('handles reverse |', () => {
        const state = { ...initialState, position: 0, grid: '|', velocity: 2 };
        const newState = getState(state);
        expect(newState.velocity).toBe(-2);
    });

    test('handles output ~', () => {
        const state = { ...initialState, position: 0, grid: '~', register: 65, output: '' };
        const newState = getState(state);
        expect(newState.output).toBe('A');
    });

    test('handles random ?', () => {
        const originalRandom = Math.random;
        Math.random = () => 0; // value 0
        const state = { ...initialState, position: 0, grid: '?' };
        const newState = getState(state);
        // rand 0 -> floor 0. vel = 0 - 2 + (0>1?1:0) = -2.
        expect(newState.velocity).toBe(-2);
        Math.random = originalRandom;
    });

    test('handles end .', () => {
        const state = { ...initialState, position: 0, grid: '.' };
        const newState = getState(state);
        expect(newState.end).toBe(true);
        expect(newState.position).toBeNull();
    });

    test('handles warp @', () => {
        // Warp logic: find closest @ in grid.
        // grid: '@..@'. cols=4.
        // pos 0: @.
        // getClosest finds target. then pos -= cols. then loop.
        // Logic is complex, depends on getDistance.
        // Mocking grid utils logic is hard if we assume linear mocks.
        // But WII2D imports getClosest? No, it defines it internally.

        // Test: simple case.
        // Grid: '@  @'. cols=4.
        // Position 0. Target is Position 3?
        // dist(0, 3, 4).
        // 0: (0,0). 3: (3,0).
        // dist = 0 + 3 = 3.

        // Logic: warp.push(k). sort by distance. return warp[1] (closest non-self).

        const state = {
            ...initialState,
            grid: '@   @', // index 0 and 4.
            rows: 1,
            cols: 5,
            position: 0
        };
        // closest to 0 is 4.
        // newPos = 4 - cols(5) = -1.
        // check negative: -1 + rows*cols(5) = 4.
        // Result 4.

        const newState = getState(state);
        expect(newState.position).toBe(4);
    });

    test('handles warp @ with single @ (no jump)', () => {
        const state = {
            ...initialState,
            grid: '@',
            rows: 1,
            cols: 1,
            position: 0
        };
        // Only 1 @. getClosest returns position (0).
        // Then position -= cols (1) -> -1.
        // Check bounds: -1 < 0 -> += rows*cols (1) -> 0.
        // Net result: 0.
        const newState = getState(state);
        expect(newState.position).toBe(0);
    });
});

// Component Test
import React from 'react';
import { render, screen } from '@testing-library/react';
import WII2DEditor from '../WII2D';

jest.mock('../GridEditor', () => ({
    __esModule: true,
    default: () => <div data-testid="grid-editor-mock" />,
}));

describe('WII2D Component', () => {
    test('renders GridEditor', () => {
        render(<WII2DEditor />);
        expect(screen.getByTestId('grid-editor-mock')).toBeInTheDocument();
    });
});
