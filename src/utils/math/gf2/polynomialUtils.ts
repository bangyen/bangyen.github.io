import {
    addSym,
    getIdentity,
    isIdentity,
    isZero,
    symmetricPow,
} from './gf2Operations';
import { getMatrix } from './matrixOperations';

/**
 * Converts a number to its superscript string representation for mathematical display.
 *
 * @param num - The power/number to convert
 * @returns Superscript string (e.g., "^{2}")
 */
export function toSuperscript(num: number): string {
    return `^{${String(num)}}`;
}

/**
 * Converts a polynomial represented as a bigint in GF(2) to a human-readable string.
 *
 * @param p - The polynomial as a bitmask (e.g., 0b1011 represents x³ + x + 1)
 * @returns Formatted string (e.g., "x^{3} + x + 1")
 */
export function polyToString(p: bigint): string {
    if (p === 0n) return '0';
    if (p === 1n) return '1';
    const terms: string[] = [];
    const bits = p.toString(2);
    for (let i = 0; i < bits.length; i++) {
        if (bits[bits.length - 1 - i] === '1') {
            if (i === 0) terms.push('1');
            else if (i === 1) terms.push('x');
            else terms.push(`x${toSuperscript(i)}`);
        }
    }
    return terms.reverse().join(' + ');
}

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
 * Returns the degree of a polynomial in GF(2).
 *
 * @param p - The polynomial as a bigint
 * @returns Degree of the polynomial, or -1 for the zero polynomial
 */
export function polyDegree(p: bigint): number {
    if (p === 0n) return -1;
    return p.toString(2).length - 1;
}

/**
 * Performs polynomial division in GF(2)[x].
 *
 * @param a - Dividend polynomial
 * @param b - Divisor polynomial
 * @returns Quotient and remainder polynomials
 */
export function polyDiv(
    a: bigint,
    b: bigint
): { quotient: bigint; remainder: bigint } {
    if (b === 0n) throw new Error('Division by zero polynomial');
    let quotient = 0n;
    let remainder = a;
    const degreeB = polyDegree(b);

    while (polyDegree(remainder) >= degreeB) {
        const shift = polyDegree(remainder) - degreeB;
        quotient ^= 1n << BigInt(shift);
        remainder ^= b << BigInt(shift);
    }

    return { quotient, remainder };
}

/**
 * Computes a modulo b in GF(2)[x].
 *
 * @param a - Dividend
 * @param b - Divisor
 * @returns Remainder
 */
export function polyMod(a: bigint, b: bigint): bigint {
    return polyDiv(a, b).remainder;
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
    cache?: Map<number, bigint[]>
): bigint[] {
    const size = matrix.length;
    let output = Array<bigint>(size).fill(0n);
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

/**
 * Computes the minimal polynomial of a matrix A in GF(2).
 * This uses a Krylov subspace methods to find the smallest p such that p(A) = 0.
 *
 * @param A - The matrix A
 * @returns The minimal polynomial as a bigint
 */
export function getMinimalPolynomial(A: bigint[]): bigint {
    const size = A.length;

    function flatten(mat: bigint[]): bigint {
        let res = 0n;
        for (const r of mat) {
            res = (res << BigInt(size)) | r;
        }
        return res;
    }

    const basis: { vector: bigint; poly: bigint }[] = [];

    for (let d = 0; d <= size * size; d++) {
        const poly = 1n << BigInt(d);
        const Ad = evalPolynomial(A, poly);
        let v = flatten(Ad);
        let currentPoly = poly;

        for (const b of basis) {
            if (polyDegree(v ^ b.vector) < polyDegree(v)) {
                v ^= b.vector;
                currentPoly ^= b.poly;
            }
        }

        if (v === 0n) {
            return currentPoly;
        } else {
            basis.push({ vector: v, poly: currentPoly });
            basis.sort((a, b) => (a.vector > b.vector ? -1 : 1));
        }
    }

    return getPolynomial(size + 1);
}

const irreduciblesCache: bigint[] = [2n, 3n]; // x, x+1
let maxCachedDegree = 1;

/**
 * Computes all irreducible polynomials in GF(2)[x] up to a specified degree.
 * Irreducible polynomials are the "prime" polynomials in GF(2)[x].
 *
 * @param maxDegree - The maximum degree to check
 * @returns Array of irreducible polynomials as bigints
 */
export function getIrreducibles(maxDegree: number): bigint[] {
    if (maxDegree <= maxCachedDegree) {
        return irreduciblesCache.filter(p => polyDegree(p) <= maxDegree);
    }

    for (
        let p = 1n << BigInt(maxCachedDegree + 1);
        polyDegree(p) <= maxDegree;
        p++
    ) {
        let isIrreducible = true;
        const degP = polyDegree(p);
        for (const f of irreduciblesCache) {
            if (polyDegree(f) > degP / 2) break;
            if (polyMod(p, f) === 0n) {
                isIrreducible = false;
                break;
            }
        }
        if (isIrreducible) irreduciblesCache.push(p);
    }

    maxCachedDegree = maxDegree;
    return irreduciblesCache;
}

/**
 * Factors a polynomial into irreducible factors in GF(2)[x].
 *
 * @param p - The polynomial to factor
 * @returns Array of { factor, exponent } pairs
 */
export function factorPoly(p: bigint): { factor: bigint; exponent: number }[] {
    if (p === 0n) return [];
    if (p === 1n) return [];
    const factors: { factor: bigint; exponent: number }[] = [];
    let rem = p;
    const irreducibles = getIrreducibles(polyDegree(p));

    for (const f of irreducibles) {
        if (polyMod(rem, f) === 0n) {
            let exponent = 0;
            while (polyMod(rem, f) === 0n) {
                rem = polyDiv(rem, f).quotient;
                exponent++;
            }
            factors.push({ factor: f, exponent });
        }
        if (rem === 1n) break;
    }

    return factors;
}

/**
 * Computes all divisors of a natural number.
 *
 * @param n - The number to compute divisors for
 * @returns Sorted array of divisors
 */
export function getDivisors(n: number): number[] {
    const divisors: number[] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            divisors.push(i);
            if (i !== n / i) {
                divisors.push(n / i);
            }
        }
    }
    return divisors.sort((a, b) => a - b);
}

function findMinimalPeriod(z: number, R: number[]): { z: number; R: number[] } {
    for (const candidate of getDivisors(z)) {
        if (candidate === 1 || candidate === z) continue;

        const candidateR = R.map(r => r % candidate)
            .filter((r, i, arr) => arr.indexOf(r) === i)
            .sort((a, b) => a - b);

        const expectedR: number[] = [];
        for (let v = 0; v < z; v++) {
            if (candidateR.includes(v % candidate)) {
                expectedR.push(v);
            }
        }

        if (
            JSON.stringify(R) === JSON.stringify(expectedR) &&
            candidateR.length < R.length
        ) {
            return findMinimalPeriod(candidate, candidateR);
        }
    }

    return { z, R };
}

/**
 * Represents the algebraic period data for a Lights Out grid.
 */
export interface Pattern {
    /** Grid dimension n */
    n: number;
    /** Minimal period z such that p is a divisor of x^z - 1 mod some polynomial */
    z: number;
    /** Indices of polynomials in the sequence that are the identity matrix */
    R: number[];
    /** Sequence period */
    z_seq: number;
}

/**
 * Finds the algebraic period pattern for an $n \times m$ Lights Out grid.
 *
 * This function calculates the minimal period $z$ of the polynomial sequence modulo
 * the characteristic polynomial of grid dimension $n$. This periodic behavior allows
 * us to predict property patterns (like solvability and nullity) for grids of
 * arbitrary height $m$, as these properties depend on $P_{m+1}(A)$.
 *
 * It uses a space-optimized sequence progression to find when the identity state
 * (or a cycle thereof) repeats.
 *
 * @param n - The fixed grid dimension (e.g., width)
 * @returns The pattern data including period $z$ and indices $R$ where $P_k(A) = I$.
 */
export function findPattern(n: number): Pattern {
    const A = getMatrix(n);
    const I = getIdentity(n);
    const Zero = Array.from({ length: n }, () => 0n);

    const sparseA: number[][] = [];
    for (let r = 0; r < n; r++) {
        const rowIndices: number[] = [];
        const rowVal = A[r];
        if (rowVal !== undefined) {
            for (let c = 0; c < n; c++) {
                if (rowVal & (1n << BigInt(n - 1 - c))) {
                    rowIndices.push(c);
                }
            }
        }
        sparseA.push(rowIndices);
    }

    let prev = [...Zero];
    let curr = [...I];
    const R: number[] = [0];

    for (let k = 2; k <= 10000000; k++) {
        const next: bigint[] = [];
        for (let r = 0; r < n; r++) {
            let nextRow = prev[r] ?? 0n;
            const indices = sparseA[r];
            if (indices) {
                for (const c of indices) {
                    const currRow = curr[c];
                    if (currRow !== undefined) {
                        nextRow ^= currRow;
                    }
                }
            }
            next.push(nextRow);
        }

        if (isIdentity(next)) {
            R.push(k - 1);
        }

        if (isIdentity(next) && isZero(curr)) {
            const fullZ = k - 1;
            const R_filtered = R.filter(r => r !== fullZ);
            const { z: minZ, R: minR } = findMinimalPeriod(fullZ, R_filtered);
            return { n, z: minZ, R: minR, z_seq: fullZ };
        }

        prev = curr;
        curr = next;
    }

    throw new Error(`Period not found for n=${n.toString()}`);
}
