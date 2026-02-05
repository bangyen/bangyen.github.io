export type CellState = 0 | 1 | 2; // 0: Empty, 1: /, 2: \
export const EMPTY: CellState = 0;
export const FORWARD: CellState = 1;
export const BACKWARD: CellState = 2;

export interface GokigenState {
    grid: CellState[][];
    numbers: (number | null)[][];
    rows: number;
    cols: number;
    solved: boolean;
}

export type GokigenAction =
    | { type: 'toggle'; row: number; col: number }
    | { type: 'resize'; rows: number; cols: number }
    | { type: 'new' };

class DSU {
    parent: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }

    find(i: number): number {
        if (this.parent[i] !== i) {
            this.parent[i] = this.find(this.parent[i]);
        }
        return this.parent[i];
    }

    union(i: number, j: number): boolean {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootI] = rootJ;
            return true;
        }
        return false;
    }
}

function getNodeIndex(r: number, c: number, cols: number): number {
    return r * (cols + 1) + c;
}

function hasCycle(grid: CellState[][], rows: number, cols: number): boolean {
    const dsu = new DSU((rows + 1) * (cols + 1));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r]?.[c];
            if (cell === undefined || cell === EMPTY) continue;

            const u =
                cell === FORWARD
                    ? getNodeIndex(r, c + 1, cols)
                    : getNodeIndex(r, c, cols);
            const v =
                cell === FORWARD
                    ? getNodeIndex(r + 1, c, cols)
                    : getNodeIndex(r + 1, c + 1, cols);

            if (!dsu.union(u, v)) {
                return true;
            }
        }
    }
    return false;
}

function calculateNumbers(
    grid: CellState[][],
    rows: number,
    cols: number
): (number | null)[][] {
    const numbers: number[][] = Array.from(
        { length: rows + 1 },
        () => Array(cols + 1).fill(0) as number[]
    );

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const rowArr = grid[r];
            if (!rowArr) continue;

            const cell = rowArr[c];
            if (cell === undefined) continue;

            if (cell === FORWARD) {
                if (numbers[r]?.[c + 1] !== undefined) numbers[r][c + 1]++;
                if (numbers[r + 1]?.[c] !== undefined) numbers[r + 1][c]++;
            } else if (cell === BACKWARD) {
                if (numbers[r]?.[c] !== undefined) numbers[r][c]++;
                if (numbers[r + 1]?.[c + 1] !== undefined)
                    numbers[r + 1][c + 1]++;
            }
        }
    }
    return numbers;
}

function checkSolvability(
    maskedNumbers: (number | null)[][],
    rows: number,
    cols: number,
    limit = 2
): number {
    let solutions = 0;

    // Pre-calculate DSU indices for performance
    const nodeCount = (rows + 1) * (cols + 1);

    // We need to check if multiple valid grids satisfy 'maskedNumbers' and 'no cycle'
    // Doing a full backtracking solver

    const backtrack = (index: number, grid: CellState[][], dsu: DSU) => {
        if (solutions >= limit) return;

        if (index === rows * cols) {
            solutions++;
            return;
        }

        const r = Math.floor(index / cols);
        const c = index % cols;

        // Try FORWARD
        // Check if FORWARD violates any number constraints prematurely?
        // It's hard to check "prematurely" without forward checking.
        // Instead, just place and check if we exceeded any known numbers.

        // Let's implement a lighter check:
        // We only need to check if current placement violates the number constraints that are FULLY determined or EXCEEDED.
        // Or simpler: Just count current connections. If > number, prune.
        // If (current + remaining neighbors) < number, prune (lookahead).

        const tryMove = (move: CellState) => {
            grid[r][c] = move;

            // Check numbers that might be violated
            // Affected intersections: (r, c+1) and (r+1, c) for FORWARD
            // (r, c) and (r+1, c+1) for BACKWARD

            // Check all 4 corners of this cell for validity
            const corners = [
                { r: r, c: c },
                { r: r, c: c + 1 },
                { r: r + 1, c: c },
                { r: r + 1, c: c + 1 },
            ];

            for (const { r: nr, c: nc } of corners) {
                const target = maskedNumbers[nr]?.[nc];
                if (target === null || target === undefined) continue;

                // Count current lines connected to this intersection
                let current = 0;
                let saturated = true; // Are all 4 (or fewer) neighbors filled?

                // Check 4 neighbors of intersection (nr, nc)
                // A neighbor is a cell (cr, cc) such that it touches (nr, nc)
                // Top-Left of intersection: cell (nr-1, nc-1) -> connects if BACKWARD
                // Top-Right of intersection: cell (nr-1, nc)   -> connects if FORWARD
                // Bot-Left of intersection: cell (nr, nc-1)   -> connects if FORWARD
                // Bot-Right of intersection: cell (nr, nc)    -> connects if BACKWARD

                // Helper to check neighbor
                const checkNeighbor = (
                    cr: number,
                    cc: number,
                    requiredType: CellState
                ) => {
                    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) return;
                    const val = grid[cr][cc];
                    if (val === EMPTY) {
                        saturated = false;
                    } else if (val === requiredType) {
                        current++;
                    }
                };

                checkNeighbor(nr - 1, nc - 1, BACKWARD);
                checkNeighbor(nr - 1, nc, FORWARD);
                checkNeighbor(nr, nc - 1, FORWARD);
                checkNeighbor(nr, nc, BACKWARD);

                // Saturated check
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (saturated && current < target) return false;
            }

            // Cycle check
            // For performance, we can do incremental DSU if we pass state.
            // But cloning DSU is expensive?
            // Actually, we can just use the global scan check `hasCycle` every time?
            // hasCycle is O(N). We do this N times. Total N^2. N=100. fine.
            if (hasCycle(grid, rows, cols)) return false;

            return true;
        };

        if (tryMove(FORWARD)) {
            backtrack(index + 1, grid, dsu); // DSU not actually used in signature, refactor if needed
        }
        if (solutions >= limit) return;

        if (tryMove(BACKWARD)) {
            backtrack(index + 1, grid, dsu);
        }

        grid[r][c] = EMPTY;
    };

    const emptyGrid = Array.from(
        { length: rows },
        () => Array(cols).fill(EMPTY) as CellState[]
    );
    backtrack(0, emptyGrid, new DSU(nodeCount));

    return solutions;
}

function generatePuzzle(
    rows: number,
    cols: number
): { numbers: (number | null)[][]; solution: CellState[][] } {
    const grid: CellState[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(FORWARD) as CellState[]
    );

    // Randomly flip cells to generate a random valid board
    const iterations = rows * cols * 20;
    for (let i = 0; i < iterations; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if (grid[r]?.[c] === undefined) continue;

        // Flip
        grid[r][c] = grid[r][c] === FORWARD ? BACKWARD : FORWARD;

        // Check if cycle
        if (hasCycle(grid, rows, cols)) {
            // Revert if cycle
            grid[r][c] = grid[r][c] === FORWARD ? BACKWARD : FORWARD;
        }
    }

    // Now we have a valid solution board.
    const fullNumbers = calculateNumbers(grid, rows, cols);
    const maskedNumbers = fullNumbers.map(r => [...r]);

    // Create a list of all intersection coordinates
    const coords: { r: number; c: number }[] = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            coords.push({ r, c });
        }
    }

    // Shuffle coords
    for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = coords[i];
        coords[i] = coords[j];
        coords[j] = temp;
    }

    // Try to remove numbers
    // Limit checking to partial grid size to prevent timeouts on large grids?
    // 5x5 is fast. 10x10 might be slow with naive backtracking.

    // Heuristic:
    // Small grids (<= 25 cells): Try to remove EVERYTHING with backtracking check.
    // Large grids: Backtracking is too slow. Probabilistic removal.
    // We do NOT stop after MAX_CHECKS for large grids. We scan all.

    const isSmall = rows * cols <= 25;
    // For small grids, we limit checks to avoid hanging if it gets stuck (shouldn't with 25 cells but safe guard).
    // For large grids, we iterate all.
    const MAX_CHECKS = isSmall ? 100 : rows * cols * 4;
    let checks = 0;

    for (const { r, c } of coords) {
        if (checks >= MAX_CHECKS) break;

        const rowArr = maskedNumbers[r];
        if (!rowArr) continue;

        const original = rowArr[c];
        // Ensure original is not undefined (though logical for valid coords)
        if (original === undefined) continue;

        rowArr[c] = null;

        if (isSmall) {
            // Precise check
            const solutions = checkSolvability(maskedNumbers, rows, cols, 2);
            if (solutions > 1) {
                rowArr[c] = original; // Revert
            }
        } else {
            // Probabilistic heuristic for large grids
            // Keep roughly 50% of numbers to ensure playability without solver
            if (Math.random() > 0.4) {
                // Keep it removed
            } else {
                rowArr[c] = original; // Revert
            }
        }

        checks++;
    }

    return { numbers: maskedNumbers, solution: grid };
}

export function handleBoard(
    state: GokigenState,
    action: GokigenAction
): GokigenState {
    switch (action.type) {
        case 'toggle': {
            if (state.solved) return state;

            const { row, col } = action;
            if (state.grid[row]?.[col] === undefined) return state;

            const newGrid = state.grid.map(r => [...r]);

            // Cycle: Empty -> / -> \ -> Empty
            const current = newGrid[row][col];
            newGrid[row][col] =
                current === EMPTY
                    ? FORWARD
                    : current === FORWARD
                      ? BACKWARD
                      : EMPTY;

            // Check win condition
            const isFull = newGrid.every(r => r.every(c => c !== EMPTY));
            let solved = false;

            if (isFull) {
                const currentNumbers = calculateNumbers(
                    newGrid,
                    state.rows,
                    state.cols
                );
                const numbersMatch = state.numbers.every((rowArr, r) =>
                    rowArr.every(
                        (val, c) =>
                            val === null || val === currentNumbers[r]?.[c]
                    )
                );

                if (
                    numbersMatch &&
                    !hasCycle(newGrid, state.rows, state.cols)
                ) {
                    solved = true;
                }
            }

            return {
                ...state,
                grid: newGrid,
                solved,
            };
        }
        case 'resize': {
            if (action.rows < 2 || action.cols < 2) return state;
            const { numbers } = generatePuzzle(action.rows, action.cols);
            return {
                grid: createEmptyGrid(action.rows, action.cols),
                numbers,
                rows: action.rows,
                cols: action.cols,
                solved: false,
            };
        }
        case 'new': {
            const { numbers } = generatePuzzle(state.rows, state.cols);
            return {
                ...state,
                grid: createEmptyGrid(state.rows, state.cols),
                numbers,
                solved: false,
            };
        }
        default:
            return state;
    }
}

function createEmptyGrid(rows: number, cols: number): CellState[][] {
    const grid: CellState[][] = [];
    for (let r = 0; r < rows; r++) {
        const row: CellState[] = [];
        for (let c = 0; c < cols; c++) {
            row.push(EMPTY);
        }
        grid.push(row);
    }
    return grid;
}

export function getInitialState(rows: number, cols: number): GokigenState {
    const { numbers } = generatePuzzle(rows, cols);
    return {
        grid: createEmptyGrid(rows, cols),
        numbers,
        rows,
        cols,
        solved: false,
    };
}
