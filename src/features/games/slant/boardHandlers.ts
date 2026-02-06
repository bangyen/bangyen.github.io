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

function checkSolvability(
    maskedNumbers: (number | null)[][],
    rows: number,
    cols: number,
    limit = 2
): number {
    let solutions = 0;

    const backtrack = (index: number, grid: CellState[][]) => {
        if (solutions >= limit) return;

        if (index === rows * cols) {
            solutions++;
            return;
        }

        const r = Math.floor(index / cols);
        const c = index % cols;

        const tryPlace = (move: CellState) => {
            const rowArr = grid[r];
            if (!rowArr) return false;
            rowArr[c] = move;

            const corners = [
                { nr: r, nc: c },
                { nr: r, nc: c + 1 },
                { nr: r + 1, nc: c },
                { nr: r + 1, nc: c + 1 },
            ];

            for (const { nr, nc } of corners) {
                const target = maskedNumbers[nr]?.[nc];
                if (target === null || target === undefined) continue;

                let current = 0;
                let decided = 0;

                const neighbors = [
                    { cr: nr - 1, cc: nc - 1, type: BACKWARD },
                    { cr: nr - 1, cc: nc, type: FORWARD },
                    { cr: nr, cc: nc - 1, type: FORWARD },
                    { cr: nr, cc: nc, type: BACKWARD },
                ];

                for (const { cr, cc, type } of neighbors) {
                    if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
                    const cRow = grid[cr];
                    if (!cRow) continue;
                    const val = cRow[cc];
                    if (val !== EMPTY) {
                        decided++;
                        if (val === type) current++;
                    }
                }

                if (current > target) return false;
                const totalNeighbors = neighbors.filter(
                    ({ cr, cc }) => cr >= 0 && cr < rows && cc >= 0 && cc < cols
                ).length;

                if (decided === totalNeighbors && current !== target)
                    return false;
            }

            if (hasCycle(grid, rows, cols)) return false;

            return true;
        };

        const rowArr = grid[r];
        if (!rowArr) return;

        if (tryPlace(FORWARD)) {
            backtrack(index + 1, grid);
        }
        if (solutions >= limit) return;

        if (tryPlace(BACKWARD)) {
            backtrack(index + 1, grid);
        }

        rowArr[c] = EMPTY;
    };

    const emptyGrid = Array.from(
        { length: rows },
        () => Array(cols).fill(EMPTY) as CellState[]
    );
    backtrack(0, emptyGrid);

    return solutions;
}

export function generatePuzzle(
    rows: number,
    cols: number
): { numbers: (number | null)[][]; solution: CellState[][] } {
    const grid: CellState[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(FORWARD) as CellState[]
    );

    const iterations = rows * cols * 20;
    for (let i = 0; i < iterations; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const rowArr = grid[r];
        if (!rowArr) continue;

        const currentVal = rowArr[c];
        if (currentVal === undefined) continue;

        const original = currentVal;
        rowArr[c] = original === FORWARD ? BACKWARD : FORWARD;
        if (hasCycle(grid, rows, cols)) {
            rowArr[c] = original;
        }
    }

    const fullNumbers = calculateNumbers(grid, rows, cols);
    const maskedNumbers: (number | null)[][] = fullNumbers.map(r => [...r]);

    const coords: { r: number; c: number }[] = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            coords.push({ r, c });
        }
    }

    for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const ci = coords[i];
        const cj = coords[j];
        if (ci && cj) {
            coords[i] = cj;
            coords[j] = ci;
        }
    }

    const isSmall = rows * cols <= 16;
    const MAX_CHECKS = isSmall ? 100 : rows * cols * 4;
    let checks = 0;
    let removedCount = 0;

    for (const { r, c } of coords) {
        if (checks >= MAX_CHECKS) break;

        const rowArr = maskedNumbers[r];
        if (!rowArr) continue;

        const original = rowArr[c];
        if (original === null || original === undefined) continue;

        if (removedCount > (rows + 1) * (cols + 1) * 0.6) break;

        rowArr[c] = null;
        if (isSmall) {
            if (checkSolvability(maskedNumbers, rows, cols, 2) > 1) {
                rowArr[c] = original;
            } else {
                removedCount++;
            }
        } else {
            if (Math.random() < 0.5) {
                rowArr[c] = original;
            } else {
                removedCount++;
            }
        }
        checks++;
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
