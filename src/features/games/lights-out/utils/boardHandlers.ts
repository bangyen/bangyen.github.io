import { calculateSolutionVector } from '../../../../utils/math/gf2/gf2Operations';
import type { BoardState, BoardAction } from '../types';

import { validateGridSize } from '@/features/games/types';
import { createGameReducer } from '@/utils/gameUtils';

export const getGrid = (rows: number): number[] =>
    new Array<number>(rows).fill(0);

/**
 * Coordinate-based cell access.
 * Abstracts the bitwise row-major grid representation.
 */
export const getCellValue = (
    grid: number[],
    row: number,
    col: number,
): number => {
    const rowVal = grid[row];
    if (rowVal === undefined) return 0;
    return (rowVal >> col) & 1;
};

/**
 * Converts the bitmask grid to a standard 2D array.
 * Useful for the View layer to avoid manual bit-shifting.
 */
export const to2DGrid = (
    grid: number[],
    rows: number,
    cols: number,
): number[][] => {
    return Array.from({ length: rows }, (_, r) => {
        const rowVal = grid[r] ?? 0;
        return Array.from({ length: cols }, (_, c) => (rowVal >> c) & 1);
    });
};

const getBitMask = (col: number) => 1 << col;
const isBitSet = (rowVal: number, col: number) =>
    (rowVal & getBitMask(col)) !== 0;
const toggleBit = (rowVal: number, col: number) => rowVal ^ getBitMask(col);
const toggleRowMask = (rowVal: number, mask: number) => rowVal ^ mask;

export function toggleAdjacent(
    row: number,
    col: number,
    grid: number[],
    rows: number,
    cols: number,
): number[] {
    const newGrid = [...grid];

    // Toggle self and left/right
    let mask = getBitMask(col);
    if (col > 0) mask |= getBitMask(col - 1);
    if (col < cols - 1) mask |= getBitMask(col + 1);

    if (newGrid[row] !== undefined)
        newGrid[row] = toggleRowMask(newGrid[row], mask);

    // Toggle up
    if (row > 0) {
        const val = newGrid[row - 1];
        if (val !== undefined) newGrid[row - 1] = toggleBit(val, col);
    }

    // Toggle down
    if (row < rows - 1) {
        const val = newGrid[row + 1];
        if (val !== undefined) newGrid[row + 1] = toggleBit(val, col);
    }

    return newGrid;
}

function toggleAdjacentInPlace(
    row: number,
    col: number,
    grid: number[],
    rows: number,
    cols: number,
): void {
    let mask = getBitMask(col);
    if (col > 0) mask |= getBitMask(col - 1);
    if (col < cols - 1) mask |= getBitMask(col + 1);

    if (grid[row] !== undefined) grid[row] = toggleRowMask(grid[row], mask);

    if (row > 0) {
        const val = grid[row - 1];
        if (val !== undefined) grid[row - 1] = toggleBit(val, col);
    }

    if (row < rows - 1) {
        const val = grid[row + 1];
        if (val !== undefined) grid[row + 1] = toggleBit(val, col);
    }
}

export function isSolved(grid: number[]): boolean {
    return grid.every(row => row === 0);
}

function randomize(rows: number, cols: number): number[] {
    const grid = getGrid(rows);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() > 0.5) {
                toggleAdjacentInPlace(r, c, grid, rows, cols);
            }
        }
    }

    return grid;
}

function solveLastRow(
    rows: number,
    cols: number,
    lastRow: number,
): number[] | null {
    let solutionMask = 0;

    const input: number[] = [];
    for (let i = 0; i < cols; i++) {
        input.push(isBitSet(lastRow, i) ? 1 : 0);
    }

    const result = calculateSolutionVector(input, rows, cols);
    if (result) {
        for (const [idx, val] of result.entries()) {
            if (val) solutionMask |= getBitMask(idx);
        }
    }

    const indices: number[] = [];
    for (let c = 0; c < cols; c++) {
        if (isBitSet(solutionMask, c)) {
            indices.push(c);
        }
    }

    return indices.length > 0 ? indices : null;
}

export function getNextMove(
    grid: number[],
    rows: number,
    cols: number,
): { row: number; col: number }[] | null {
    const tempGrid = [...grid];
    const moves: { row: number; col: number }[] = [];

    for (let r = 0; r < rows - 1; r++) {
        const currentRow = tempGrid[r];
        if (currentRow === undefined) continue;
        for (let c = 0; c < cols; c++) {
            if (isBitSet(currentRow, c)) {
                moves.push({ row: r + 1, col: c });
                toggleAdjacentInPlace(r + 1, c, tempGrid, rows, cols);
            }
        }
    }

    if (moves.length > 0) {
        return moves;
    }

    const lastRow = tempGrid[rows - 1];
    if (lastRow !== undefined && lastRow !== 0) {
        const solution = solveLastRow(rows, cols, lastRow);
        if (solution && solution.length > 0) {
            return solution.map(col => ({ row: 0, col }));
        }
    }

    return null;
}

export function getInitialState(rows: number, cols: number): BoardState {
    validateGridSize(rows);
    validateGridSize(cols);
    return {
        grid: getGrid(rows),
        score: 0,
        rows,
        cols,
        initialized: false,
    };
}

export const boardReducer = createGameReducer<BoardState, BoardAction>({
    getInitialState,
    customHandler: (state, action) => {
        const { rows, cols } = state;

        switch (action.type) {
            case 'adjacent': {
                return {
                    ...state,
                    grid: toggleAdjacent(
                        action.row,
                        action.col,
                        state.grid,
                        rows,
                        cols,
                    ),
                };
            }
            case 'multi_adjacent': {
                const newGrid = [...state.grid];
                for (const { row: r, col: c } of action.moves) {
                    toggleAdjacentInPlace(r, c, newGrid, rows, cols);
                }
                return { ...state, grid: newGrid };
            }
            case 'random':
            case 'randomize': {
                return {
                    ...state,
                    grid: randomize(rows, cols),
                    initialized: true,
                };
            }
            case 'resize': {
                const { rows: r, cols: c } = action as {
                    rows: number;
                    cols: number;
                };
                return {
                    ...getInitialState(r, c),
                    grid: randomize(r, c),
                    initialized: true,
                };
            }
            case 'reset': {
                return {
                    ...getInitialState(rows, cols),
                    score: 0,
                    initialized: true,
                };
            }
            case 'new':
            case 'next': {
                return {
                    ...getInitialState(rows, cols),
                    grid: randomize(rows, cols),
                    score: state.score + 1,
                    initialized: true,
                };
            }
        }
        return null;
    },
});

export { boardReducer as handleBoard };
