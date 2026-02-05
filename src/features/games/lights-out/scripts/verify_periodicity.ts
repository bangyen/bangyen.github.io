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

const COLORS = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
};

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

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}║             MATHEMATICAL CERTIFICATE OF PERIODICITY        ║${COLORS.reset}`
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}╚════════════════════════════════════════════════════════════╝${COLORS.reset}`
    );
    console.log(`${COLORS.bold}Target Configuration: n = ${n}${COLORS.reset}`);
    console.log(
        `${COLORS.bold}Minimal Polynomial M(x):${COLORS.reset} ${polyToString(M)}`
    );
    console.log(
        `${COLORS.bold}Factorization:${COLORS.reset} ${factors
            .map(
                f =>
                    `${COLORS.yellow}(${polyToString(f.factor)})${
                        f.exponent > 1 ? `^${f.exponent}` : ''
                    }${COLORS.reset}`
            )
            .join(' * ')}`
    );
    console.log(`${COLORS.bold}Property Period z:${COLORS.reset} ${z}`);
    console.log(`${COLORS.bold}Sequence Period z_seq:${COLORS.reset} ${z_seq}`);
    console.log(
        `${COLORS.bold}Remainder Set R:${COLORS.reset} {${R.filter(r => r !== z).join(', ')}}\n`
    );

    console.log(
        `${COLORS.bold}${COLORS.blue}[Step 1] Sequence Periodicity Proof${COLORS.reset}`
    );
    console.log(
        `  Theorem: The matrix sequence f_m(A) repeats exactly every ${z_seq} steps.`
    );
    console.log(
        `  Verification: M(x) must divide f_{z_seq}(x) and f_{z_seq+1}(x) + 1.`
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
            `  ${COLORS.green}${COLORS.bold}Result: VALID. The sequence is finite and periodic.${COLORS.reset}`
        );
    } else {
        console.log(
            `  ${COLORS.red}${COLORS.bold}Result: INVALID. Period z_seq=${z_seq} is incorrect.${COLORS.reset}`
        );
        return;
    }

    console.log(
        `\n${COLORS.bold}${COLORS.blue}[Step 2] Remainder Set Divisibility Proof${COLORS.reset}`
    );
    console.log(
        `  Theorem: Property holds if and only if M(x) divides f_{m+1}(x) + 1.`
    );

    let allRCorrect = true;
    for (let m = 0; m < z; m++) {
        const fm1 = getPolynomial(m + 1);
        const { quotient, remainder } = polyDiv(fm1 ^ 1n, M);
        const isSolution = remainder === 0n;
        const inR = R.includes(m);

        if (isSolution !== inR) {
            console.log(
                `  ${COLORS.red}ERROR at m=${m}: Inconsistent!${COLORS.reset}`
            );
            allRCorrect = false;
        }

        if (isSolution && m < 50) {
            console.log(
                `  m = ${m.toString().padStart(3)}: (f_{${m + 1}} + 1) = [${polyToString(quotient)}] * M(x) ${COLORS.green}✅${COLORS.reset}`
            );
        }
    }

    if (allRCorrect) {
        console.log(
            `\n${COLORS.bold}${COLORS.green}Conclusion: PROVEN${COLORS.reset}`
        );
        console.log(
            `The pattern m mod ${z} ∈ {${R.filter(r => r !== z).join(', ')}} holds for all m ∈ ℕ.`
        );
    } else {
        console.log(
            `\n${COLORS.bold}${COLORS.red}Conclusion: FAILED${COLORS.reset}`
        );
    }
    console.log(
        `${COLORS.bold}${COLORS.cyan}══════════════════════════════════════════════════════════════${COLORS.reset}\n`
    );
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
