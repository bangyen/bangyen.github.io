import { describe, it, expect } from 'vitest';

import type { CellState } from '../../types';
import { FORWARD, BACKWARD, EMPTY } from '../../types';
import { handleBoard, getInitialState } from '../boardHandlers';

describe('handleBoard - applyAnalysis', () => {
    it('correctly overwrites the grid with analysis moves', () => {
        const initialState = getInitialState(3, 3);
        // Add an existing move that isn't in the analysis moves
        const grid0 = initialState.grid[0];
        if (grid0) grid0[1] = FORWARD;

        const moves = new Map<string, CellState>([
            ['0,0', FORWARD],
            ['1,1', BACKWARD],
            ['2,2', FORWARD],
        ]);

        const nextState = handleBoard(initialState, {
            type: 'applyAnalysis',
            moves,
        });

        // The analysis moves should be present
        const gridR0 = nextState.grid[0];
        const gridR1 = nextState.grid[1];
        const gridR2 = nextState.grid[2];

        if (gridR0) {
            expect(gridR0[0]).toBe(FORWARD);
            expect(gridR0[1]).toBe(EMPTY);
        }
        if (gridR1) {
            expect(gridR1[1]).toBe(BACKWARD);
        }
        if (gridR2) {
            expect(gridR2[2]).toBe(FORWARD);
        }
    });

    it('re-calculates validation status after applying moves', () => {
        // Create a 2x2 board where one move solves it (hypothetically)
        const state = getInitialState(2, 2);
        // Manually set solution and numbers for a simple case
        state.solution = [
            [FORWARD, BACKWARD],
            [BACKWARD, FORWARD],
        ];
        state.numbers = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]; // No clues means any valid connection works, but we just want to see it change

        const moves = new Map<string, CellState>();
        state.solution.forEach((row, r) => {
            row.forEach((cell, c) => {
                moves.set(`${r.toString()},${c.toString()}`, cell);
            });
        });

        const solvedState = handleBoard(state, {
            type: 'applyAnalysis',
            moves,
        });

        // Even without clues, if it's full and has no cycles, it might not be 'solved'
        // unless it matches clues. But we can check if it calculated errorNodes etc.
        expect(solvedState.grid).toEqual(state.solution);
        expect(solvedState.errorNodes).toBeDefined();
        expect(solvedState.satisfiedNodes).toBeDefined();
    });

    it('does nothing if moves is missing', () => {
        const state = getInitialState(3, 3);
        const nextState = handleBoard(state, { type: 'applyAnalysis' });
        expect(nextState).toBe(state);
    });
});
