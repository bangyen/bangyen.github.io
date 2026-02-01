import { render, screen } from '@testing-library/react';
import React from 'react';
import Back, { getState, BackState } from '../Back';

// Mock GridEditor to avoid full rendering logic
jest.mock('../GridEditor', () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => (
        <div data-testid="grid-editor">{name}</div>
    ),
}));

describe('Back Interpreter Logic', () => {
    const initialState = {
        velocity: 1,
        position: 0,
        pointer: 0,
        tape: [0],
        end: false,
        grid: ' '.repeat(9),
        rows: 3,
        cols: 3,
    };

    test('handles \\ (velocity shift)', () => {
        const state = { ...initialState, grid: '\\        ', velocity: 1 };
        const nextState = getState(state as BackState);
        expect(nextState.velocity).toBe(2);
    });

    test('handles / (velocity decrement)', () => {
        const state = { ...initialState, grid: '/        ', velocity: 1 };
        const nextState = getState(state as BackState);
        expect(nextState.velocity).toBe(-2);
    });

    test('handles < and > (pointer move)', () => {
        const state = { ...initialState, grid: '>        ' };
        const next = getState(state as BackState);
        expect(next.pointer).toBe(1);
        expect(next.tape).toHaveLength(2);

        next.grid = '<        ';
        next.position = 0;
        const final = getState(next);
        expect(final.pointer).toBe(0);
    });

    test('handles - (xor current tape value)', () => {
        const state = { ...initialState, grid: '-        ', tape: [0] };
        const next = getState(state as BackState);
        expect(next.tape[0]).toBe(1);

        next.grid = '-        ';
        next.position = 0;
        const final = getState(next);
        expect(final.tape[0]).toBe(0);
    });

    test('handles + (conditional skip loop)', () => {
        const state = {
            ...initialState,
            grid: '+  *     ',
            tape: [0],
            velocity: 1,
            cols: 9,
            rows: 1,
        };
        const nextState = getState(state as BackState);
        expect(nextState.position).toBe(4);
    });

    test('returns immediately if end is true', () => {
        const state = { ...initialState, end: true };
        const nextState = getState(state as BackState);
        expect(nextState).toEqual(state);
    });

    describe('Editor Component', () => {
        test('renders GridEditor with correct name', () => {
            render(<Back />);
            expect(screen.getByTestId('grid-editor')).toHaveTextContent('Back');
        });
    });
});
