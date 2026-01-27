import React from 'react';
import { render, screen } from '@testing-library/react';
import StunStep, { getState, clean, StunStepState } from '../StunStep';

// Mocks
jest.mock('../TextEditor', () => (props: any) => (
    <div data-testid="text-editor" data-props={JSON.stringify(props)} />
));

describe('StunStep', () => {
    describe('clean', () => {
        test('removes non-command characters', () => {
            expect(clean('abc+def-')).toBe('+-');
            expect(clean('<>')).toBe('<>');
            expect(clean('')).toBe('');
        });
    });

    describe('getState', () => {
        const defaultState: StunStepState = {
            pointer: 0,
            index: 0,
            tape: [0],
            end: false,
            code: '+-><',
        };

        test('handles + command', () => {
            const state = { ...defaultState, code: '+', index: 0 };
            const newState = getState(state);
            expect(newState.tape[0]).toBe(1);
            expect(newState.index).toBe(1);
        });

        test('handles - command', () => {
            // Need non-zero tape for - to work? Check logic:
            // if (char === '+') tape[pointer]++
            // else if (tape[pointer]) ...

            // So if tape[pointer] is 0, only + works.
            const state = { ...defaultState, code: '-', index: 0, tape: [1] };
            const newState = getState(state);
            expect(newState.tape[0]).toBe(0);
        });

        test('handles > command', () => {
            const state = { ...defaultState, code: '>', index: 0, tape: [1] };
            const newState = getState(state);
            expect(newState.pointer).toBe(1);
            expect(newState.tape.length).toBe(2);
        });

        test('handles < command (implicit if pointer > 0)', () => {
            // Logic: else if (pointer) pointer--
            // Needs implicit char? No, logic:
            // else if (char === '>') ...
            // else if (pointer) pointer--

            // Wait, looking at code:
            /*
            if (char === '+') { ... }
            else if (tape[pointer]) {
               if (char === '-') ...
               else if (char === '>') ...
               else if (pointer) pointer--;
            }
            */
            // So if char is NOT + or - or >, AND tape[pointer] is truthy, AND pointer > 0, then it moves left?
            // The code has `<` in allowed chars.
            // But logic doesn't explicitly check `<`.
            // So `<` falls into `else if (pointer) pointer--`.

            const state = { ...defaultState, code: '<', index: 0, tape: [1, 1], pointer: 1 };
            const newState = getState(state);
            expect(newState.pointer).toBe(0);
        });

        test('ignores commands if tape is 0 (except +)', () => {
            const state = { ...defaultState, code: '-', index: 0, tape: [0] };
            const newState = getState(state);
            expect(newState.tape[0]).toBe(0);
            expect(newState.index).toBe(1);
        });

        test('handles end of code (loop)', () => {
            const state = { ...defaultState, code: '+', index: 1 };
            const newState = getState(state);
            // index == code.length -> reset to 0, end = true
            expect(newState.index).toBe(0);
            expect(newState.end).toBe(true);
        });

        test('handles end (continue if tape not 0)', () => {
            const state = { ...defaultState, end: true, tape: [1] };
            const newState = getState(state);
            expect(newState.end).toBe(false);
            // Should verify it didn't process command yet? 
            // The function continues to process command after un-ending?
            // "if (end) { if (!tape) return; else end = false; }"
            // Then it continues.
        });
    });

    describe('Component', () => {
        test('renders TextEditor with correct props', () => {
            render(<StunStep />);
            const editor = screen.getByTestId('text-editor');
            const props = JSON.parse(editor.getAttribute('data-props') || '{}');
            expect(props.name).toBe('Stun Step');
            expect(props.tape).toBe(true);
        });
    });
});
