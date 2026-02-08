export type CellState = 0 | 1 | 2; // 0: Empty, 1: /, 2: \
export const EMPTY: CellState = 0;
export const FORWARD: CellState = 1;
export const BACKWARD: CellState = 2;

import { GAME_LOGIC_CONSTANTS } from './constants';
import init, { generate_puzzle_wasm, find_cycles_wasm } from 'slant-wasm';

// Initialize the Wasm module
init().catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Slant WASM:', e);
});

export interface SlantState {
    grid: CellState[][];
    numbers: (number | null)[][];
    solution: CellState[][];
    rows: number;
    cols: number;
    solved: boolean;
    errorNodes: Set<string>; // "r,c"
    cycleCells: Set<string>; // "r,c"
    satisfiedNodes: Set<string>; // "r,c"
}

export type SlantAction =
    | { type: 'toggle'; row: number; col: number; reverse?: boolean }
    | { type: 'resize'; rows: number; cols: number }
    | { type: 'new' }
    | { type: 'hydrate'; state: SlantState };

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
        if (this.parent[i] === undefined) throw new Error('Parent undefined');
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

    connected(i: number, j: number): boolean {
        return this.find(i) === this.find(j);
    }
}

function getNodeIndex(r: number, c: number, cols: number): number {
    return r * (cols + 1) + c;
}

export function findCycles(
    grid: CellState[][],
    rows: number,
    cols: number
): Set<string> {
    try {
        const flatGrid = new Uint8Array(rows * cols);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                flatGrid[r * cols + c] = grid[r]?.[c] ?? 0;
            }
        }
        const cycles = find_cycles_wasm(flatGrid, rows, cols);
        if (cycles.length > 0) {
            return new Set(cycles);
        }
    } catch (_e) {
        // Fallback to JS if WASM fails or isn't initialized
    }

    const adj = new Map<number, { node: number; r: number; c: number }[]>();
    const cycleCells = new Set<string>();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = grid[r]?.[c];
            if (!cell || cell === EMPTY) continue;

            const u =
                cell === FORWARD
                    ? getNodeIndex(r, c + 1, cols)
                    : getNodeIndex(r, c, cols);
            const v =
                cell === FORWARD
                    ? getNodeIndex(r + 1, c, cols)
                    : getNodeIndex(r + 1, c + 1, cols);

            if (!adj.has(u)) adj.set(u, []);
            if (!adj.has(v)) adj.set(v, []);
            adj.get(u)?.push({ node: v, r, c });
            adj.get(v)?.push({ node: u, r, c });
        }
    }

    const visited = new Set<number>();
    const onStack = new Set<number>();
    const edgeStack: { r: number; c: number; u: number; v: number }[] = [];

    const dfs = (u: number, prevNode: number) => {
        visited.add(u);
        onStack.add(u);

        const neighbors = adj.get(u) ?? [];
        for (const { node: v, r, c } of neighbors) {
            if (v === prevNode) continue;

            if (onStack.has(v)) {
                // Cycle detected! Trace back edgeStack
                cycleCells.add(`${String(r)},${String(c)}`);
                for (let i = edgeStack.length - 1; i >= 0; i--) {
                    const edge = edgeStack[i];
                    if (!edge) break;
                    cycleCells.add(`${String(edge.r)},${String(edge.c)}`);
                    if (edge.u === v || edge.v === v) break;
                }
            } else if (!visited.has(v)) {
                edgeStack.push({ r, c, u, v });
                dfs(v, u);
                edgeStack.pop();
            }
        }

        onStack.delete(u);
    };

    for (const node of adj.keys()) {
        if (!visited.has(node)) {
            dfs(node, -1);
        }
    }

    return cycleCells;
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

function getErrorNodes(
    grid: CellState[][],
    numbers: (number | null)[][],
    rows: number,
    cols: number
): Set<string> {
    const errors = new Set<string>();
    const currentNumbers = calculateNumbers(grid, rows, cols);

    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            const target = numbers[r]?.[c];
            if (target === null || target === undefined) continue;

            const current = currentNumbers[r]?.[c] ?? 0;

            // Overfilled
            if (current > target) {
                errors.add(`${String(r)},${String(c)}`);
                continue;
            }

            // Check if it's impossible to reach target (filled but wrong)
            const possible = [
                { gr: r - 1, gc: c - 1 },
                { gr: r - 1, gc: c },
                { gr: r, gc: c - 1 },
                { gr: r, gc: c },
            ].filter(
                ({ gr, gc }) =>
                    gr >= 0 &&
                    gr < rows &&
                    gc >= 0 &&
                    gc < cols &&
                    grid[gr]?.[gc] === EMPTY
            ).length;

            if (current + possible < target) {
                errors.add(`${String(r)},${String(c)}`);
            }
        }
    }
    return errors;
}

function getSatisfiedNodes(
    grid: CellState[][],
    numbers: (number | null)[][],
    rows: number,
    cols: number
): Set<string> {
    const satisfied = new Set<string>();
    const currentNumbers = calculateNumbers(grid, rows, cols);

    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            const target = numbers[r]?.[c];
            if (target === null || target === undefined) continue;

            const current = currentNumbers[r]?.[c] ?? 0;
            if (current === target) {
                satisfied.add(`${String(r)},${String(c)}`);
            }
        }
    }
    return satisfied;
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
 * Optimized to use local DSU checks for cycles avoiding O(N^2) behavior.
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
    const dsu = new DSU((rows + 1) * (cols + 1));
    let changed = true;

    // We loop until no more deductions can be made
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
                        if (row?.[gc] === EMPTY) {
                            const val = pt === FORWARD ? BACKWARD : FORWARD;
                            row[gc] = val;
                            changed = true;
                            // Update DSU
                            const u =
                                val === FORWARD
                                    ? getNodeIndex(gr, gc + 1, cols)
                                    : getNodeIndex(gr, gc, cols);
                            const v =
                                val === FORWARD
                                    ? getNodeIndex(gr + 1, gc, cols)
                                    : getNodeIndex(gr + 1, gc + 1, cols);
                            if (dsu.connected(u, v)) return false; // Cycle created by forced move
                            dsu.union(u, v);
                        }
                    }
                } else if (
                    confirmedIn + unknown.length === target &&
                    unknown.length > 0
                ) {
                    // All unknown must be "in"
                    for (const { gr, gc, pt } of unknown) {
                        const row = grid[gr];
                        if (row?.[gc] === EMPTY) {
                            row[gc] = pt;
                            changed = true;
                            // Update DSU
                            const u =
                                pt === FORWARD
                                    ? getNodeIndex(gr, gc + 1, cols)
                                    : getNodeIndex(gr, gc, cols);
                            const v =
                                pt === FORWARD
                                    ? getNodeIndex(gr + 1, gc, cols)
                                    : getNodeIndex(gr + 1, gc + 1, cols);
                            if (dsu.connected(u, v)) return false; // Cycle created by forced move
                            dsu.union(u, v);
                        }
                    }
                }
            }
        }

        if (changed) continue;

        // Rule 2: Cycle prevention (Optimized using DSU)
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const rowArr = grid[r];
                if (rowArr?.[c] !== EMPTY) continue;

                // Check FORWARD option: connects (r, c+1) and (r+1, c)
                const uF = getNodeIndex(r, c + 1, cols);
                const vF = getNodeIndex(r + 1, c, cols);
                const isCycleForward = dsu.connected(uF, vF);

                // Check BACKWARD option: connects (r, c) and (r+1, c+1)
                const uB = getNodeIndex(r, c, cols);
                const vB = getNodeIndex(r + 1, c + 1, cols);
                const isCycleBackward = dsu.connected(uB, vB);

                if (isCycleForward && isCycleBackward) {
                    return false; // Impossible state
                }

                if (isCycleForward) {
                    // Must be BACKWARD
                    rowArr[c] = BACKWARD;
                    changed = true;
                    dsu.union(uB, vB);
                } else if (isCycleBackward) {
                    // Must be FORWARD
                    rowArr[c] = FORWARD;
                    changed = true;
                    dsu.union(uF, vF);
                }
            }
        }
    }

    // Check if fully solved
    const isFull = grid.every(row => row.every(cell => cell !== EMPTY));
    if (!isFull) return false;

    // Verify constraints one last time (parity/counts)
    const currentNumbers = calculateNumbers(grid, rows, cols);
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            const target = maskedNumbers[r]?.[c];
            if (target !== null && target !== undefined) {
                if (currentNumbers[r]?.[c] !== target) return false;
            }
        }
    }

    return true;
}

function pruneHints(
    numbers: (number | null)[][],
    rows: number,
    cols: number,
    density: number
): (number | null)[][] {
    const maskedNumbers = numbers.map(r => [...r]);
    const coords: { r: number; c: number }[] = [];
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            coords.push({ r, c });
        }
    }

    // Shuffle coordinates for hint removal
    for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempI = coords[i];
        const tempJ = coords[j];
        if (tempI && tempJ) {
            coords[i] = tempJ;
            coords[j] = tempI;
        }
    }

    const targetHintCount = Math.floor((rows + 1) * (cols + 1) * density);
    let currentHintCount = 0;
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            if (maskedNumbers[r]?.[c] !== null) currentHintCount++;
        }
    }

    for (const { r, c } of coords) {
        if (currentHintCount <= targetHintCount) break;

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

    return maskedNumbers;
}

export function generatePuzzle(
    rows: number,
    cols: number
): { numbers: (number | null)[][]; solution: CellState[][] } {
    try {
        const seed = BigInt(
            Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        );
        const puzzle = generate_puzzle_wasm(
            rows,
            cols,
            seed,
            GAME_LOGIC_CONSTANTS.HINT_DENSITY
        ) as {
            numbers: (number | null)[][];
            solution: number[][];
        };

        // Even if WASM provides hints, we can prune them further in JS
        // to reach the target density if needed.
        const prunedNumbers = pruneHints(
            puzzle.numbers,
            rows,
            cols,
            GAME_LOGIC_CONSTANTS.HINT_DENSITY
        );

        return {
            numbers: prunedNumbers,
            solution: puzzle.solution as CellState[][],
        };
    } catch (_e) {
        // eslint-disable-next-line no-console
        console.warn('WASM puzzle generation failed, falling back to JS', _e);
    }

    let grid: CellState[][] = [];
    let success = false;

    // Constructive generation (Randomized Kruskal's)
    // Retry simplifies handling "stuck" states
    for (let attempt = 0; attempt < 50 && !success; attempt++) {
        grid = Array.from(
            { length: rows },
            () => Array(cols).fill(EMPTY) as CellState[]
        );
        const dsu = new DSU((rows + 1) * (cols + 1));
        const cells: { r: number; c: number }[] = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                cells.push({ r, c });
            }
        }

        // Shuffle cells
        for (let i = cells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = cells[i];
            const swap = cells[j];
            if (temp && swap) {
                cells[i] = swap;
                cells[j] = temp;
            }
        }

        let stuck = false;
        for (const { r, c } of cells) {
            // Forward: (r, c+1) - (r+1, c)
            const uF = getNodeIndex(r, c + 1, cols);
            const vF = getNodeIndex(r + 1, c, cols);
            const cycleF = dsu.connected(uF, vF);

            // Backward: (r, c) - (r+1, c+1)
            const uB = getNodeIndex(r, c, cols);
            const vB = getNodeIndex(r + 1, c + 1, cols);
            const cycleB = dsu.connected(uB, vB);

            if (cycleF && cycleB) {
                stuck = true;
                break;
            }

            const rowArr = grid[r];
            if (!rowArr) continue;

            if (cycleF) {
                // Must pick Backward
                rowArr[c] = BACKWARD;
                dsu.union(uB, vB);
            } else if (cycleB) {
                // Must pick Forward
                rowArr[c] = FORWARD;
                dsu.union(uF, vF);
            } else {
                // Random choice
                if (Math.random() < 0.5) {
                    rowArr[c] = FORWARD;
                    dsu.union(uF, vF);
                } else {
                    rowArr[c] = BACKWARD;
                    dsu.union(uB, vB);
                }
            }
        }

        if (!stuck) {
            success = true;
        }
    }

    if (!success) {
        // Fallback to simple pattern if generation fails (unlikely)
        grid = Array.from(
            { length: rows },
            (_, r) =>
                Array(cols).fill(
                    r % 2 === 0 ? FORWARD : BACKWARD
                ) as CellState[]
        );
    }

    // 2. Calculate numbers for this solution
    const fullNumbers = calculateNumbers(grid, rows, cols);
    const maskedNumbers = pruneHints(
        fullNumbers.map(r => r.map(n => n as number | null)),
        rows,
        cols,
        GAME_LOGIC_CONSTANTS.HINT_DENSITY
    );

    return { numbers: maskedNumbers, solution: grid };
}

export function getNextLogicalMove(
    state: SlantState
): { row: number; col: number; reverse?: boolean } | null {
    const { grid, numbers, rows, cols } = state;

    // Rule 1: Node constraints
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            const target = numbers[r]?.[c];
            if (target === null || target === undefined) continue;

            const touching = [
                { gr: r - 1, gc: c - 1, pt: BACKWARD },
                { gr: r - 1, gc: c, pt: FORWARD },
                { gr: r, gc: c - 1, pt: FORWARD },
                { gr: r, gc: c, pt: BACKWARD },
            ].filter(
                ({ gr, gc }) => gr >= 0 && gr < rows && gc >= 0 && gc < cols
            );

            let currentIn = 0;
            const unknown: { gr: number; gc: number; pt: CellState }[] = [];

            for (const cell of touching) {
                const current = grid[cell.gr]?.[cell.gc];
                if (current === EMPTY) {
                    unknown.push(cell);
                } else if (current === cell.pt) {
                    currentIn++;
                }
            }

            if (unknown.length > 0) {
                if (currentIn === target) {
                    // All unknown must be "the other one"
                    const move = unknown[0];
                    if (move) {
                        return {
                            row: move.gr,
                            col: move.gc,
                            reverse: move.pt === FORWARD, // Toggle to BACKWARD
                        };
                    }
                } else if (currentIn + unknown.length === target) {
                    // All unknown must be "in"
                    const move = unknown[0];
                    if (move) {
                        return {
                            row: move.gr,
                            col: move.gc,
                            reverse: move.pt === BACKWARD, // Toggle to FORWARD
                        };
                    }
                }
            }
        }
    }

    // Rule 2: Cycle Prevention
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r]?.[c] !== EMPTY) continue;

            // Try FORWARD
            const tempGrid = grid.map(rowArr => [...rowArr]);
            const tempRow = tempGrid[r];
            if (tempRow) {
                tempRow[c] = FORWARD;
                if (hasCycle(tempGrid, rows, cols)) {
                    // Must be BACKWARD
                    return { row: r, col: c, reverse: true };
                }

                // Try BACKWARD
                tempRow[c] = BACKWARD;
                if (hasCycle(tempGrid, rows, cols)) {
                    // Must be FORWARD
                    return { row: r, col: c, reverse: false };
                }
            }
        }
    }

    // If no deductive moves for empty cells, but incorrect slants exist, fix them
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const current = grid[r]?.[c];
            const target = state.solution[r]?.[c];
            if (
                current !== EMPTY &&
                current !== target &&
                target !== undefined
            ) {
                return {
                    row: r,
                    col: c,
                    reverse: target === BACKWARD,
                };
            }
        }
    }

    return null;
}

import { createGameReducer } from '../utils/gameUtils';

export const handleBoard = createGameReducer<SlantState, SlantAction>({
    getInitialState,
    customHandler: (state, action) => {
        if (action.type === 'toggle') {
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
                            val == null || val === currentNumbers[r]?.[c]
                    )
                );

                if (
                    numbersMatch &&
                    !hasCycle(newGrid, state.rows, state.cols)
                ) {
                    solved = true;
                }
            }

            const errorNodes = getErrorNodes(
                newGrid,
                state.numbers,
                state.rows,
                state.cols
            );
            const cycleCells = findCycles(newGrid, state.rows, state.cols);
            const satisfiedNodes = getSatisfiedNodes(
                newGrid,
                state.numbers,
                state.rows,
                state.cols
            );

            return {
                ...state,
                grid: newGrid,
                solved,
                errorNodes,
                cycleCells,
                satisfiedNodes,
            };
        }
        return state;
    },
});

export function getInitialState(rows: number, cols: number): SlantState {
    const { numbers, solution } = generatePuzzle(rows, cols);
    return {
        grid: Array.from(
            { length: rows },
            () => Array(cols).fill(EMPTY) as CellState[]
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
