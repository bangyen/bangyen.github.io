import { getState, cleanInput, SuffolkState } from '../Suffolk';

describe('Suffolk Interpreter Logic', () => {
    const initialState: SuffolkState = {
        register: 0,
        pointer: 0,
        output: '',
        index: 0,
        tape: [0],
        end: false,
        code: '><!,.',
    };

    describe('cleanInput', () => {
        it('removes invalid characters', () => {
            expect(cleanInput('a>b<c!d,e.f')).toBe('><!,.');
        });
    });

    describe('getState', () => {
        it('handles > (move pointer/expand tape)', () => {
            let state = { ...initialState, code: '>' };
            state = getState(state);
            expect(state.pointer).toBe(1);
            expect(state.tape).toEqual([0, 0]);
        });

        it('handles < (add to register/reset pointer)', () => {
            let state = {
                ...initialState,
                code: '<',
                tape: [0, 5],
                pointer: 1,
                register: 10,
            };
            state = getState(state);
            expect(state.register).toBe(15);
            expect(state.pointer).toBe(0);
        });

        it('handles ! (subtract and reset)', () => {
            let state = {
                ...initialState,
                code: '!',
                tape: [0, 10],
                pointer: 1,
                register: 5,
            };
            state = getState(state);
            expect(state.tape[1]).toBe(6); // 10 - (5-1)
            expect(state.register).toBe(0);
            expect(state.pointer).toBe(0);
        });

        it('handles ! with floor at 0', () => {
            let state = {
                ...initialState,
                code: '!',
                tape: [0, 2],
                pointer: 1,
                register: 10,
            };
            state = getState(state);
            expect(state.tape[1]).toBe(0);
        });

        it('handles , (input)', () => {
            window.prompt = jest.fn().mockReturnValue('A');
            let state = { ...initialState, code: ',' };
            state = getState(state);
            expect(state.register).toBe(65);
            expect(window.prompt).toHaveBeenCalled();
        });

        it('handles , with no input', () => {
            window.prompt = jest.fn().mockReturnValue(null);
            let state = { ...initialState, code: ',' };
            state = getState(state);
            expect(state.register).toBe(0);
        });

        it('handles . (output)', () => {
            let state = { ...initialState, code: '.', register: 66 };
            state = getState(state);
            expect(state.output).toBe('A'); // 66 - 1 = 65 ('A')
        });

        it('reaches end of code', () => {
            let state = { ...initialState, code: '>', index: 1 };
            state = getState(state);
            expect(state.end).toBe(true);
            expect(state.index).toBe(0);
        });
    });
});
