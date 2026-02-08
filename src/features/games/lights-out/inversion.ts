import init, { invert_matrix } from 'lights-out-wasm';

import { countBits, getMatrix, invertMatrix } from './matrixAlgebra';
import { evalPolynomial, getPolynomial } from './polynomialUtils';

// Initialize the Wasm module
init().catch((e: unknown) => {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Lights Out Wasm:', e);
});

// Cache for matrix inversions: "rows,cols" -> inverse matrix
const inverseCache: Record<string, bigint[]> = {};

export function getProduct(
    input: number[],
    rows: number,
    cols: number
): number[] {
    const key = `${rows.toString()},${cols.toString()}`;

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
