import { getIdentity, countBits } from './gf2Operations';

/**
 * High-level matrix operations and solvers for Lights Out
 */

/**
 * Returns the adjacency matrix for a 1D line of lights.
 * Used as a base for building the 2D grid matrix.
 */
/**
 * Generates the adjacency matrix for a 1D line of $n$ lights.
 * In a 1D grid, each light $i$ affects itself and its neighbors $(i-1, i+1)$.
 * This matrix is the basis for constructing 2D grid operators in GF(2).
 *
 * @param cols - Number of columns (lights) in the 1D line
 * @returns Adjacency matrix as an array of bitmask rows (bigint[])
 */
export function getMatrix(cols: number): bigint[] {
    if (cols === 1) return [1n];
    const first = 7n << BigInt(cols - 2);
    const matrix = [first];

    for (let k = 1; k < cols; k++) {
        const prev = matrix[k - 1];
        if (prev !== undefined) {
            const next = prev >> 1n;
            matrix.push(next);
        }
    }

    const firstVal = matrix[0];
    if (firstVal !== undefined) matrix[0] = firstVal - (1n << BigInt(cols));
    return matrix;
}

/**
 * Computes the kernel basis (nullspace) of a matrix in GF(2).
 * The kernel represents state patterns that result in a zero vector when acted upon.
 * In Lights Out, these correspond to "quiet patterns" that don't change any lights.
 *
 * @param matrix - Input matrix rows
 * @param size - Dimension of the matrix (number of columns)
 * @returns Array of basis vectors for the kernel
 */
export function getKernelBasis(matrix: bigint[], size: number): bigint[] {
    const rows = [...matrix];
    const basis: bigint[] = getIdentity(size);
    let pivotRow = 0;

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const basisP = basis[p];
            const rowPivot = rows[pivotRow];
            const basisPivot = basis[pivotRow];

            if (
                rowP !== undefined &&
                basisP !== undefined &&
                rowPivot !== undefined &&
                basisPivot !== undefined
            ) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                basis[pivotRow] = basisP;
                basis[p] = basisPivot;

                const rP = rows[pivotRow] ?? 0n;
                const bP = basis[pivotRow] ?? 0n;

                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    const basisR = basis[r];
                    if (
                        r !== pivotRow &&
                        rowR !== undefined &&
                        basisR !== undefined &&
                        rowR & pow
                    ) {
                        rows[r] = rowR ^ rP;
                        basis[r] = basisR ^ bP;
                    }
                }
            }
            pivotRow++;
        }
    }

    const kernel: bigint[] = [];
    for (let i = pivotRow; i < rows.length; i++) {
        const rowBasis = basis[i];
        if (rowBasis !== undefined) {
            kernel.push(rowBasis);
        }
    }
    return kernel;
}

/**
 * Finds the solution toggle pattern with the minimum number of clicks.
 * Uses brute force for kernels <= 20 bits.
 */
/**
 * Finds the solution toggle pattern with the minimum number of clicks for a target state.
 *
 * Optimization:
 * For grids with a large kernel (>20 dimensions), it returns a particular solution.
 * For smaller kernels, it exhaustively searches the subspace to find the absolute min-weight vector.
 *
 * @param matrix - Linear operator (coefficient matrix)
 * @param target - Target state bitmask
 * @param size - Dimension of the state vector
 * @returns Min-weight solution bitmask, or -1n if no solution exists
 */
export function getMinWeightSolution(
    matrix: bigint[],
    target: bigint,
    size: number
): bigint {
    const rows = [...matrix];
    const basis: bigint[] = getIdentity(size);
    let pivotRow = 0;
    const pivots: number[] = [];

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const basisP = basis[p];
            const rowPivot = rows[pivotRow];
            const basisPivot = basis[pivotRow];

            if (
                rowP !== undefined &&
                basisP !== undefined &&
                rowPivot !== undefined &&
                basisPivot !== undefined
            ) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                basis[pivotRow] = basisP;
                basis[p] = basisPivot;

                const rP = rows[pivotRow] ?? 0n;
                const bP = basis[pivotRow] ?? 0n;

                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    const basisR = basis[r];
                    if (
                        r !== pivotRow &&
                        rowR !== undefined &&
                        basisR !== undefined &&
                        rowR & pow
                    ) {
                        rows[r] = rowR ^ rP;
                        basis[r] = basisR ^ bP;
                    }
                }
            }
            pivots[pivotRow] = c;
            pivotRow++;
        }
    }

    let particular = 0n;
    let current = target;
    for (let i = 0; i < pivotRow; i++) {
        const c = pivots[i];
        if (c === undefined) continue;

        const pow = 1n << BigInt(size - 1 - c);
        if (current & pow) {
            const rowI = rows[i];
            const basisI = basis[i];
            if (rowI !== undefined && basisI !== undefined) {
                current ^= rowI;
                particular ^= basisI;
            }
        }
    }

    if (current !== 0n) return -1n;

    const kernel = getKernelBasis(matrix, size);
    if (kernel.length > 20) return particular;

    let minSol = particular;
    let minWeight = countBits(particular);

    for (let i = 1; i < 1 << kernel.length; i++) {
        let candidate = particular;
        for (let j = 0; j < kernel.length; j++) {
            if ((i >> j) & 1) {
                const kernelJ = kernel[j];
                if (kernelJ !== undefined) {
                    candidate ^= kernelJ;
                }
            }
        }
        const weight = countBits(candidate);
        if (weight < minWeight) {
            minWeight = weight;
            minSol = candidate;
        }
    }

    return minSol;
}

/**
 * Computes the image basis of a matrix in GF(2).
 * The image represents all states that can be reached/expressed by the operator.
 * In solver context, this determines the subspace of solvable configurations.
 *
 * @param matrix - Input matrix
 * @param size - Matrix column dimension
 * @returns Array of basis vectors for the column space
 */
export function getImageBasis(matrix: bigint[], size: number): bigint[] {
    const rows = [...matrix];
    let pivotRow = 0;

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const rowPivot = rows[pivotRow];
            if (rowP !== undefined && rowPivot !== undefined) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                const rP = rows[pivotRow] ?? 0n;
                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    if (r !== pivotRow && rowR !== undefined && rowR & pow) {
                        rows[r] = rowR ^ rP;
                    }
                }
            }
            pivotRow++;
        }
    }

    return rows.slice(0, pivotRow);
}

/**
 * Generates a mapping from image basis vectors to their corresponding domain vectors (toggles).
 * Used to visualize how specific reachable states are constructed.
 *
 * @param matrix - Linear operator
 * @param size - Dimension
 * @returns Array of { state, toggle } objects mapping output vectors to input vectors
 */
export function getImageMapping(
    matrix: bigint[],
    size: number
): { state: bigint; toggle: bigint }[] {
    const rows = [...matrix];
    const mapping: bigint[] = getIdentity(size);
    let pivotRow = 0;

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const mapP = mapping[p];
            const rowPivot = rows[pivotRow];
            const mapPivot = mapping[pivotRow];

            if (
                rowP !== undefined &&
                mapP !== undefined &&
                rowPivot !== undefined &&
                mapPivot !== undefined
            ) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                mapping[pivotRow] = mapP;
                mapping[p] = mapPivot;

                const rP = rows[pivotRow] ?? 0n;
                const mP = mapping[pivotRow] ?? 0n;

                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    const mapR = mapping[r];
                    if (
                        r !== pivotRow &&
                        rowR !== undefined &&
                        mapR !== undefined &&
                        rowR & pow
                    ) {
                        rows[r] = rowR ^ rP;
                        mapping[r] = mapR ^ mP;
                    }
                }
            }
            pivotRow++;
        }
    }

    const result: { state: bigint; toggle: bigint }[] = [];
    for (let i = 0; i < pivotRow; i++) {
        const state = rows[i];
        const toggle = mapping[i];
        if (state !== undefined && toggle !== undefined) {
            result.push({ state, toggle });
        }
    }
    return result;
}
