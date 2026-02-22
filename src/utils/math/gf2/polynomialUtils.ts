import { addSym, symmetricPow } from './gf2Operations';

/**
 * Computes the k-th polynomial in the specific sequence used for algebraic analysis of Lights Out.
 *
 * This sequence of polynomials is defined by:
 * $P_0(x) = 0$
 * $P_1(x) = 1$
 * $P_k(x) = x \cdot P_{k-1}(x) + P_{k-2}(x)$ (for $k \ge 2$)
 *
 * These polynomials are the characteristic polynomials of the adjacency matrix for paths/cycles.
 * Specifically, for an $n$-length 1D line of lights with adjacency matrix $A$, the state
 * after $k$ steps of row-reduction can be described by these polynomials evaluated at $A$.
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
