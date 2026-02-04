import { getProduct } from './matrices';

export function getGrid(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () => Array(cols).fill(0) as number[]);
}

export function flipAdj(
    row: number,
    col: number,
    grid: number[][]
): number[][] {
    const rows = grid.length;

    const newGrid = grid.map(row => [...row]);
    const targetRow = newGrid[row];
    if (targetRow && col >= 0 && col < targetRow.length) {
        const val = targetRow[col];
        if (val !== undefined) targetRow[col] = val ^ 1;
    }

    if (row > 0) {
        const rowAbove = newGrid[row - 1];
        if (rowAbove && col >= 0 && col < rowAbove.length) {
            const val = rowAbove[col];
            if (val !== undefined) rowAbove[col] = val ^ 1;
        }
    }
    if (row < rows - 1) {
        const rowBelow = newGrid[row + 1];
        if (rowBelow && col >= 0 && col < rowBelow.length) {
            const val = rowBelow[col];
            if (val !== undefined) rowBelow[col] = val ^ 1;
        }
    }

    if (targetRow) {
        if (col > 0) {
            const val = targetRow[col - 1];
            if (val !== undefined) targetRow[col - 1] = val ^ 1;
        }
        if (col < targetRow.length - 1) {
            const val = targetRow[col + 1];
            if (val !== undefined) targetRow[col + 1] = val ^ 1;
        }
    }

    return newGrid;
}

export function isSolved(grid: number[][]): boolean {
    const flat = grid.flat();
    return !flat.includes(1) || !flat.includes(0);
}

function randomize(rows: number, cols: number): number[][] {
    const grid = getGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (Math.random() > 0.5) {
                // Inline flipAdj logic to avoid cloning grid in every iteration
                const neighbors = [
                    [r, c],
                    [r - 1, c],
                    [r + 1, c],
                    [r, c - 1],
                    [r, c + 1],
                ];

                for (const neighbor of neighbors) {
                    const nr = neighbor[0];
                    const nc = neighbor[1];
                    if (
                        nr !== undefined &&
                        nc !== undefined &&
                        nr >= 0 &&
                        nr < rows &&
                        nc >= 0 &&
                        nc < cols
                    ) {
                        const rowArr = grid[nr];
                        if (rowArr && nc >= 0 && nc < rowArr.length) {
                            const val = rowArr[nc];
                            if (val !== undefined) {
                                rowArr[nc] = val ^ 1;
                            }
                        }
                    }
                }
            }
        }
    }

    return grid;
}

function solveLastRow(
    rows: number,
    cols: number,
    lastRow: number[]
): number[] | null {
    const solution = getProduct(lastRow, rows, cols);
    const indices: number[] = [];
    solution.forEach((val, col) => {
        if (val === 1) indices.push(col);
    });
    return indices.length > 0 ? indices : null;
}

export function getNextMove(
    grid: number[][]
): { row: number; col: number }[] | null {
    const rows = grid.length;
    const firstRow = grid[0];
    const cols = firstRow ? firstRow.length : 0;

    // Phase 1: Chase lights down
    for (let r = 0; r < rows - 1; r++) {
        const currentRow = grid[r];
        if (!currentRow) continue;
        for (let c = 0; c < cols; c++) {
            if (currentRow[c] === 1) {
                // Return as single-item array
                return [{ row: r + 1, col: c }];
            }
        }
    }

    // Phase 2: Check last row
    const lastRow = grid[rows - 1];
    if (lastRow?.some(cell => cell === 1)) {
        // Phase 3: Solve last row
        const solution = solveLastRow(rows, cols, lastRow);
        if (solution && solution.length > 0) {
            return solution.map(col => ({ row: 0, col }));
        }
    }

    return null;
}

export interface BoardState {
    grid: number[][];
    score: number;
    rows: number;
    cols: number;
    auto: boolean;
    initialized: boolean;
}

export interface BoardAction {
    type: string;
    row?: number;
    col?: number;
    moves?: { row: number; col: number }[];
    newRows?: number;
    newCols?: number;
}

export function handleBoard(
    state: BoardState,
    action: BoardAction
): BoardState {
    const { type, row, col, moves } = action;

    let { grid, score, rows, cols, auto, initialized } = state;

    switch (type) {
        case 'auto':
            auto = !auto;
            break;
        case 'adjacent': {
            if (row !== undefined && col !== undefined) {
                grid = flipAdj(row, col, grid);
            }
            break;
        }
        case 'multi_adjacent':
            if (moves) {
                moves.forEach(m => {
                    grid = flipAdj(m.row, m.col, grid);
                });
            }
            break;
        case 'random':
        case 'randomize': {
            grid = randomize(rows, cols);
            auto = false;
            break;
        }
        case 'resize': {
            const { newRows, newCols } = action;
            if (newRows !== undefined && newCols !== undefined) {
                rows = newRows;
                cols = newCols;
                grid = randomize(rows, cols);
                auto = false;
                initialized = true; // Mark as initialized
            }
            break;
        }
        case 'reset':
            grid = getGrid(rows, cols);
            score = 0;
            auto = false;
            break;
        case 'next':
            grid = randomize(rows, cols);
            score += 1;
            break;
        default:
            break;
    }

    return {
        grid,
        score,
        rows,
        cols,
        auto,
        initialized: initialized || false,
    };
}
