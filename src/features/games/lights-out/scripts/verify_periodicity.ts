/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
    Lights Out Periodicity Verifier
    
    This script verifies the modular periodicity patterns (m mod z in {R}) 
    for the Identity Matrix property.
    
    It uses Matrix Binary Exponentiation to verify grid heights in O(log m)
    time, making it possible to check thousands of rows in seconds.
    
    Usage:
    npx tsx src/features/games/lights-out/scripts/verify_periodicity.ts [limit]
*/

import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    getIdentity,
    multiplySym,
    addSym,
} from '../matrices';

function checkIdentity(m: number, n: number): boolean {
    const matrix = getMatrix(n);
    const poly = getPolynomial(m + 1);
    const powCache = new Map<number, number[]>();
    const product = evalPolynomial(matrix, poly, powCache);
    const identity = getIdentity(n);
    return product.every((val, i) => val === identity[i]);
}

function isIdentity(matrix: number[]): boolean {
    const size = matrix.length;
    const identity = getIdentity(size);
    return matrix.every((val, i) => val === identity[i]);
}

function isZero(matrix: number[]): boolean {
    return matrix.every(val => val === 0);
}

interface Pattern {
    n: number;
    z: number;
    R: number[];
}

function findPattern(n: number): Pattern {
    const A = getMatrix(n);
    const I = getIdentity(n);
    const Zero: number[] = Array(n).fill(0) as number[];

    let prev = [...Zero];
    let curr = [...I];
    const R: number[] = [0];

    // Iteratively compute Fibonacci polynomials until we find the period
    // f_{k+1}(A) = A * f_k(A) + f_{k-1}(A)
    // The period z is when f_{z+1}(A) = I
    // We also need f_z(A) = 0 for the "full" period where it repeats from I, 0
    for (let k = 2; k <= 100000; k++) {
        const next = addSym(multiplySym(A, curr), prev);

        if (isIdentity(next)) {
            R.push(k - 1);
        }

        if (isIdentity(next) && isZero(curr)) {
            return { n, z: k - 1, R };
        }

        prev = curr;
        curr = next;
    }

    throw new Error(`Period not found for n=${n}`);
}

function main() {
    const limitArg = process.argv[2] ?? '1000';
    const limit = parseInt(limitArg, 10);
    console.log(`Verifying periodicity patterns up to m = ${limit}...\n`);

    for (let n = 1; n <= 10; n++) {
        const pattern = findPattern(n);

        process.stdout.write(`n=${n} (Period ${pattern.z}): `);
        let allPass = true;
        for (let m = 1; m <= limit; m++) {
            const expectPass = pattern.R.includes(m % pattern.z);
            const actualPass = checkIdentity(m, n);

            if (expectPass !== actualPass) {
                console.log(
                    `\n  [FAIL] Discrepancy at m=${m}. Expected ${expectPass}, Got ${actualPass}`
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

main();
