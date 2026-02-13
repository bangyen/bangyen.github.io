import { hasCycle } from './cycleDetection';
import type { SlantState, CellState } from '../types';
import { EMPTY, FORWARD, BACKWARD } from '../types';

export function getNextLogicalMove(
    state: SlantState,
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
                ({ gr, gc }) => gr >= 0 && gr < rows && gc >= 0 && gc < cols,
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
                            reverse: move.pt !== FORWARD, // Toggle to BACKWARD
                        };
                    }
                } else if (currentIn + unknown.length === target) {
                    // All unknown must be "in"
                    const move = unknown[0];
                    if (move) {
                        return {
                            row: move.gr,
                            col: move.gc,
                            reverse: move.pt === FORWARD, // Toggle to FORWARD
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
                    reverse: target === FORWARD,
                };
            }
        }
    }

    return null;
}
