import { CellState, EMPTY, FORWARD, BACKWARD } from './types';
import { getPosKey } from '@/utils/gameUtils';

export function calculateNumbers(
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

export function getErrorNodes(
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
                errors.add(getPosKey(r, c));
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
                errors.add(getPosKey(r, c));
            }
        }
    }
    return errors;
}

export function getSatisfiedNodes(
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
                satisfied.add(getPosKey(r, c));
            }
        }
    }
    return satisfied;
}
