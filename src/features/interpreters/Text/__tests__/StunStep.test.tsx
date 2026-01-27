import { render, screen } from '@testing-library/react';
import React from 'react';
import StunStep, { clean, getState, StunStepState } from '../StunStep';

// Mock TextEditor
jest.mock('../TextEditor', () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => (
        <div data-testid="text-editor">{name}</div>
    ),
}));

describe('StunStep Interpreter Logic', () => {
    describe('clean', () => {
        test('removes invalid characters', () => {
            expect(clean('abc+def-ghi>jkl<mno')).toBe('+-><');
        });
    });

    describe('getState', () => {
        const initialState: StunStepState = {
            pointer: 0,
            index: 0,
            tape: [0],
            end: false,
            code: '+-><',
        };

        test('handles + (increment tape)', () => {
            const state = { ...initialState, code: '+' };
            const nextState = getState(state);
            expect(nextState.tape[0]).toBe(1);
        });

        test('handles - if tape[pointer] > 0', () => {
            const state = { ...initialState, code: '-', tape: [5] };
            const nextState = getState(state);
            expect(nextState.tape[0]).toBe(4);
        });

        test('does nothing on - if tape[pointer] is 0', () => {
            const state = { ...initialState, code: '-', tape: [0] };
            const nextState = getState(state);
            expect(nextState.tape[0]).toBe(0);
        });

        test('handles > if tape[pointer] > 0', () => {
            const state = { ...initialState, code: '>', tape: [1] };
            const nextState = getState(state);
            expect(nextState.pointer).toBe(1);
            expect(nextState.tape).toHaveLength(2);
            expect(nextState.tape[1]).toBe(1); // pushes 1 when expanding
        });

        test('handles > if tape[pointer] is 0 (does nothing)', () => {
            const state = { ...initialState, code: '>', tape: [0] };
            const nextState = getState(state);
            expect(nextState.pointer).toBe(0);
        });

        test('handles < if tape[pointer] > 0 and pointer > 0', () => {
            const state = {
                ...initialState,
                code: '<',
                tape: [1, 1],
                pointer: 1,
            };
            const nextState = getState(state);
            expect(nextState.pointer).toBe(0);
        });

        test('decrements pointer if char is not +-> and pointer > 0', () => {
            const state = {
                ...initialState,
                code: '<',
                tape: [0, 1],
                pointer: 1,
            };
            const nextState = getState(state);
            expect(nextState.pointer).toBe(0);
        });

        test('handles < if pointer is 0 (does nothing even if tape[0] > 0)', () => {
            const state = { ...initialState, code: '<', tape: [1], pointer: 0 };
            const nextState = getState(state);
            expect(nextState.pointer).toBe(0);
        });

        test('handles end of code', () => {
            const state = {
                ...initialState,
                index: 4,
                code: '+-><',
                end: false,
            };
            const nextState = getState(state);
            expect(nextState.index).toBe(0);
            expect(nextState.end).toBe(true);
        });

        test('stops if end is true and tape[pointer] is 0', () => {
            const state = { ...initialState, index: 0, tape: [0], end: true };
            const nextState = getState(state);
            expect(nextState).toEqual(state);
        });

        test('restarts if end is true but tape[pointer] is not 0', () => {
            const state = {
                ...initialState,
                index: 0,
                tape: [1],
                end: true,
                code: '+',
            };
            const nextState = getState(state);
            expect(nextState.end).toBe(false);
            expect(nextState.tape[0]).toBe(2);
        });
    });

    describe('Editor Component', () => {
        test('renders TextEditor with correct name', () => {
            render(<StunStep />);
            expect(screen.getByTestId('text-editor')).toHaveTextContent(
                'Stun Step'
            );
        });
    });
});
