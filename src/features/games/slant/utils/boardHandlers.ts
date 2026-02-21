import { findCycles, hasCycle } from './cycleDetection';
import { generatePuzzle } from './generation';
import type { SlantState, SlantAction, CellState } from '../types';
import { EMPTY, FORWARD, BACKWARD } from '../types';
import {
    calculateNumbers,
    getErrorNodes,
    getSatisfiedNodes,
} from './validation';

import { validateGridSize } from '@/features/games/types/types';
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

        if (action.type === 'applyAnalysis') {
            if (!action.moves) return state;

            const newGrid = Array.from(
                { length: state.rows },
                () => new Array(state.cols).fill(EMPTY) as CellState[],
            );
            action.moves.forEach((val, pos) => {
                const [r, c] = pos.split(',').map(Number);
                if (r !== undefined && c !== undefined) {
                    const row = newGrid[r];
                    if (row !== undefined) {
                        row[c] = val;
                    }
                }
            });

            return {
                ...state,
                ...getValidationState(
                    newGrid,
                    state.numbers,
                    state.rows,
                    state.cols,
                ),
                grid: newGrid,
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

        return {
            ...state,
            ...getValidationState(
                newGrid,
                state.numbers,
                state.rows,
                state.cols,
            ),
            grid: newGrid,
        };
    },
});

function getValidationState(
    grid: CellState[][],
    numbers: (number | null)[][],
    rows: number,
    cols: number,
) {
    const isFull = grid.every(r => r.every(c => c !== EMPTY));
    let solved = false;

    if (isFull) {
        const currentNumbers = calculateNumbers(grid, rows, cols);
        const numbersMatch = numbers.every((rowArr, r) =>
            rowArr.every(
                (val, c) => val == null || val === currentNumbers[r]?.[c],
            ),
        );

        if (numbersMatch && !hasCycle(grid, rows, cols)) {
            solved = true;
        }
    }

    const errorNodes = getErrorNodes(grid, numbers, rows, cols);
    const cycleCells = findCycles(grid, rows, cols);
    const satisfiedNodes = getSatisfiedNodes(grid, numbers, rows, cols);

    return {
        solved,
        errorNodes,
        cycleCells,
        satisfiedNodes,
    };
}

export function getInitialState(rows: number, cols: number): SlantState {
    validateGridSize(rows);
    validateGridSize(cols);
    const { numbers, solution } = generatePuzzle(rows, cols);
    return {
        grid: Array.from(
            { length: rows },
            () => new Array(cols).fill(EMPTY) as CellState[],
        ),
        numbers,
        solution,
        rows,
        cols,
        solved: false,
        errorNodes: new Set(),
        cycleCells: new Set(),
        satisfiedNodes: new Set(),
    };
}
