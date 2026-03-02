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
 * Cache for matrix inversions.
 * Key format: "rows,cols" -> inverse matrix as bigint array
 */
const inverseCache: Record<string, bigint[]> = {};

/**
 * Computes the solution vector for a Lights Out puzzle using algebraic matrix inversion.
 *
 * This function implements the algebraic solution for an $n \times m$ grid.
 * The system of equations can be reduced from $n \cdot m$ variables to a much smaller
 * system of $n$ variables by realizing that the relation between rows follows the
 * polynomial sequence $P_k(A)$.
 *
 * Specifically, the entire board state is solvable if and only if $P_{m+1}(A)$ is invertible
 * (or the target state is in its image). The solution is found by:
 * 1. Generating $A$, the $n \times n$ adjacency matrix for a 1D line.
 * 2. Computing $P_{m+1}(x)$ from the predefined sequence.
 * 3. Evaluating $M = P_{m+1}(A)$ in GF(2).
 * 4. Finding $M^{-1}$ (the inverse operator).
 * 5. Operating on the initial state vector with the inverse.
 *
 * @param input - Binary array representing the current puzzle state (1 = on)
 * @param rows - Number of rows ($m$)
 * @param cols - Number of columns ($n$)
 * @returns Binary array representing which buttons to press to solve the puzzle,
 *          or null if no unique solution exists (singular matrix).
 */
export function calculateSolutionVector(
    input: number[],
    rows: number,
    cols: number,
): number[] | null {
    const key = `${rows.toString()},${cols.toString()}`;

    if (!inverseCache[key]) {
        const matrix = getMatrix(cols);
        const weights = getPolynomial(rows + 1);
        const product = evalPolynomial(matrix, weights);

        const solution = getSolutionMatrix(product);
        if (solution === null) return null;
        inverseCache[key] = solution;
    }

    const inverse = inverseCache[key] as bigint[] | undefined;
    if (inverse === undefined) return null;

    const binary = input.reduce(
        (acc, val, i) => acc | (BigInt(val) << BigInt(i)),
        0n,
    );

    return inverse.map(row => countBits(row & binary) & 1);
}

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
    return Array.from({ length: size }, (_, i) => 1n << BigInt(i));
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
                if (rowA & (1n << BigInt(c))) {
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
 * Computes a "solution matrix" S such that x = S*b is a particular solution to Mx=b.
 * If the matrix is invertible, S is the unique inverse matrix.
 * If the matrix is singular, S provides one valid solution for any b in the image of M.
 *
 * Uses Gaussian-Jordan elimination to compute the reduced row-echelon form of [M | I].
 * For each pivot column j in row i, row j of S becomes row i of E (the operations matrix).
 *
 * @param matrix - Matrix M to solve for
 * @returns Solution matrix S, or null if M is the zero matrix (unlikely in this context)
 */
export function getSolutionMatrix(matrix: bigint[]): bigint[] | null {
    const size = matrix.length;
    const identity = getIdentity(size);
    const original = [...matrix];
    const operations = [...identity];

    let pivotRow = 0;
    const pivotCols = new Array<number>(size).fill(-1);

    for (let c = 0; c < size; c++) {
        const pow = 1n << BigInt(c);

        // Find pivot row
        let pivot = -1;
        for (let r = pivotRow; r < size; r++) {
            const row = original[r];
            if (row !== undefined && row & pow) {
                pivot = r;
                break;
            }
        }

        if (pivot === -1) continue;

        // Swap rows in both original and operations matrices
        const rowToPivot = original[pivot];
        const rowToCurrent = original[pivotRow];
        const opToPivot = operations[pivot];
        const opToCurrent = operations[pivotRow];

        if (
            rowToPivot !== undefined &&
            rowToCurrent !== undefined &&
            opToPivot !== undefined &&
            opToCurrent !== undefined
        ) {
            original[pivotRow] = rowToPivot;
            original[pivot] = rowToCurrent;
            operations[pivotRow] = opToPivot;
            operations[pivot] = opToCurrent;
        }

        const pRow = original[pivotRow];
        const oRow = operations[pivotRow];

        if (pRow === undefined || oRow === undefined) continue;

        // Eliminate column c in all other rows
        for (let r = 0; r < size; r++) {
            if (r === pivotRow) continue;
            const targetRow = original[r];
            const targetOp = operations[r];
            if (
                targetRow !== undefined &&
                targetOp !== undefined &&
                targetRow & pow
            ) {
                original[r] = targetRow ^ pRow;
                operations[r] = targetOp ^ oRow;
            }
        }

        pivotCols[pivotRow] = c;
        pivotRow++;
    }

    if (pivotRow === 0) return null;

    // Build the solution matrix S
    // If row i had a pivot in column j, then row j of S is row i of operations
    const solutionMatrix = new Array<bigint>(size).fill(0n);
    for (let i = 0; i < pivotRow; i++) {
        const targetCol = pivotCols[i];
        const opRow = operations[i];
        if (
            targetCol !== undefined &&
            targetCol !== -1 &&
            opRow !== undefined
        ) {
            solutionMatrix[targetCol] = opRow;
        }
    }

    return solutionMatrix;
}

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
    return Array.from({ length: cols }, (_, i) => {
        let row = 1n << BigInt(i);
        if (i > 0) row |= 1n << BigInt(i - 1);
        if (i < cols - 1) row |= 1n << BigInt(i + 1);
        return row;
    });
}

/**
 * Computes the k-th polynomial in the specific sequence used for algebraic analysis of Lights Out.
 *
 * This sequence of polynomials is defined by:
 * $P_0(x) = 0$
 * $P_1(x) = 1$
 * $P_k(x) = x \cdot P_{k-1}(x) + P_{k-2}(x)$ (for $k \ge 2$)
 *
 * @param index - The index $k$ in the sequence
 * @returns The $k$-th polynomial as a bitmask (bigint)
 */
export function getPolynomial(index: number): bigint {
    const output = [0n, 1n];

    for (let k = 1; k < index; k++) {
        const curr = output[k];
        const prev = output[k - 1];
        if (curr !== undefined && prev !== undefined) {
            const double = curr << 1n;
            output.push(double ^ prev);
        }
    }

    return output[index] ?? 0n;
}

/**
 * Evaluates a polynomial p(M) where M is a matrix in GF(2).
 *
 * @param matrix - The symbolic matrix M
 * @param poly - The polynomial as a bigint
 * @param cache - Optional cache for matrix powers
 * @returns The resulting matrix p(M)
 */
export function evalPolynomial(
    matrix: bigint[],
    poly: bigint,
    cache?: Map<number, bigint[]>,
): bigint[] {
    const size = matrix.length;
    let output = new Array<bigint>(size).fill(0n);
    let degree = 0;

    let p = poly;
    while (p > 0n) {
        if (p & 1n) {
            const power = symmetricPow(matrix, degree, cache);
            output = addSym(output, power);
        }

        p >>= 1n;
        degree++;
    }

    return output;
}
