export type CellState = 0 | 1 | 2; // 0: Empty, 1: /, 2: \
export const EMPTY: CellState = 0;
export const FORWARD: CellState = 1;
export const BACKWARD: CellState = 2;

export interface SlantState {
    grid: CellState[][];
    numbers: (number | null)[][];
    rows: number;
    cols: number;
    solved: boolean;
}

export type SlantAction =
    | { type: 'toggle'; row: number; col: number; reverse?: boolean }
    | { type: 'resize'; rows: number; cols: number }
    | { type: 'new' };

class DSU {
    parent: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
    }

    find(i: number): number {
        const p = this.parent[i];
        if (p === undefined) throw new Error('Index out of bounds');
        if (p !== i) {
            this.parent[i] = this.find(p);
        }
        const root = this.parent[i];
        if (root === undefined) throw new Error('Root not found');
        return root;
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
        const rowArr = grid[r];
        if (!rowArr) continue;
        for (let c = 0; c < cols; c++) {
            const cell = rowArr[c];
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
): number[][] {
    const numbers: number[][] = Array.from(
        { length: rows + 1 },
        () => Array(cols + 1).fill(0) as number[]
    );

    for (let r = 0; r < rows; r++) {
        const rowArr = grid[r];
        if (!rowArr) continue;
        for (let c = 0; c < cols; c++) {
            const cell = rowArr[c];
            if (cell === FORWARD) {
                const rN = numbers[r];
                if (rN) {
                    const v = rN[c + 1];
                    if (v !== undefined) rN[c + 1] = v + 1;
                }
                const r1N = numbers[r + 1];
                if (r1N) {
                    const v = r1N[c];
                    if (v !== undefined) r1N[c] = v + 1;
                }
            } else if (cell === BACKWARD) {
                const rN = numbers[r];
                if (rN) {
                    const v = rN[c];
                    if (v !== undefined) rN[c] = v + 1;
                }
                const r1N = numbers[r + 1];
                if (r1N) {
                    const v = r1N[c + 1];
                    if (v !== undefined) r1N[c + 1] = v + 1;
                }
            }
        }
    }
    return numbers;
}

/**
 * Checks if a puzzle can be solved using deductive logic alone.
 * Rule 1: Node constraints (0, 1, 2, 3, 4 slants touch the node).
 * Rule 2: No cycles.
 */
function checkDeductiveSolvability(
    maskedNumbers: (number | null)[][],
    rows: number,
    cols: number
): boolean {
    const grid: CellState[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(EMPTY) as CellState[]
    );
    let changed = true;

    while (changed) {
        changed = false;

        // Rule 1: Node constraints
        for (let r = 0; r <= rows; r++) {
            for (let c = 0; c <= cols; c++) {
                const target = maskedNumbers[r]?.[c];
                if (target === null || target === undefined) continue;

                const touching = [
                    { gr: r - 1, gc: c - 1, pt: BACKWARD },
                    { gr: r - 1, gc: c, pt: FORWARD },
                    { gr: r, gc: c - 1, pt: FORWARD },
                    { gr: r, gc: c, pt: BACKWARD },
                ].filter(
                    ({ gr, gc }) => gr >= 0 && gr < rows && gc >= 0 && gc < cols
                );

                let confirmedIn = 0;
                const unknown: { gr: number; gc: number; pt: CellState }[] = [];

                for (const cell of touching) {
                    const current = grid[cell.gr]?.[cell.gc];
                    if (current === EMPTY) {
                        unknown.push(cell);
                    } else if (current === cell.pt) {
                        confirmedIn++;
                    }
                }

                if (confirmedIn === target && unknown.length > 0) {
                    // All unknown must be "the other one"
                    for (const { gr, gc, pt } of unknown) {
                        const row = grid[gr];
                        if (row) {
                            row[gc] = pt === FORWARD ? BACKWARD : FORWARD;
                            changed = true;
                        }
                    }
                } else if (
                    confirmedIn + unknown.length === target &&
                    unknown.length > 0
                ) {
                    // All unknown must be "in"
                    for (const { gr, gc, pt } of unknown) {
                        const row = grid[gr];
                        if (row) {
                            row[gc] = pt;
                            changed = true;
                        }
                    }
                }
            }
        }

        if (changed) continue;

        // Rule 2: Cycle prevention
        // If one slant creates a cycle, we MUST pick the other.
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const rowArr = grid[r];
                if (rowArr?.[c] !== EMPTY) continue;

                // Try FORWARD
                rowArr[c] = FORWARD;
                if (hasCycle(grid, rows, cols)) {
                    rowArr[c] = BACKWARD;
                    changed = true;
                    if (hasCycle(grid, rows, cols)) {
                        // Both create cycles? Unsolvable board state
                        return false;
                    }
                    continue;
                }

                // Try BACKWARD
                rowArr[c] = BACKWARD;
                if (hasCycle(grid, rows, cols)) {
                    rowArr[c] = FORWARD;
                    changed = true;
                    if (hasCycle(grid, rows, cols)) {
                        return false;
                    }
                    continue;
                }

                rowArr[c] = EMPTY;
            }
        }
    }

    // Check if fully solved
    const isFull = grid.every(row => row.every(cell => cell !== EMPTY));
    if (!isFull) return false;

    // Verify constraints
    const currentNumbers = calculateNumbers(grid, rows, cols);
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            const target = maskedNumbers[r]?.[c];
            if (target !== null && target !== undefined) {
                if (currentNumbers[r]?.[c] !== target) return false;
            }
        }
    }

    return !hasCycle(grid, rows, cols);
}

export function generatePuzzle(
    rows: number,
    cols: number
): { numbers: (number | null)[][]; solution: CellState[][] } {
    const grid: CellState[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(FORWARD) as CellState[]
    );

    // 1. Generate a valid random solution with no cycles
    const iterations = rows * cols * 30;
    for (let i = 0; i < iterations; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const rowArr = grid[r];
        if (!rowArr) continue;

        const original = rowArr[c];
        if (original === undefined) continue;

        rowArr[c] = original === FORWARD ? BACKWARD : FORWARD;
        if (hasCycle(grid, rows, cols)) {
            rowArr[c] = original;
        }
    }

    // 2. Calculate numbers for this solution
    const fullNumbers = calculateNumbers(grid, rows, cols);
    const maskedNumbers: (number | null)[][] = fullNumbers.map(r => [...r]);

    // 3. Shuffle coordinates for hint removal
    const coords: { r: number; c: number }[] = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            coords.push({ r, c });
        }
    }
    for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempI = coords[i];
        const tempJ = coords[j];
        if (tempI && tempJ) {
            coords[i] = tempJ;
            coords[j] = tempI;
        }
    }

    // 4. Remove hints while ensuring deductive solvability
    // We aim for a target hint density (e.g., 35% of nodes)
    const targetHintCount = Math.floor((rows + 1) * (cols + 1) * 0.35);
    let currentHintCount = (rows + 1) * (cols + 1);

    for (const { r, c } of coords) {
        if (currentHintCount <= targetHintCount) continue; // Keep going to see if we can reach it

        const rowArr = maskedNumbers[r];
        if (!rowArr) continue;

        const original = rowArr[c];
        if (original === null || original === undefined) continue;

        rowArr[c] = null;
        if (checkDeductiveSolvability(maskedNumbers, rows, cols)) {
            currentHintCount--;
        } else {
            rowArr[c] = original;
        }
    }

    return { numbers: maskedNumbers, solution: grid };
}

export function handleBoard(
    state: SlantState,
    action: SlantAction
): SlantState {
    switch (action.type) {
        case 'toggle': {
            if (state.solved) return state;

            const { row, col } = action;
            const newGrid = state.grid.map(r => [...r]);
            const rowArr = newGrid[row];
            if (!rowArr) return state;

            const current = rowArr[col];
            if (current === undefined) return state;

            if (action.reverse) {
                rowArr[col] =
                    current === EMPTY
                        ? BACKWARD
                        : current === BACKWARD
                          ? FORWARD
                          : EMPTY;
            } else {
                rowArr[col] =
                    current === EMPTY
                        ? FORWARD
                        : current === FORWARD
                          ? BACKWARD
                          : EMPTY;
            }

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
                grid: Array.from(
                    { length: action.rows },
                    () => Array(action.cols).fill(EMPTY) as CellState[]
                ),
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
                grid: Array.from(
                    { length: state.rows },
                    () => Array(state.cols).fill(EMPTY) as CellState[]
                ),
                numbers,
                solved: false,
            };
        }
        default:
            return state;
    }
}

export function getInitialState(rows: number, cols: number): SlantState {
    const { numbers } = generatePuzzle(rows, cols);
    return {
        grid: Array.from(
            { length: rows },
            () => Array(cols).fill(EMPTY) as CellState[]
        ),
        numbers,
        rows,
        cols,
        solved: false,
    };
}
