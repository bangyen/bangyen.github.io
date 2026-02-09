import init, { invert_matrix } from 'lights-out-wasm';
import { getPosKey } from '../../gameUtils';

import { countBits, invertMatrix } from './gf2Operations';
import { getMatrix } from './matrixOperations';
import { evalPolynomial, getPolynomial } from './polynomialUtils';

// Initialize the Wasm module
init().catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Lights Out Wasm:', e);
});

/**
 * Cache for matrix inversions.
 * Key format: "rows,cols" -> inverse matrix as bigint array
 */
const inverseCache: Record<string, bigint[]> = {};

/**
 * Computes the solution vector for a Lights Out puzzle using matrix inversion.
 *
 * This function:
 * 1. Generates the game matrix based on grid dimensions
 * 2. Computes the characteristic polynomial
 * 3. Evaluates the polynomial to get the product matrix
 * 4. Inverts the matrix (using Wasm for grids ≤64 cols, otherwise pure JS)
 * 5. Multiplies the inverse by the input state to get the solution
 *
 * Results are cached by grid dimensions for performance.
 *
 * @param input - Binary array representing the current puzzle state (1 = light on, 0 = light off)
 * @param rows - Number of rows in the grid
 * @param cols - Number of columns in the grid
 * @returns Binary array representing which buttons to press (1 = press, 0 = don't press)
 *
 * @example
 * ```ts
 * // Solve a 3x3 grid where only the center light is on
 * const solution = getProduct(
 *   [0,0,0, 0,1,0, 0,0,0],
 *   3,
 *   3
 * );
 * // solution tells you which buttons to press to turn off all lights
 * ```
 */
export function getProduct(
    input: number[],
    rows: number,
    cols: number
): number[] {
    const key = getPosKey(rows, cols);

    if (!inverseCache[key]) {
        const matrix = getMatrix(cols);
        const weights = getPolynomial(rows + 1);
        const product = evalPolynomial(matrix, weights);

        if (cols <= 64) {
            try {
                // Convert bigint[] to BigUint64Array for Wasm
                // Note: BigInts in JS are arbitrary precision, but for <=64 cols they fit in 64 bits.
                const input = new BigUint64Array(
                    product.map(b => BigInt.asUintN(64, b))
                );
                const result = invert_matrix(input, product.length);
                inverseCache[key] = Array.from(result);
            } catch (_e) {
                // eslint-disable-next-line no-console
                console.warn('Wasm inversion failed, falling back to JS', _e);
                inverseCache[key] = invertMatrix(product);
            }
        } else {
            inverseCache[key] = invertMatrix(product);
        }
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
