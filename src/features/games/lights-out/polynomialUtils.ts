import {
    addSym,
    getIdentity,
    getMatrix,
    isIdentity,
    isZero,
    symmetricPow,
} from './matrixAlgebra';

export function toSuperscript(num: number): string {
    return `^{${String(num)}}`;
}

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

export function polyDegree(p: bigint): number {
    if (p === 0n) return -1;
    return p.toString(2).length - 1;
}

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

export function polyMod(a: bigint, b: bigint): bigint {
    return polyDiv(a, b).remainder;
}

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

export interface Pattern {
    n: number;
    z: number;
    R: number[];
    z_seq: number;
}

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
