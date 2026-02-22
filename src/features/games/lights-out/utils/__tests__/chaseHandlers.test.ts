// @vitest-environment node
import { vi, type Mock } from 'vitest';

import * as boardHandlers from '../boardHandlers';
import {
    chaseLights,
    fillRow,
    extendBack,
    getStates,
    handleChase,
    getCalculator,
} from '../chaseHandlers';
import * as matrices from '../matrices';

// Mock getProduct from matrices
vi.mock('../matrices', () => ({
    getProduct: vi.fn(),
}));

describe('Lights Out Chase Handlers', () => {
    const mockProduct = matrices.getProduct as Mock;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('chaseLights', () => {
        it('chases lights down properly', () => {
            // 3x3 grid
            // (0,1) is ON.
            const grid = boardHandlers.getGrid(3);
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

    describe('chaseLights - edge cases', () => {
        it('handles grid with all zeros (no lights on)', () => {
            const grid = boardHandlers.getGrid(3);
            const states = chaseLights([grid], 3);

            expect(states.length).toBeGreaterThanOrEqual(1);
            expect(states[0]).toEqual(grid);
        });

        it('handles grid with lights only in last row', () => {
            const grid = boardHandlers.getGrid(3);
            grid[2] = 7; // All bits set in last row
            const states = chaseLights([grid], 3);

            // Last row shouldn't be chased (no more rows below)
            expect(states[0]).toEqual(grid);
        });

        it('handles grid with undefined rows gracefully', () => {
            const grid = boardHandlers.getGrid(3);
            grid[1] = undefined as unknown as number;

            const states = chaseLights([grid], 3);
            expect(states).toBeDefined();
        });
    });

    describe('fillRow - edge cases', () => {
        it('handles row with value 0 (no bits set)', () => {
            mockProduct.mockReturnValue([0, 0, 0]);

            const { input, output } = fillRow([0, 0, 0], 3);

            expect(input.length).toBe(1); // Just blank
            expect(output.length).toBe(1); // Just blank
        });

        it('handles row with all bits set', () => {
            mockProduct.mockReturnValue([1, 1, 1]);

            const { input, output } = fillRow([1, 1, 1], 3);

            expect(input.length).toBe(4); // blank + 3 steps
            expect(output.length).toBe(4);
            expect(mockProduct).toHaveBeenCalledTimes(3);
        });
    });

    describe('getStates - complex scenarios', () => {
        it('returns early when chaseLights returns empty', () => {
            mockProduct.mockReturnValue([0, 0, 0]);

            // getStates builds grid from input indices, then chases
            const result = getStates([], 3);

            // Empty grid input should still process
            expect(result.boardStates).toBeDefined();
            expect(result.inputStates).toBeDefined();
            expect(result.outputStates).toBeDefined();
        });

        it('returns early when top array is empty', () => {
            mockProduct.mockReturnValue([]); // Empty product

            const result = getStates([0], 3);

            // Should handle gracefully
            expect(result).toHaveProperty('boardStates');
        });

        it('handles case where top has all zero values', () => {
            mockProduct.mockReturnValue([0, 0, 0]);

            const grid = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // All zeros
            const result = getStates(grid, 3);

            expect(result.boardStates).toBeDefined();
        });

        it('handles large grid (7x7)', () => {
            mockProduct.mockReturnValue(
                Array.from({ length: 7 }).fill(0) as number[],
            );

            const result = getStates([], 7);

            expect(result.boardStates).toBeDefined();
            expect(result.inputStates).toBeDefined();
            expect(result.outputStates).toBeDefined();
        });

        it('handles top row with set bits during final processing', () => {
            // Mock product to return row with some bits set
            mockProduct.mockReturnValue([1, 0, 1]);

            const result = getStates([], 3);

            expect(result.boardStates.length).toBeGreaterThan(0);
        });

        it('handles empty last row mask gracefully', () => {
            // Mock getGrid/flipAdj/chaseLights implicitly by giving small dims
            const result = getStates([], 0); // dims = 0
            expect(result.boardStates).toEqual([[]]);
        });

        it('handles undefined last state in getStates', () => {
            // This is hard to hit because getGrid always returns an array
            // But we can test it by passing large dims that might cause issues?
            // Or just check that it doesn't crash if mocks were used.
            // Actually line 88 is: if (!last) return ...
            // getStates calls chaseLights([board], dims)
            // chaseLights([board], dims) returns [board, ...]
            // so states.at(-1) is at least board.
            // If board is empty? getGrid(0,0) returns []
            // chaseLights([], 0) returns []
            // then states.at(-1) is undefined.
            const result = getStates([], 0);
            expect(result.boardStates).toEqual([[]]);
        });
    });
});
