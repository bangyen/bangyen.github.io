/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
    Verification Script for Lights Out Identity Matrix Property
    
    This script empirically checks which grid sizes (rows x cols) result in the 
    calculator acting as an Identity Matrix (output == input).
    
    It re-implements the core matrix logic from the game to run in a standalone node environment.
    
    Usage:
    npx tsx src/features/games/lights-out/verify_identity.ts
*/

import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    getIdentity,
} from '../matrices';

function check(rows: number, cols: number): boolean {
    // 1. Construct the Adjacency Matrix + Identity for the path graph of size 'cols'
    const matrix = getMatrix(cols);

    // 2. Compute the polynomial F_{rows+1}(x+1) + 1  (The code implicitly handles the basis change)
    // Actually, 'getPolynomial' computes coefficients for F_{rows+1}
    const weights = getPolynomial(rows + 1);

    // 3. Evaluate the polynomial on the matrix
    const product = evalPolynomial(matrix, weights);

    // 4. Check if the result is the Identity Matrix
    const identity = getIdentity(cols);

    for (let i = 0; i < cols; i++) {
        if (product[i] !== identity[i]) return false;
    }
    return true;
}

const args = process.argv.slice(2);
const MAX_SEARCH = parseInt(args[0] ?? '30', 10);

if (isNaN(MAX_SEARCH) || MAX_SEARCH <= 0) {
    console.error(
        'Invalid argument. Please provide a positive integer for the max grid size.'
    );
    process.exit(1);
}

console.log(
    `Searching for Identity Matrix cases (Rows x Cols) up to ${MAX_SEARCH}x${MAX_SEARCH}...`
);
console.log('----------------------------------------------------------------');

for (let r = 1; r <= MAX_SEARCH; r++) {
    for (let c = 1; c <= MAX_SEARCH; c++) {
        if (check(r, c)) {
            console.log(`[PASS] ${r} rows x ${c} cols`);
        }
    }
}
console.log('----------------------------------------------------------------');
console.log('Done.');
