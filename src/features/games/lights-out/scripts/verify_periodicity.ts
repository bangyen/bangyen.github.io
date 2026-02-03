/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
    Lights Out Periodicity Verifier
    
    This script verifies the modular periodicity patterns (m mod z in {R}) 
    for the Identity Matrix property.
    
    It uses Matrix Binary Exponentiation to verify grid heights in O(log m)
    time, making it possible to check thousands of rows in seconds.
    
    Usage:
    npx tsx verify_periodicity.ts [n] [limit]
    
    Examples:
    - npx tsx verify_periodicity.ts 5       (Find pattern for n=5)
    - npx tsx verify_periodicity.ts 1-15    (Find patterns for n=1..15)
    - npx tsx verify_periodicity.ts 5 100   (Find n=5 and verify up to m=100)
*/

import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    getIdentity,
} from '../matrices';

function checkIdentity(m: number, n: number): boolean {
    const matrix = getMatrix(n);
    const poly = getPolynomial(m + 1);
    const powCache = new Map<number, bigint[]>();
    const product = evalPolynomial(matrix, poly, powCache);
    const identity = getIdentity(n);
    return product.every((val, i) => val === identity[i]);
}

function isIdentity(matrix: bigint[]): boolean {
    const size = matrix.length;
    const identity = getIdentity(size);
    return matrix.every((val, i) => val === identity[i]);
}

function isZero(matrix: bigint[]): boolean {
    return matrix.every(val => val === 0n);
}

interface Pattern {
    n: number;
    z: number;
    R: number[];
}

function getDivisors(n: number): number[] {
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
    // Try each divisor of z, starting from smallest (but skip 1 and z itself)
    for (const candidate of getDivisors(z)) {
        if (candidate === 1 || candidate === z) continue;

        // Check if this divisor works as a period
        // For it to work, R mod candidate must equal the unique remainders
        const candidateR = R.map(r => r % candidate)
            .filter((r, i, arr) => arr.indexOf(r) === i)
            .sort((a, b) => a - b);

        // The key insight: if candidate is a valid period, then for ANY m,
        // m is in the identity set IFF (m mod candidate) is in candidateR
        // This means: R should be exactly the set of all values < z where (v mod candidate) ∈ candidateR
        const expectedR: number[] = [];
        for (let v = 0; v < z; v++) {
            if (candidateR.includes(v % candidate)) {
                expectedR.push(v);
            }
        }

        // Check if R matches expectedR
        if (
            JSON.stringify(R) === JSON.stringify(expectedR) &&
            candidateR.length < R.length
        ) {
            // Found a valid simpler period, recurse
            return findMinimalPeriod(candidate, candidateR);
        }
    }

    // No simpler period found
    return { z, R };
}

function findPattern(n: number): Pattern {
    const A = getMatrix(n);
    const I = getIdentity(n);
    const Zero: bigint[] = Array(n).fill(0n) as bigint[];

    // Pre-calculate sparse representation of matrix A
    // Since A is tridiagonal, this will be very efficient.
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

    // Iteratively compute Fibonacci polynomials until we find the period
    // f_{k+1}(A) = A * f_k(A) + f_{k-1}(A)
    // Using sparse multiplication since A is fixed and sparse.
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
            // Found full period, now find minimal period
            const fullZ = k - 1;
            // Remove the period itself from R before finding minimal period
            const R_filtered = R.filter(r => r !== fullZ);
            const { z: minZ, R: minR } = findMinimalPeriod(fullZ, R_filtered);
            return { n, z: minZ, R: minR };
        }

        prev = curr;
        curr = next;
    }

    throw new Error(`Period not found for n=${n}`);
}

function main() {
    const nArg = process.argv[2] ?? '1-10';
    const limitArg = process.argv[3];

    let nRange: number[] = [];
    if (nArg.includes('-')) {
        const [start, end] = nArg.split('-').map(v => parseInt(v, 10));
        if (start !== undefined && end !== undefined) {
            for (let i = start; i <= end; i++) nRange.push(i);
        }
    } else {
        nRange = [parseInt(nArg, 10)];
    }

    console.log(`Finding periodicity patterns for n=${nArg}...\n`);

    // Collect all patterns first for table formatting
    const patterns: Pattern[] = [];
    for (const n of nRange) {
        if (isNaN(n)) continue;
        patterns.push(findPattern(n));
    }

    // Calculate dynamic column widths
    const maxNWidth = Math.max(1, ...patterns.map(p => p.n.toString().length));
    const maxZWidth = Math.max(6, ...patterns.map(p => p.z.toString().length));
    const maxRWidth = Math.max(
        10,
        ...patterns.map(p => {
            const filtered = p.R.filter(r => r !== p.z);
            return JSON.stringify(filtered).replace(/,/g, ', ').length;
        })
    );

    // Print table header
    const nHeader = 'n'.padStart(maxNWidth);
    const zHeader = 'Period'.padStart(maxZWidth);
    const rHeader = 'Remainders'.padEnd(maxRWidth);
    console.log(` ${nHeader} | ${zHeader} | ${rHeader}`);
    console.log(
        '-'.repeat(maxNWidth + 2) +
            '|' +
            '-'.repeat(maxZWidth + 2) +
            '|' +
            '-'.repeat(maxRWidth + 2)
    );

    // Print table rows
    for (const pattern of patterns) {
        const nStr = pattern.n.toString().padStart(maxNWidth);
        const zStr = pattern.z.toString().padStart(maxZWidth);
        const filtered = pattern.R.filter(r => r !== pattern.z);
        const rStr = JSON.stringify(filtered).replace(/,/g, ', ');
        console.log(` ${nStr} | ${zStr} | ${rStr}`);
    }

    // Optional verification against checkIdentity
    if (limitArg) {
        const limit = parseInt(limitArg, 10);
        console.log(`\nVerifying patterns up to m=${limit}...\n`);

        // Calculate max n width for alignment
        const maxN = Math.max(...nRange.filter(n => !isNaN(n)));
        const nWidth = maxN.toString().length;

        for (const n of nRange) {
            if (isNaN(n)) continue;
            const pattern = findPattern(n);

            const nStr = n.toString().padStart(nWidth);
            process.stdout.write(`n=${nStr}: `);
            let allPass = true;
            for (let m = 1; m <= limit; m++) {
                const expectPass = pattern.R.includes(m % pattern.z);
                const actualPass = checkIdentity(m, n);

                if (expectPass !== actualPass) {
                    console.log(
                        `FAIL at m=${m}. Expected ${expectPass}, Got ${actualPass}`
                    );
                    allPass = false;
                    break;
                }
            }
            if (allPass) {
                console.log('OK ✅');
            }
        }
    }
}

main();
