import { getProduct } from './matrices';
import { PRECOMPUTED_SOLUTIONS } from './precomputedTables';
import type { BoardState, BoardAction } from '../types';

import { validateGridSize } from '@/features/games/types/types';
import { createGameReducer, getPosKey } from '@/utils/gameUtils';

export function getGrid(rows: number, _cols: number): number[] {
    return Array.from({ length: rows }, () => 0);
}

export function flipAdj(
    row: number,
    col: number,
    grid: number[],
    rows: number,
    cols: number,
): number[] {
    const newGrid = [...grid];

    // Toggle self and left/right
    let mask = 1 << col;
    // Check boundaries for left/right
    if (col > 0) mask |= 1 << (col - 1);
    if (col < cols - 1) mask |= 1 << (col + 1);

    if (newGrid[row] !== undefined) newGrid[row] ^= mask;

    // Toggle up
    if (row > 0) {
        const val = newGrid[row - 1];
        if (val !== undefined) newGrid[row - 1] = val ^ (1 << col);
    }

    // Toggle down
    if (row < rows - 1) {
        const val = newGrid[row + 1];
        if (val !== undefined) newGrid[row + 1] = val ^ (1 << col);
    }

    return newGrid;
}

function flipAdjInPlace(
    row: number,
    col: number,
    grid: number[],
    rows: number,
    cols: number,
): void {
    let mask = 1 << col;
    if (col > 0) mask |= 1 << (col - 1);
    if (col < cols - 1) mask |= 1 << (col + 1);

    if (grid[row] !== undefined) grid[row] ^= mask;

    if (row > 0) {
        const val = grid[row - 1];
        if (val !== undefined) grid[row - 1] = val ^ (1 << col);
    }

    if (row < rows - 1) {
        const val = grid[row + 1];
        if (val !== undefined) grid[row + 1] = val ^ (1 << col);
    }
}

export function isSolved(grid: number[]): boolean {
    return grid.every(row => row === 0);
}

function randomize(rows: number, cols: number): number[] {
    const grid = getGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() > 0.5) {
                flipAdjInPlace(r, c, grid, rows, cols);
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
    // Check precomputed
    const key = getPosKey(rows, cols);
    const precomputed = PRECOMPUTED_SOLUTIONS[key];

    let solutionMask = 0;

    if (precomputed) {
        for (let i = 0; i < cols; i++) {
            const rowInv = precomputed[i];
            if (rowInv !== undefined) {
                const dot = rowInv & lastRow;
                // Count bits of dot
                let count = 0;
                let n = dot;
                while (n > 0) {
                    n &= n - 1;
                    count++;
                }

                if (count % 2 === 1) {
                    solutionMask |= 1 << i;
                }
            }
        }
    } else {
        // Fallback to getProduct
        const input: number[] = [];
        for (let i = 0; i < cols; i++) {
            input.push((lastRow >> i) & 1);
        }

        const result = getProduct(input, rows, cols);
        for (const [idx, val] of result.entries()) {
            if (val) solutionMask |= 1 << idx;
        }
    }

    const indices: number[] = [];
    for (let c = 0; c < cols; c++) {
        if ((solutionMask >> c) & 1) {
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
            if ((currentRow >> c) & 1) {
                moves.push({ row: r + 1, col: c });
                flipAdjInPlace(r + 1, c, tempGrid, rows, cols);
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
        grid: getGrid(rows, cols),
        score: 0,
        rows,
        cols,
        initialized: false,
    };
}

export const handleBoard = createGameReducer<BoardState, BoardAction>({
    getInitialState,
    customHandler: (state, action) => {
        const { rows, cols } = state;

        switch (action.type) {
            case 'adjacent': {
                return {
                    ...state,
                    grid: flipAdj(
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
                    flipAdjInPlace(r, c, newGrid, rows, cols);
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
                const r = action.newRows ?? action.rows ?? state.rows;
                const c = action.newCols ?? action.cols ?? state.cols;
                return {
                    ...getInitialState(r, c),
                    grid: randomize(r, c),
                    initialized: true,
                };
            }
            case 'reset': {
                return {
                    ...getInitialState(rows, cols),
                    grid: randomize(rows, cols),
                    score: 0,
                    initialized: true,
                };
            }
            case 'new': {
                return {
                    ...getInitialState(rows, cols),
                    grid: randomize(rows, cols),
                    score: 0,
                    initialized: true,
                };
            }
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
