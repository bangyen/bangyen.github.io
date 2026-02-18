import { findCycles, hasCycle } from './cycleDetection';
import { generatePuzzle } from './generation';
import type { SlantState, SlantAction, CellState } from '../types';
import { EMPTY, FORWARD, BACKWARD } from '../types';
import {
    calculateNumbers,
    getErrorNodes,
    getSatisfiedNodes,
} from './validation';

import { createGridSize } from '@/features/games/types';
import { createGameReducer } from '@/utils/gameUtils';

// Export everything from types for backward compatibility where needed,
// though moving to direct imports is preferred.
export * from '../types';
export { findCycles } from './cycleDetection';

export const handleBoard = createGameReducer<SlantState, SlantAction>({
    getInitialState,
    customHandler: (state, action) => {
        if (action.type === 'reset') {
            return {
                ...state,
                grid: Array.from(
                    { length: state.rows },
                    () => new Array(state.cols).fill(EMPTY) as CellState[],
                ),
                solved: false,
                errorNodes: new Set(),
                cycleCells: new Set(),
                satisfiedNodes: new Set(),
            };
        }

        if (action.type !== 'toggle') return null;

        if (state.solved) return state;

        const { row, col } = action;
        if (row === undefined || col === undefined) return state;

        const newGrid = state.grid.map(r => [...r]);
        const rowArr = newGrid[row];
        if (!rowArr) return state;

        const current = rowArr[col];
        if (current === undefined) return state;

        if (action.reverse) {
            rowArr[col] =
                current === EMPTY
                    ? FORWARD
                    : current === FORWARD
                      ? BACKWARD
                      : EMPTY;
        } else {
            rowArr[col] =
                current === EMPTY
                    ? BACKWARD
                    : current === BACKWARD
                      ? FORWARD
                      : EMPTY;
        }

        const isFull = newGrid.every(r => r.every(c => c !== EMPTY));
        let solved = false;

        if (isFull) {
            const currentNumbers = calculateNumbers(
                newGrid,
                state.rows,
                state.cols,
            );
            const numbersMatch = state.numbers.every((rowArr, r) =>
                rowArr.every(
                    (val, c) => val == null || val === currentNumbers[r]?.[c],
                ),
            );

            if (numbersMatch && !hasCycle(newGrid, state.rows, state.cols)) {
                solved = true;
            }
        }

        const errorNodes = getErrorNodes(
            newGrid,
            state.numbers,
            state.rows,
            state.cols,
        );
        const cycleCells = findCycles(newGrid, state.rows, state.cols);
        const satisfiedNodes = getSatisfiedNodes(
            newGrid,
            state.numbers,
            state.rows,
            state.cols,
        );

        return {
            ...state,
            grid: newGrid,
            solved,
            errorNodes,
            cycleCells,
            satisfiedNodes,
        };
    },
});

export function getInitialState(rows: number, cols: number): SlantState {
    const { numbers, solution } = generatePuzzle(rows, cols);
    return {
        grid: Array.from(
            { length: rows },
            () => new Array(cols).fill(EMPTY) as CellState[],
        ),
        numbers,
        solution,
        rows: createGridSize(rows),
        cols: createGridSize(cols),
        solved: false,
        errorNodes: new Set(),
        cycleCells: new Set(),
        satisfiedNodes: new Set(),
    };
}
