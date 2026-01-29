export function getGrid(rows: number, cols: number): number[][] {
    return [...Array(rows)].map(() => Array(cols).fill(0));
}

export function flipAdj(
    row: number,
    col: number,
    grid: number[][]
): number[][] {
    const cols = grid[0].length;
    const rows = grid.length;

    const newGrid = grid.map(row => [...row]);
    newGrid[row][col] ^= 1;

    if (row > 0) newGrid[row - 1][col] ^= 1;
    if (row < rows - 1) newGrid[row + 1][col] ^= 1;

    if (col > 0) newGrid[row][col - 1] ^= 1;
    if (col < cols - 1) newGrid[row][col + 1] ^= 1;

    return newGrid;
}

export function isSolved(grid: number[][]): boolean {
    const flat = grid.flat();
    return !flat.includes(1) || !flat.includes(0);
}

function randomize(rows: number, cols: number): number[][] {
    let grid = getGrid(rows, cols);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const random = Math.random();

            if (random > 0.5) grid = flipAdj(r, c, grid);
        }
    }

    return grid;
}

// Memoization for solver tables: "rows,cols" -> map of "bottomRowStr" -> "topRowIndices"
const solverCache: Record<string, Record<string, number[]>> = {};

function solveLastRow(
    rows: number,
    cols: number,
    lastRow: number[]
): number[] | null {
    const key = `${rows},${cols}`;

    if (!solverCache[key]) {
        // Build the lookup table for this grid size
        const map: Record<string, number[]> = {};
        const max = 1 << cols;

        for (let i = 0; i < max; i++) {
            // Create a board with top row set to 'i'
            let grid = getGrid(rows, cols);
            const topRowIndices: number[] = [];

            for (let c = 0; c < cols; c++) {
                if ((i >> c) & 1) {
                    grid = flipAdj(0, c, grid); // Toggle to set initial state correctly?
                    // Actually, we want to simulate "clicking" the top row.
                    // But flipAdj toggles neighbors too.
                    // The standard algorithm says: "Clicking top row buttons induces a state at the bottom".
                    // So yes, we just simulate clicks.
                    topRowIndices.push(c);
                }
            }

            // Chase down
            for (let r = 0; r < rows - 1; r++) {
                for (let c = 0; c < cols; c++) {
                    if (grid[r][c] === 1) {
                        grid = flipAdj(r + 1, c, grid);
                    }
                }
            }

            // Record resulting bottom row
            const bottomStr = grid[rows - 1].join('');
            if (!map[bottomStr]) {
                map[bottomStr] = topRowIndices;
            }
        }
        solverCache[key] = map;
    }

    const currentBottomStr = lastRow.join('');
    const result = solverCache[key][currentBottomStr] || null;
    return result;
}

export function getNextMove(
    grid: number[][]
): { row: number; col: number }[] | null {
    const rows = grid.length;
    const cols = grid[0].length;

    // Phase 1: Chase lights down
    for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                // Return as single-item array
                return [{ row: r + 1, col: c }];
            }
        }
    }

    // Phase 2: Check last row
    const lastRow = grid[rows - 1];
    if (lastRow.some(cell => cell === 1)) {
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

    let { grid, score, rows, cols, auto } = state;

    switch (type) {
        case 'auto':
            auto = !auto;
            break;
        case 'adjacent': {
            if (row !== undefined && col !== undefined) {
                grid = flipAdj(row, col, grid);

                if (isSolved(grid)) {
                    grid = randomize(rows, cols);
                    score += 1;
                }
            }
            break;
        }
        case 'multi_adjacent':
            if (moves) {
                moves.forEach(m => {
                    grid = flipAdj(m.row, m.col, grid);
                });

                if (isSolved(grid)) {
                    grid = randomize(rows, cols);
                    score += 1;
                }
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
            }
            break;
        }
        case 'reset':
            grid = getGrid(rows, cols);
            score = 0;
            auto = false;
            break;
        default:
            break;
    }

    return { grid, score, rows, cols, auto };
}
