/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import {
    getMatrix,
    getPolynomial,
    findPattern,
    polyMod,
    polyDiv,
    getMinimalPolynomial,
    factorPoly,
} from '../matrices';

function polyToString(p: bigint): string {
    if (p === 0n) return '0';
    const terms: string[] = [];
    const bits = p.toString(2);
    for (let i = 0; i < bits.length; i++) {
        if (bits[bits.length - 1 - i] === '1') {
            if (i === 0) terms.push('1');
            else if (i === 1) terms.push('x');
            else terms.push(`x^${i}`);
        }
    }
    return terms.reverse().join(' + ');
}

interface Pattern {
    n: number;
    z: number;
    z_seq: number;
    R: number[];
}

function verifyPattern(n: number, pattern: Pattern) {
    const { z, R, z_seq } = pattern;
    const A = getMatrix(n);
    const M = getMinimalPolynomial(A);
    const factors = factorPoly(M);

    console.log(`\n--- Mathematical Proof for n=${n} ---`);
    console.log(`Minimal Polynomial M(x) = ${polyToString(M)}`);
    console.log(
        `Factorization: ${factors
            .map(
                f =>
                    `(${polyToString(f.factor)})${
                        f.exponent > 1 ? `^${f.exponent}` : ''
                    }`
            )
            .join(' * ')}`
    );
    console.log(`Discovered Period z = ${z}`);
    console.log(`Sequence Period z_seq = ${z_seq}`);
    console.log(`Remainder Set R = {${R.filter(r => r !== z).join(', ')}}\n`);

    console.log(`Step 1: Prove z-periodicity`);
    console.log(
        `  We must show M(x) | f_{z_seq}(x) and M(x) | (f_{z_seq+1}(x) + 1)`
    );
    const fz = getPolynomial(z_seq);
    const fz1 = getPolynomial(z_seq + 1);

    const modZ = polyMod(fz, M);
    const modZ1 = polyMod(fz1 ^ 1n, M);

    console.log(`  f_{${z_seq}}(x) mod M(x) = ${polyToString(modZ)}`);
    console.log(
        `  (f_{${z_seq + 1}}(x) + 1) mod M(x) = ${polyToString(modZ1)}`
    );

    if (modZ === 0n && modZ1 === 0n) {
        console.log(
            `  OK: M(A) = 0 implies f_{z_seq}(A) = 0 and f_{z_seq+1}(A) = I. The sequence is ${z_seq}-periodic.`
        );
    } else {
        console.log(
            `  FAIL: Period z_seq=${z_seq} is invalid for the minimal polynomial.`
        );
        return;
    }

    console.log(`\nStep 2: Illustrate divisibility for R`);
    console.log(
        `  A grid height m satisfies the property iff M(x) | (f_{m+1}(x) + 1).`
    );
    let allRCorrect = true;
    for (let m = 0; m < z; m++) {
        const fm1 = getPolynomial(m + 1);
        const { quotient, remainder } = polyDiv(fm1 ^ 1n, M);
        const isSolution = remainder === 0n;
        const inR = R.includes(m);

        if (isSolution !== inR) {
            console.log(
                `  FAIL at m=${m}: Inconsistent! Divisibility=${isSolution}, R.includes=${inR}`
            );
            allRCorrect = false;
        }

        if (isSolution && m < 50) {
            // Show first few solutions with quotient
            console.log(
                `  m=${m.toString().padStart(3)}: (f_{${m + 1}}(x) + 1) = [${polyToString(quotient)}] * M(x) ✅`
            );
        }
    }

    if (allRCorrect) {
        console.log(
            `\nPROVEN: The pattern m mod ${z} in {${R.filter(r => r !== z).join(
                ', '
            )}} holds for all m.`
        );
    } else {
        console.log(
            `\nFAILED: The remainder set is inconsistent with the minimal polynomial.`
        );
    }
}

function main() {
    const nArg = process.argv[2] ?? '1-10';
    const proofFlag =
        process.argv.includes('--proof') || process.argv.length === 4;

    let nRange: number[] = [];
    if (nArg.includes('-')) {
        const [start, end] = nArg.split('-').map(v => parseInt(v, 10));
        if (start !== undefined && end !== undefined) {
            for (let i = start; i <= end; i++) nRange.push(i);
        }
    } else {
        nRange = [parseInt(nArg, 10)];
    }

    if (!proofFlag) {
        console.log(`Finding periodicity patterns for n=${nArg}...\n`);
    }

    const patterns: Pattern[] = [];
    for (const n of nRange) {
        if (isNaN(n)) continue;
        const pattern = findPattern(n);
        patterns.push(pattern);

        if (proofFlag) {
            verifyPattern(n, pattern);
        }
    }

    if (!proofFlag) {
        // Calculate dynamic column widths
        const maxNWidth = Math.max(
            1,
            ...patterns.map(p => p.n.toString().length)
        );
        const maxZWidth = Math.max(
            6,
            ...patterns.map(p => p.z.toString().length)
        );
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
    }
}

main();
