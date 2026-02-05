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
    findPattern,
} from '../matrices';

function checkIdentity(m: number, n: number): boolean {
    const matrix = getMatrix(n);
    const poly = getPolynomial(m + 1);
    const powCache = new Map<number, bigint[]>();
    const product = evalPolynomial(matrix, poly, powCache);
    const identity = getIdentity(n);
    return product.every((val, i) => val === identity[i]);
}

interface Pattern {
    n: number;
    z: number;
    R: number[];
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
