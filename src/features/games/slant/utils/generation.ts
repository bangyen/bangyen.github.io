import { GAME_LOGIC_CONSTANTS } from '../constants';
import { getNodeIndex } from './cycleDetection';
import type { CellState } from '../types';
import { EMPTY, FORWARD, BACKWARD } from '../types';
import { calculateNumbers } from './validation';
import { DSU } from '../../../../utils/DSU';

/**
 * Checks if a puzzle can be solved using deductive logic alone.
 * Optimized to use local DSU checks for cycles avoiding O(N^2) behavior.
 */
/**
 * Checks if a Slant puzzle can be solved using deductive logic alone.
 *
 * Logic involves:
 * 1. Node counts (checking if all remaining slashes around a node are forced).
 * 2. Cycle prevention (checking if a move would create a loop in the network).
 *
 * Optimized to use local DSU (Disjoint Set Union) for O(1) cycle detection.
 *
 * @param maskedNumbers - Clue numbers at node intersections
 * @param rows - Grid rows
 * @param cols - Grid columns
 * @returns True if the puzzle has a unique solution reached by logic.
 */
export function checkDeductiveSolvability(
    maskedNumbers: (number | null)[][],
    rows: number,
    cols: number,
): boolean {
    const grid: CellState[][] = Array.from(
        { length: rows },
        () => new Array(cols).fill(EMPTY) as CellState[],
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
                    ({ gr, gc }) =>
                        gr >= 0 && gr < rows && gc >= 0 && gc < cols,
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
            if (
                target !== null &&
                target !== undefined &&
                currentNumbers[r]?.[c] !== target
            )
                return false;
        }
    }

    return true;
}

/**
 * Randomly removes clue numbers while ensuring the puzzle remains deductively solvable.
 *
 * @param numbers - Complete grid of clues
 * @param rows - Dimensions
 * @param cols - Dimensions
 * @param density - Target percentage of nodes to keep as clues (0.0 to 1.0)
 * @returns Masked clues grid
 */
export function pruneHints(
    numbers: (number | null)[][],
    rows: number,
    cols: number,
    density: number,
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

/**
 * Generates a new Slant puzzle and its corresponding solution.
 *
 * Generation Pipeline:
 * Uses a JavaScript randomized constructive algorithm (Kruskal's-based approach)
 * and prunes clues to a desired density while maintaining unique solvability.
 *
 * @param rows - Vertical dimension
 * @param cols - Horizontal dimension
 * @returns Object containing the clue grid and the solution grid
 */
export function generatePuzzle(
    rows: number,
    cols: number,
): { numbers: (number | null)[][]; solution: CellState[][] } {
    let grid: CellState[][] = [];
    let success = false;

    // Constructive generation (Randomized Kruskal's)
    // Retry simplifies handling "stuck" states
    for (let attempt = 0; attempt < 50 && !success; attempt++) {
        grid = Array.from(
            { length: rows },
            () => new Array(cols).fill(EMPTY) as CellState[],
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
                new Array(cols).fill(
                    r % 2 === 0 ? FORWARD : BACKWARD,
                ) as CellState[],
        );
    }

    // 2. Calculate numbers for this solution
    const fullNumbers = calculateNumbers(grid, rows, cols);
    const maskedNumbers = pruneHints(
        fullNumbers.map(r => r.map(n => n as number | null)),
        rows,
        cols,
        GAME_LOGIC_CONSTANTS.HINT_DENSITY,
    );

    return { numbers: maskedNumbers, solution: grid };
}
