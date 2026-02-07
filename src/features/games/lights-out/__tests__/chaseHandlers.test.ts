import {
    chaseLights,
    fillRow,
    extendBack,
    getStates,
    handleChase,
    getCalculator,
} from '../chaseHandlers';
import * as matrices from '../matrices';
import * as boardHandlers from '../boardHandlers';

// Mock getProduct from matrices
jest.mock('../matrices', () => ({
    getProduct: jest.fn(),
}));

describe('Lights Out Chase Handlers', () => {
    const mockProduct = matrices.getProduct as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('chaseLights', () => {
        it('chases lights down properly', () => {
            // 3x3 grid
            // (0,1) is ON.
            const grid = boardHandlers.getGrid(3, 3);
            grid[0] = 2; // (0,1) ON

            const states = chaseLights([grid], 3);

            // Expected:
            // State 0: Initial
            // State 1: After pressing (1,1) to clear (0,1)
            // (1,1) toggles (0,1), (1,0), (1,1), (1,2), (2,1).

            expect(states.length).toBeGreaterThan(1);
            const nextState = states[1];
            // (0,1) should be OFF in next state
            expect((nextState![0]! >> 1) & 1).toBe(0);
        });

        it('returns original states if empty', () => {
            expect(chaseLights([], 3)).toEqual([]);
        });
    });

    describe('fillRow', () => {
        it('calls getProduct for each set bit in row', () => {
            mockProduct.mockReturnValue([0, 0, 0]);

            // Row with middle bit set: 2 (binary 010)
            const { input, output } = fillRow([0, 1, 0], 3);

            // Should call getProduct with [0, 1, 0] (as the "input" row built step-by-step)
            // fillRow iterates col 0..2.
            // c=0: skip
            // c=1: set last[1]=1. input=[0,1,0]. call getProduct.
            // c=2: skip

            expect(mockProduct).toHaveBeenCalledTimes(1);
            expect(mockProduct).toHaveBeenCalledWith([0, 1, 0], 3, 3);

            expect(input.length).toBe(2); // Initial blank + 1 step
            expect(output.length).toBe(2);
        });
    });

    describe('extendBack', () => {
        it('extends states array to size', () => {
            const states = [[1], [2]];
            const extended = extendBack(states, 5);
            expect(extended.length).toBe(5);
            expect(extended[2]).toEqual([2]);
            expect(extended[4]).toEqual([2]);
        });
    });

    describe('getStates', () => {
        it('integrates components to solve board', () => {
            // Mock getProduct to return identity for simplicity or 0
            mockProduct.mockReturnValue([0, 0, 0]);

            const grid = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Empty
            const result = getStates(grid, 3);

            expect(result.boardStates).toBeDefined();
            expect(result.inputStates).toBeDefined();
            expect(result.outputStates).toBeDefined();
        });

        it('handles case with no solution gracefully', () => {
            // Force chaseLights to return empty or invalid?
            // hard to force without mocking chaseLights but we can pass invalid grid logic if needed
            // Actually getStates handles empty returns from internals

            getStates([], 3); // invalid grid size likely
            // getGrid will make 3x3. grid loop will fail if empty?
            // no, grid loop iterates over empty array.
            // then calls chaseLights on empty board.
        });
    });

    describe('handleChase', () => {
        it('calls getStates for chase action', () => {
            mockProduct.mockReturnValue([0, 0, 0]);
            const action = { type: 'chase', dims: 3, grid: [] };
            const result = handleChase({}, action);
            expect(result).toHaveProperty('boardStates');
        });

        it('returns state for unknown action', () => {
            const state = { foo: 'bar' };
            const result = handleChase(state, { type: 'unknown' });
            expect(result).toBe(state);
        });
    });

    describe('getCalculator', () => {
        it('returns a calculator function', () => {
            const calc = getCalculator(3, 3, 3);
            expect(typeof calc).toBe('function');

            mockProduct.mockReturnValue([0, 0, 0]);
            const res = calc([0, 0, 0]);
            expect(res).toBeDefined();
        });
    });
});
