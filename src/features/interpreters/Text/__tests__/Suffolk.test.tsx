import React from 'react';
import { render, screen } from '@testing-library/react';
import Suffolk, { getState, cleanInput, SuffolkState } from '../Suffolk';

// Mocks
jest.mock(
    '../TextEditor',
    () =>
        function MockTextEditor(props: any) {
            return (
                <div
                    data-testid="text-editor"
                    data-props={JSON.stringify(props)}
                />
            );
        }
);

describe('Suffolk', () => {
    describe('cleanInput', () => {
        test('removes non-command characters', () => {
            expect(cleanInput('abc>!<,.')).toBe('>!<,.');
            expect(cleanInput('')).toBe('');
        });
    });

    describe('getState', () => {
        const defaultState: SuffolkState = {
            register: 0,
            pointer: 0,
            output: '',
            index: 0,
            tape: [0],
            end: false,
            code: '><!,.',
        };

        test('handles > command', () => {
            const state = { ...defaultState, code: '>', index: 0 };
            const newState = getState(state);
            expect(newState.pointer).toBe(1);
            expect(newState.tape.length).toBe(2);
        });

        test('handles < command', () => {
            // register += tape[pointer], pointer = 0
            const state = {
                ...defaultState,
                code: '<',
                index: 0,
                tape: [0, 5],
                pointer: 1,
                register: 2,
            };
            const newState = getState(state);
            expect(newState.register).toBe(7);
            expect(newState.pointer).toBe(0);
        });

        test('handles ! command', () => {
            // tape[pointer] -= register - 1; if < 0 -> 0; reg=0; ptr=0
            const state = {
                ...defaultState,
                code: '!',
                index: 0,
                tape: [10],
                pointer: 0,
                register: 5,
            };
            const newState = getState(state);
            // 10 - (5 - 1) = 10 - 4 = 6
            expect(newState.tape[0]).toBe(6);
            expect(newState.register).toBe(0);
            expect(newState.pointer).toBe(0);
        });

        test('handles . command', () => {
            // output += char(reg-1) if reg > 0
            const state = {
                ...defaultState,
                code: '.',
                index: 0,
                register: 66,
            }; // 66-1 = 65 ('A')
            const newState = getState(state);
            expect(newState.output).toBe('A');
        });

        test('handles , command', () => {
            const promptSpy = jest.spyOn(window, 'prompt').mockReturnValue('A');
            const state = { ...defaultState, code: ',', index: 0 };
            const newState = getState(state);
            expect(newState.register).toBe(65);
            promptSpy.mockRestore();
        });

        test('handles , command with no input', () => {
            const promptSpy = jest
                .spyOn(window, 'prompt')
                .mockReturnValue(null);
            const state = {
                ...defaultState,
                code: ',',
                index: 0,
                register: 10,
            };
            const newState = getState(state);
            expect(newState.register).toBe(0);
            promptSpy.mockRestore();
        });

        test('handles end loop', () => {
            const state = { ...defaultState, code: '>', index: 1 };
            const newState = getState(state);
            expect(newState.index).toBe(0);
            expect(newState.end).toBe(true);
        });
    });

    describe('Component', () => {
        test('renders TextEditor with correct props', () => {
            render(<Suffolk />);
            const editor = screen.getByTestId('text-editor');
            const props = JSON.parse(editor.getAttribute('data-props') || '{}');
            expect(props.name).toBe('Suffolk');
        });
    });
});
