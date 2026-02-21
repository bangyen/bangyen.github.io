import { countBits, invertMatrix } from './gf2Operations';
import { getMatrix } from './matrixOperations';
import { evalPolynomial, getPolynomial } from './polynomialUtils';

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
 * @returns Binary array representing which buttons to press to solve the puzzle
 */
export function getProduct(
    input: number[],
    rows: number,
    cols: number,
): number[] {
    const key = `${rows.toString()},${cols.toString()}`;

    if (!inverseCache[key]) {
        const matrix = getMatrix(cols);
        const weights = getPolynomial(rows + 1);
        const product = evalPolynomial(matrix, weights);

        inverseCache[key] = invertMatrix(product);
    }

    const inverse = inverseCache[key] as bigint[] | undefined;
    const binaryStr = input.join('');
    const binary = binaryStr ? BigInt('0b' + binaryStr) : 0n;

    /**
     * Computes the parity (XOR) of a row multiplied by the input vector.
     * @param row - Matrix row as bigint
     * @returns 1 if odd number of 1s, 0 if even
     */
    const getParity = (row: bigint): number => {
        const value = row & binary;
        const count = countBits(value);
        return count & 1;
    };

    if (inverse === undefined) {
        throw new Error('Inverse matrix not found in cache');
    }

    return inverse.map(getParity);
}
