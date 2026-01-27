import { getState, clean, StunStepState } from '../StunStep';

describe('Stun Step Interpreter Logic', () => {
    const initialState: StunStepState = {
        pointer: 0,
        index: 0,
        tape: [0],
        end: false,
        code: '+-><',
    };

    describe('clean', () => {
        it('removes invalid characters', () => {
            expect(clean('a+b-c>d<e')).toBe('+-><');
        });
    });

    describe('getState', () => {
        it('handles + (increment)', () => {
            let state = { ...initialState, code: '+' };
            state = getState(state);
            expect(state.tape[0]).toBe(1);
        });

        it('handles - (decrement)', () => {
            let state = { ...initialState, code: '-', tape: [5] };
            state = getState(state);
            expect(state.tape[0]).toBe(4);
        });

        it('handles > (move right/expand)', () => {
            let state = { ...initialState, code: '>', tape: [1] }; // Requires tape[pointer] to be truthy
            state = getState(state);
            expect(state.pointer).toBe(1);
            expect(state.tape).toEqual([1, 1]);
        });

        it('handles < (move left)', () => {
            let state = {
                ...initialState,
                code: '<',
                tape: [1, 1],
                pointer: 1,
            };
            state = getState(state);
            expect(state.pointer).toBe(0);
        });

        it('does nothing if tape[pointer] is 0 (except for +)', () => {
            let state = { ...initialState, code: '-', tape: [0] };
            state = getState(state);
            expect(state.tape[0]).toBe(0);
        });

        it('reaches end of code', () => {
            let state = { ...initialState, code: '+', index: 1 };
            state = getState(state);
            expect(state.end).toBe(true);
            expect(state.index).toBe(0);
        });

        it('stays at end if tape[pointer] is 0', () => {
            let state = { ...initialState, end: true, tape: [0] };
            state = getState(state);
            expect(state.end).toBe(true);
        });
    });
});
