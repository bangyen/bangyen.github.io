/**
 * GF(2) Linear Algebra Utilities
 *
 * Provides core operations for matrices over the Galois Field with two elements (GF(2)).
 * In GF(2), addition is XOR and multiplication is AND.
 *
 * Matrices are represented as `bigint[]`, where each bigint is a bitmask representing a row.
 * For an n×n matrix, each row is an n-bit number where bit i represents the value at column i.
 */

/**
 * Counts the number of set bits (1s) in a bigint.
 *
 * Uses Brian Kernighan's algorithm for efficient bit counting.
 *
 * @param num - Non-negative bigint to count bits in
 * @returns Number of set bits
 * @throws Error if num is negative
 *
 * @example
 * ```ts
 * countBits(0b1011n); // 3
 * countBits(0b1111n); // 4
 * ```
 */
export function countBits(num: bigint): number {
    let count = 0;
    let n = num;
    if (n < 0n) {
        throw new Error('countBits called on negative bigint');
    }
    while (n > 0n) {
        n &= n - 1n;
        count++;
    }
    return count;
}

/**
 * Creates an identity matrix of given size in GF(2).
 *
 * The identity matrix has 1s on the diagonal and 0s elsewhere.
 *
 * @param size - Dimension of the square matrix
 * @returns Identity matrix as bigint array
 *
 * @example
 * ```ts
 * // 3×3 identity:
 * // [100]
 * // [010]
 * // [001]
 * getIdentity(3); // [0b100n, 0b010n, 0b001n]
 * ```
 */
export function getIdentity(size: number): bigint[] {
    const output = new Array<bigint>(size).fill(1n);
    for (let r = 0; r < size; r++) {
        const val = output[r];
        if (val !== undefined) output[r] = val << BigInt(size - r - 1);
    }
    return output;
}

/**
 * Adds two symmetric matrices in GF(2).
 *
 * In GF(2), addition is XOR (⊕).
 *
 * @param matrixA - First matrix
 * @param matrixB - Second matrix (must be same size)
 * @returns Sum matrix A ⊕ B
 */
export function addSym(matrixA: bigint[], matrixB: bigint[]): bigint[] {
    const size = matrixA.length;
    const output: bigint[] = [];
    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        const rowB = matrixB[r];
        if (rowA !== undefined && rowB !== undefined) {
            output.push(rowA ^ rowB);
        }
    }
    return output;
}

/**
 * Multiplies two symmetric matrices in GF(2).
 *
 * Standard matrix multiplication where addition is XOR and multiplication is AND.
 *
 * @param matrixA - First matrix
 * @param matrixB - Second matrix (must be same size)
 * @returns Product matrix A × B
 */
export function multiplySym(matrixA: bigint[], matrixB: bigint[]): bigint[] {
    const size = matrixA.length;
    const output: bigint[] = [];
    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        let outputRow = 0n;
        if (rowA !== undefined) {
            for (let c = 0; c < size; c++) {
                if (rowA & (1n << BigInt(size - 1 - c))) {
                    const rowB = matrixB[c];
                    if (rowB !== undefined) {
                        outputRow ^= rowB;
                    }
                }
            }
        }
        output.push(outputRow);
    }
    return output;
}

/**
 * Computes matrix raised to a power in GF(2) using binary exponentiation.
 *
 * Efficiently computes M^n using O(log n) multiplications.
 *
 * @param matrix - Base matrix
 * @param power - Exponent (non-negative integer)
 * @param cache - Optional cache to store computed powers
 * @returns Matrix raised to the given power
 *
 * @example
 * ```ts
 * const M = [[1, 0], [1, 1]]; // As bigint[]
 * const M_cubed = symmetricPow(M, 3); // M × M × M
 * ```
 */
export function symmetricPow(
    matrix: bigint[],
    power: number,
    cache?: Map<number, bigint[]>,
): bigint[] {
    const cached = cache?.get(power);
    if (cached) return cached;

    const size = matrix.length;
    let output = getIdentity(size);
    let base = [...matrix];
    let p = power;

    while (p > 0) {
        if (p % 2 === 1) output = multiplySym(output, base);
        base = multiplySym(base, base);
        p = Math.floor(p / 2);
    }

    cache?.set(power, output);
    return output;
}

/**
 * Sorts rows of two matrices simultaneously based on the values in the first matrix.
 * This is used as a helper for Gaussian elimination to find suitable pivot rows.
 *
 * @param matrix - The main matrix whose values determine the sort order
 * @param identity - A secondary matrix (usually an identity or target) whose rows are swapped in sync
 * @returns A tuple containing the sorted [original, secondary] matrices
 */
export function sortMatrices(
    matrix: bigint[],
    identity: bigint[],
): [bigint[], bigint[]] {
    const size = matrix.length;
    const sorted = [...new Array(size).keys()].sort((a, b) => {
        const valB = matrix[b];
        const valA = matrix[a];
        if (valB === undefined || valA === undefined) return 0;
        if (valB > valA) return 1;
        if (valB < valA) return -1;
        return 0;
    });

    const original = sorted.map(row => matrix[row] ?? 0n);
    const inverted = sorted.map(row => identity[row] ?? 0n);
    return [original, inverted];
}

/**
 * Inverts a matrix in GF(2) using Gaussian elimination.
 *
 * Performs row reduction on [M | I] to produce [I | M^(-1)].
 *
 * @param matrix - Invertible matrix to invert
 * @returns Inverse matrix
 * @throws May produce incorrect results if matrix is singular (non-invertible)
 *
 * @remarks
 * For large matrices (>64 columns), consider using WASM implementation for better performance.
 */
export function invertMatrix(matrix: bigint[]): bigint[] {
    const size = matrix.length;
    const identity = getIdentity(size);
    let original = matrix;
    let inverted = identity;

    for (let c = 0; c < size; c++) {
        const pow = 1n << BigInt(size - c - 1);
        [original, inverted] = sortMatrices(original, inverted);

        for (let r = 0; r < size; r++) {
            const alt = original[r];
            if (alt === undefined) continue;
            if (r === c) continue;

            if (alt & pow) {
                const rowC = original[c];
                const invC = inverted[c];
                if (rowC !== undefined) {
                    const targetRow = original[r];
                    if (targetRow !== undefined) original[r] = targetRow ^ rowC;
                }
                if (invC !== undefined) {
                    const targetInv = inverted[r];
                    if (targetInv !== undefined) inverted[r] = targetInv ^ invC;
                }
            }
        }
    }
    return inverted;
}

/**
 * Checks if a matrix is the identity matrix.
 *
 * @param matrix - Matrix to check
 * @returns True if matrix is identity, false otherwise
 */
export function isIdentity(matrix: bigint[]): boolean {
    const size = matrix.length;
    const identity = getIdentity(size);
    return matrix.every((val, i) => val === identity[i]);
}

/**
 * Checks if a matrix is the zero matrix.
 *
 * @param matrix - Matrix to check
 * @returns True if all entries are 0, false otherwise
 */
export function isZero(matrix: bigint[]): boolean {
    return matrix.every(val => val === 0n);
}
