/**
 * Pre-computed 3×3 Slant puzzle used by the tutorial Example animation.
 *
 * The puzzle follows a checkerboard pattern (\, /, \) on every row.
 * The solve order mirrors a logical deduction sequence: corner cells
 * first (forced by single-cell clues), then edges, then the interior.
 *
 * Numbers grid (4×4 for a 3×3 cell grid):
 *
 *     1  0  2  0
 *     1  2  2  1
 *     1  2  2  1
 *     0  2  0  1
 */

import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';

/** Dimensions of the example puzzle. */
export const EXAMPLE_DIMS = 3;

/**
 * Complete solution grid.
 *
 *   \  /  \
 *   \  /  \
 *   \  /  \
 */
export const EXAMPLE_SOLUTION: CellState[][] = [
    [BACKWARD, FORWARD, BACKWARD],
    [BACKWARD, FORWARD, BACKWARD],
    [BACKWARD, FORWARD, BACKWARD],
];

/** Clue numbers at every corner of the 3×3 grid (4×4 array). */
export const EXAMPLE_NUMBERS: (number | null)[][] = [
    [1, 0, 2, 0],
    [1, 2, 2, 1],
    [1, 2, 2, 1],
    [0, 2, 0, 1],
];

/**
 * Order in which cells are filled during the animation.
 * Each entry is [row, col]. The sequence follows a logical
 * deduction path:
 *   1. Corner cells forced by single-cell clues
 *   2. Edge cells deduced from partially-satisfied clues
 *   3. Interior cells resolved last
 */
export const SOLVE_ORDER: [number, number][] = [
    [0, 0], // \ — corner (0,0)=1 forces backslash
    [2, 2], // \ — corner (3,3)=1 forces backslash
    [0, 2], // \ — corner (0,3)=0 prevents forward slash
    [2, 0], // \ — corner (3,0)=0 prevents forward slash
    [0, 1], // / — corner (0,2)=2 needs one more
    [2, 1], // / — corner (2,2)=2 needs one more
    [1, 0], // \ — corner (1,1)=2 already full, must not add
    [1, 1], // / — corner (1,1)=2 already full, must not add
    [1, 2], // \ — last cell, corner (1,2)=2 needs it
];

/**
 * Generates intermediate board states for the animation.
 * Returns an array of SOLVE_ORDER.length + 2 grids:
 *   - index 0: empty board
 *   - index 1..N: one cell placed per frame
 *   - index N+1: duplicate of the solved board (pause frame)
 */
export function getExampleFrames(): CellState[][][] {
    const frames: CellState[][][] = [];

    // Start with an empty board.
    const empty: CellState[][] = Array.from({ length: EXAMPLE_DIMS }, () =>
        new Array<CellState>(EXAMPLE_DIMS).fill(EMPTY),
    );
    frames.push(empty);

    // Build up one cell at a time.
    let current = empty.map(row => [...row]);
    for (const [r, c] of SOLVE_ORDER) {
        current = current.map(row => [...row]);
        const value = EXAMPLE_SOLUTION[r]?.[c];
        if (value !== undefined) {
            const row = current[r];
            if (row) {
                row[c] = value;
            }
        }
        frames.push(current);
    }

    // Add a "hold" frame so the solved state lingers before looping.
    frames.push(current.map(row => [...row]));

    return frames;
}
