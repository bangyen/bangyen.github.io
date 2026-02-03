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
} from '../matrices';

function checkIdentity(m: number, n: number): boolean {
    const matrix = getMatrix(n);
    const poly = getPolynomial(m + 1);
    const powCache = new Map<number, number[]>();
    const product = evalPolynomial(matrix, poly, powCache);
    const identity = getIdentity(n);
    return product.every((val, i) => val === identity[i]);
}

const PATTERNS: Record<number, { z: number; R: number[] }> = {
    1: { z: 3, R: [0, 1] },
    2: { z: 2, R: [0] },
    3: { z: 12, R: [0, 10] },
    4: { z: 10, R: [0, 8] },
    5: { z: 24, R: [0, 6, 16, 22] },
    6: { z: 18, R: [0, 16] },
    7: { z: 24, R: [0, 22] },
    8: { z: 14, R: [0, 12] },
    9: { z: 60, R: [0, 18, 40, 58] },
    10: { z: 62, R: [0, 60] },
};

function main() {
    const limitArg = process.argv[2] ?? '1000';
    const limit = parseInt(limitArg, 10);
    console.log(`Verifying periodicity patterns up to m = ${limit}...\n`);

    for (let n = 1; n <= 10; n++) {
        const pattern = PATTERNS[n];
        if (!pattern) continue;

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
