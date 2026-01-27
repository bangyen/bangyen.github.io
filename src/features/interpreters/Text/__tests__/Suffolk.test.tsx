import { render, screen } from '@testing-library/react';
import React from 'react';
import Suffolk, { cleanInput, getState, SuffolkState } from '../Suffolk';

// Mock TextEditor to avoid full rendering logic
jest.mock('../TextEditor', () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => (
        <div data-testid="text-editor">{name}</div>
    ),
}));

describe('Suffolk Interpreter Logic', () => {
    describe('cleanInput', () => {
        test('removes invalid characters', () => {
            expect(cleanInput('abc>def<ghi!jkl,mno.pqr')).toBe('><!,.');
        });

        test('handles empty input', () => {
            expect(cleanInput('')).toBe('');
        });
    });

    describe('getState', () => {
        const initialState: SuffolkState = {
            register: 0,
            pointer: 0,
            output: '',
            index: 0,
            tape: [0],
            end: false,
            code: '><!,.',
        };

        test('handles > (increment pointer)', () => {
            const state = { ...initialState, code: '>' };
            const nextState = getState(state);
            expect(nextState.pointer).toBe(1);
            expect(nextState.tape).toHaveLength(2);
            expect(nextState.tape[1]).toBe(0);
        });

        test('handles < (add tape value to register and reset pointer)', () => {
            const state = {
                ...initialState,
                code: '<',
                tape: [5, 10],
                pointer: 1,
                register: 2,
            };
            const nextState = getState(state);
            expect(nextState.register).toBe(12); // 2 + 10
            expect(nextState.pointer).toBe(0);
        });

        test('handles ! (decrement tape, reset register and pointer)', () => {
            const state = {
                ...initialState,
                code: '!',
                tape: [20],
                pointer: 0,
                register: 5,
            };
            const nextState = getState(state);
            expect(nextState.tape[0]).toBe(16); // 20 - (5 - 1)
            expect(nextState.register).toBe(0);
            expect(nextState.pointer).toBe(0);
        });

        test('handles ! with negative result (clamped to 0)', () => {
            const state = {
                ...initialState,
                code: '!',
                tape: [2],
                pointer: 0,
                register: 5,
            };
            const nextState = getState(state);
            expect(nextState.tape[0]).toBe(0); // Clamped
        });

        test('handles . (output char if register > 0)', () => {
            const state = {
                ...initialState,
                code: '.',
                register: 66, // 'A' is 65, so 66 - 1 = 65
            };
            const nextState = getState(state);
            expect(nextState.output).toBe('A');
        });

        test('handles . with register 0 (no output)', () => {
            const state = {
                ...initialState,
                code: '.',
                register: 0,
            };
            const nextState = getState(state);
            expect(nextState.output).toBe('');
        });

        test('handles , (input - mock prompt)', () => {
            const originalPrompt = window.prompt;
            window.prompt = jest.fn().mockReturnValue('K');

            const state = { ...initialState, code: ',' };
            const nextState = getState(state);

            expect(window.prompt).toHaveBeenCalled();
            expect(nextState.register).toBe(75); // 'K'.charCodeAt(0)

            window.prompt = originalPrompt;
        });

        test('handles , with no input', () => {
            const originalPrompt = window.prompt;
            window.prompt = jest.fn().mockReturnValue('');

            const state = { ...initialState, code: ',' };
            const nextState = getState(state);

            expect(nextState.register).toBe(0);

            window.prompt = originalPrompt;
        });

        test('handles end of code', () => {
            const state = {
                ...initialState,
                index: 5,
                code: '><!,.',
                end: false,
            };
            const nextState = getState(state);
            expect(nextState.index).toBe(0);
            expect(nextState.end).toBe(true);
        });

        test('resets end flag if called while end is true', () => {
            const state = { ...initialState, index: 0, code: '>', end: true };
            const nextState = getState(state);
            expect(nextState.end).toBe(false);
            expect(nextState.pointer).toBe(1);
        });
    });

    describe('Editor Component', () => {
        test('renders TextEditor with correct name', () => {
            render(<Suffolk />);
            expect(screen.getByTestId('text-editor')).toHaveTextContent(
                'Suffolk'
            );
        });
    });
});
