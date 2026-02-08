import { getProduct } from './matrices';
import { PRECOMPUTED_SOLUTIONS } from './precomputedTables';

export interface BoardState {
    grid: number[];
    score: number;
    rows: number;
    cols: number;
    initialized: boolean;
}

export interface BoardAction {
    type: string;
    row?: number;
    col?: number;
    moves?: { row: number; col: number }[];
    newRows?: number;
    newCols?: number;
    state?: BoardState;
}

export function getGrid(rows: number, _cols: number): number[] {
    return Array.from({ length: rows }, () => 0);
}

export function flipAdj(
    row: number,
    col: number,
    grid: number[],
    rows: number,
    cols: number
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
    cols: number
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
    lastRow: number
): number[] | null {
    // Check precomputed
    const key = `${String(rows)},${String(cols)}`;
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
        // Convert lastRow to number[]
        const input: number[] = [];
        for (let i = 0; i < cols; i++) {
            input.push((lastRow >> i) & 1);
        }

        const result = getProduct(input, rows, cols);
        // result is number[] of 0s and 1s
        result.forEach((val, idx) => {
            if (val) solutionMask |= 1 << idx;
        });
    }

    // Convert solutionMask to indices
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
    cols: number
): { row: number; col: number }[] | null {
    // We shouldn't modify the input grid, but we need to simulate chasing.
    // Copy steps:
    const tempGrid = [...grid];
    const moves: { row: number; col: number }[] = [];

    // Phase 1: Chase lights down
    for (let r = 0; r < rows - 1; r++) {
        const currentRow = tempGrid[r];
        if (currentRow === undefined) continue;
        for (let c = 0; c < cols; c++) {
            if ((currentRow >> c) & 1) {
                // Must click below
                moves.push({ row: r + 1, col: c });
                // Update tempGrid accordingly
                // We only truly need to update the rows that affect future decisions.
                // Clicking (r+1, c) affects (r, c) - clears it? Yes.
                // Affects (r+1, c), (r+2, c), (r+1, c+/-1).
                // We only care about clearing row r so we can move to r+1.
                // Actually, to know the state of row r+1 (for step r+2), we must update row r+1.
                // We don't care about row r anymore as it becomes 0.

                // Toggle r+1 neighbors
                flipAdjInPlace(r + 1, c, tempGrid, rows, cols);
            }
        }
    }

    // Phase 1: Chase lights down completes

    // If there are chase moves, return them immediately so the user can clear the board top-down
    if (moves.length > 0) {
        return moves;
    }

    // Phase 2: Check last row
    const lastRow = tempGrid[rows - 1];
    if (lastRow !== undefined && lastRow !== 0) {
        // Phase 3: Solve last row
        const solution = solveLastRow(rows, cols, lastRow);
        if (solution && solution.length > 0) {
            return solution.map(col => ({ row: 0, col }));
        }
    }

    return null;
}

export function handleBoard(
    state: BoardState,
    action: BoardAction
): BoardState {
    const { type, row, col } = action;

    let { grid, score, rows, cols, initialized } = state;

    switch (type) {
        case 'adjacent': {
            if (row !== undefined && col !== undefined) {
                grid = flipAdj(row, col, grid, rows, cols);
            }
            break;
        }
        case 'multi_adjacent': {
            if (action.moves) {
                // To support mass updates efficiently, we can clone once
                const newGrid = [...grid];
                action.moves.forEach(({ row: r, col: c }) => {
                    flipAdjInPlace(r, c, newGrid, rows, cols);
                });
                grid = newGrid;
            }
            break;
        }
        case 'random':
        case 'randomize': {
            grid = randomize(rows, cols);
            break;
        }
        case 'resize': {
            const { newRows, newCols } = action;
            if (newRows !== undefined && newCols !== undefined) {
                rows = newRows;
                cols = newCols;
                grid = randomize(rows, cols);
                initialized = true;
            }
            break;
        }
        case 'reset':
            grid = getGrid(rows, cols);
            score = 0;
            break;
        case 'new':
        case 'next':
            grid = randomize(rows, cols);
            score += 1;
            break;
        case 'restore': {
            if (action.state) {
                return { ...action.state };
            }
            break;
        }
        default:
            break;
    }

    return {
        grid,
        score,
        rows,
        cols,
        initialized: initialized || false,
    };
}
