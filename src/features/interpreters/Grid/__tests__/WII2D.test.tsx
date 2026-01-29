import { render, screen } from '@testing-library/react';
import React from 'react';
import WII2D, { getState, WII2DState } from '../WII2D';

// Mock GridEditor
jest.mock('../GridEditor', () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => (
        <div data-testid="grid-editor">{name}</div>
    ),
}));

describe('WII2D Interpreter Logic', () => {
    const initialState = {
        position: null,
        velocity: -2,
        output: '',
        register: 0,
        end: false,
        grid: ' '.repeat(25),
        rows: 5,
        cols: 5,
    };

    test('initializes position at ! if it only appears once', () => {
        const state = { ...initialState, grid: '    !                    ' };
        const nextState = getState(state as WII2DState);
        expect(nextState.position).toBe(24);
    });

    test('ends if ! appears multiple times or not at all', () => {
        const stateNoExcl = { ...initialState, grid: ' '.repeat(25) };
        expect(getState(stateNoExcl as WII2DState).end).toBe(true);

        const stateMultiExcl = {
            ...initialState,
            grid: '!!                       ',
        };
        expect(getState(stateMultiExcl as WII2DState).end).toBe(true);
    });

    test('handles arrows ^<>v', () => {
        const state = {
            ...initialState,
            grid: '>!                       ',
            position: 0,
            velocity: 1,
        };
        const next = getState(state as WII2DState);
        expect(next.velocity).toBe(1);

        next.grid = 'v!                       ';
        next.position = 0;
        const final = getState(next as WII2DState);
        expect(final.velocity).toBe(2);
    });

    test('handles | (velocity reverse)', () => {
        const state = {
            ...initialState,
            grid: '|!                       ',
            position: 0,
            velocity: 1,
        };
        const nextState = getState(state as WII2DState);
        expect(nextState.velocity).toBe(-1);
    });

    test('handles arithmetic and output', () => {
        const state = {
            ...initialState,
            grid: '+-*s/~!                  ',
            position: 0,
            register: 5,
        };

        let next = getState(state as WII2DState);
        expect(next.register).toBe(6); // +

        next.position = 1; // -
        next = getState(next as WII2DState);
        expect(next.register).toBe(5);

        next.position = 2; // *
        next = getState(next as WII2DState);
        expect(next.register).toBe(10);

        next.position = 3; // s
        next = getState(next as WII2DState);
        expect(next.register).toBe(100);

        next.position = 4; // /
        next = getState(next as WII2DState);
        expect(next.register).toBe(50);

        next.position = 5; // ~
        next = getState(next as WII2DState);
        expect(next.output).toBe(String.fromCharCode(50));
    });

    test('handles ? (random velocity)', () => {
        const state = {
            ...initialState,
            grid: '?!                       ',
            position: 0,
        };
        const nextState = getState(state as WII2DState);
        expect([-2, -1, 1, 2]).toContain(nextState.velocity);
    });

    test('handles @ (warp)', () => {
        const grid = '  @  ' + '     ' + '  @  ' + '     ' + ' !   ';
        const state = { ...initialState, grid, position: 12, cols: 5, rows: 5 };
        const nextState = getState(state as WII2DState);
        expect(nextState.position).toBe(22);
    });

    test('handles . (end)', () => {
        const state = {
            ...initialState,
            grid: '.!                       ',
            position: 0,
        };
        const nextState = getState(state as WII2DState);
        expect(nextState.end).toBe(true);
    });

    describe('Editor Component', () => {
        test('renders GridEditor with correct name', () => {
            render(<WII2D />);
            expect(screen.getByTestId('grid-editor')).toHaveTextContent(
                'WII2D'
            );
        });
    });
});
