import {
    getMatrix,
    getPolynomial,
    findPattern,
    polyMod,
    polyDiv,
    getMinimalPolynomial,
    factorPoly,
} from '../utils';

const COLORS = {
    reset: '\u001B[0m',
    bold: '\u001B[1m',
    dim: '\u001B[2m',
    italic: '\u001B[3m',
    green: '\u001B[32m',
    yellow: '\u001B[33m',
    blue: '\u001B[34m',
    magenta: '\u001B[35m',
    cyan: '\u001B[36m',
    red: '\u001B[31m',
};

function toSuperscript(num: number): string {
    const map: Record<string, string> = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
    };
    return num
        .toString()
        .split('')
        .map(c => map[c] ?? c)
        .join('');
}

function polyToString(p: bigint): string {
    if (p === 0n) return '0';
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

    const labelWidth = 24;
    const formatRow = (label: string, value: string) =>
        `  ${COLORS.dim}${label.padEnd(labelWidth)}${COLORS.reset} ${value}`;

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`,
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}║             MATHEMATICAL CERTIFICATE OF PERIODICITY        ║${COLORS.reset}`,
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}╚════════════════════════════════════════════════════════════╝${COLORS.reset}`,
    );

    console.log(
        formatRow(
            'Target Configuration',
            `${COLORS.bold}n = ${n}${COLORS.reset}`,
        ),
    );
    console.log(
        formatRow(
            'Minimal Polynomial M(x)',
            `${COLORS.magenta}${polyToString(M)}${COLORS.reset}`,
        ),
    );
    console.log(
        formatRow(
            'Factorization',
            factors
                .map(
                    f =>
                        `${COLORS.yellow}(${polyToString(f.factor)})${f.exponent > 1 ? toSuperscript(f.exponent) : ''}${COLORS.reset}`,
                )
                .join(' * '),
        ),
    );
    console.log(
        formatRow('Property Period (z)', `${COLORS.bold}${z}${COLORS.reset}`),
    );
    console.log(
        formatRow(
            'Sequence Period (z_seq)',
            `${COLORS.bold}${z_seq}${COLORS.reset}`,
        ),
    );
    console.log(
        formatRow(
            'Remainder Set (R)',
            `{${R.filter(r => r !== z).join(', ')}}\n`,
        ),
    );

    const fz = getPolynomial(z_seq);
    const fz1 = getPolynomial(z_seq + 1);

    const modZ = polyMod(fz, M);
    const modZ1 = polyMod(fz1 ^ 1n, M);

    const eq1 = `f${toSuperscript(z_seq)}(x)`;
    const eq2 = `(f${toSuperscript(z_seq + 1)}(x) + 1)`;

    const proofEq1 = `${eq1} mod M(x)`;
    const proofEq2 = `${eq2} mod M(x)`;

    const defWidth = Math.max(eq1.length, eq2.length);
    const proofWidth = Math.max(proofEq1.length, proofEq2.length);

    console.log(
        `\n  ${COLORS.bold}${COLORS.blue}● STEP 1: CONVERGENCE PROOF${COLORS.reset}`,
    );
    console.log(
        `    ${COLORS.italic}Verify that sequence returns to (0, I) periodically.${COLORS.reset}`,
    );

    console.log(`    ${COLORS.dim}Base Polynomials:${COLORS.reset}`);
    console.log(
        `    ${eq1.padEnd(defWidth)} = ${COLORS.dim}${polyToString(fz)}${COLORS.reset}`,
    );
    console.log(
        `    ${eq2.padEnd(defWidth)} = ${COLORS.dim}${polyToString(fz1 ^ 1n)}${COLORS.reset}`,
    );
    console.log('');

    console.log(
        `    ${proofEq1.padEnd(proofWidth)} = ${COLORS.cyan}${polyToString(modZ)}${COLORS.reset}`,
    );
    console.log(
        `    ${proofEq2.padEnd(proofWidth)} = ${COLORS.cyan}${polyToString(modZ1)}${COLORS.reset}`,
    );

    if (modZ === 0n && modZ1 === 0n) {
        console.log(
            `    ${COLORS.green}Verification successful. Periodicity is established.${COLORS.reset}`,
        );
    } else {
        console.log(
            `    ${COLORS.red}Verification failed. Pattern is mathematically invalid.${COLORS.reset}`,
        );
        return;
    }

    console.log(
        `\n  ${COLORS.bold}${COLORS.blue}● STEP 2: FINITE ENUMERATION${COLORS.reset}`,
    );
    console.log(
        `    ${COLORS.italic}Exhaustive check of the remainder set over one period.${COLORS.reset}`,
    );

    const glossaryItems = R.filter(r => r < z).map(r => ({
        label: `f${toSuperscript(r + 1)}(x) + 1`,
        poly: getPolynomial(r + 1) ^ 1n,
    }));
    const glossaryWidth = Math.max(
        ...glossaryItems.map(i => i.label.length),
        0,
    );

    console.log(`    ${COLORS.dim}Polynomial Glossary:${COLORS.reset}`);
    for (const item of glossaryItems) {
        console.log(
            `    ${item.label.padEnd(glossaryWidth)} = ${COLORS.dim}${polyToString(item.poly)}${COLORS.reset}`,
        );
    }
    console.log('');

    const maxMWidth = Math.max(3, z.toString().length);
    const enumItems: { label: string; quotient: bigint }[] = [];
    let allRCorrect = true;

    for (let m = 0; m < z; m++) {
        const fm1 = getPolynomial(m + 1);
        const { quotient, remainder } = polyDiv(fm1 ^ 1n, M);
        const isSolution = remainder === 0n;
        const inR = R.includes(m);

        if (isSolution !== inR) {
            console.log(
                `    ${COLORS.red}✖ DISCREPANCY at m = ${m}${COLORS.reset}`,
            );
            allRCorrect = false;
        }

        if (isSolution) {
            enumItems.push({
                label: `m = ${m.toString().padStart(maxMWidth)} : f${toSuperscript(m + 1)} + 1`,
                quotient,
            });
        }
    }

    const enumWidth = Math.max(...enumItems.map(i => i.label.length), 0);
    for (const item of enumItems) {
        console.log(
            `    ${item.label.padEnd(enumWidth)} = [${COLORS.dim}${polyToString(item.quotient).padEnd(20)}${COLORS.reset}] * M(x) ${COLORS.green}✔${COLORS.reset}`,
        );
    }

    if (allRCorrect) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.green}STATUS: MATHEMATICALLY PROVEN${COLORS.reset}`,
        );
        console.log(
            `  ${COLORS.dim}The pattern m mod ${z} ∈ {${R.filter(r => r !== z).join(', ')}} is valid ∀ m ∈ ℕ.${COLORS.reset}`,
        );
    } else {
        console.log(
            `\n  ${COLORS.bold}${COLORS.red}STATUS: DISPROVEN${COLORS.reset}`,
        );
    }
    console.log(
        `${COLORS.bold}${COLORS.cyan}══════════════════════════════════════════════════════════════${COLORS.reset}\n`,
    );
}

function main() {
    const nArg = process.argv[2] ?? '1-10';
    const proofFlag =
        process.argv.includes('--proof') || process.argv.length === 4;

    let nRange: number[] = [];
    if (nArg.includes('-')) {
        const [start, end] = nArg.split('-').map(v => Number.parseInt(v, 10));
        if (start !== undefined && end !== undefined) {
            for (let i = start; i <= end; i++) nRange.push(i);
        }
    } else {
        nRange = [Number.parseInt(nArg, 10)];
    }

    if (!proofFlag) {
        console.log(`Finding periodicity patterns for n = ${nArg}...\n`);
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
            ...patterns.map(p => p.n.toString().length),
        );
        const maxZWidth = Math.max(
            6,
            ...patterns.map(p => p.z.toString().length),
        );
        const maxRWidth = Math.max(
            10,
            ...patterns.map(p => {
                const filtered = p.R.filter(r => r !== p.z);
                return JSON.stringify(filtered).replaceAll(',', ', ').length;
            }),
        );

        // Print table header
        const nHeader = 'n'.padStart(maxNWidth);
        const zHeader = 'Period'.padStart(maxZWidth);
        const rHeader = 'Remainders'.padEnd(maxRWidth);
        console.log(` ${nHeader} | ${zHeader} | ${rHeader} `);
        console.log(
            '-'.repeat(maxNWidth + 2) +
                '|' +
                '-'.repeat(maxZWidth + 2) +
                '|' +
                '-'.repeat(maxRWidth + 2),
        );

        // Print table rows
        for (const pattern of patterns) {
            const nStr = pattern.n.toString().padStart(maxNWidth);
            const zStr = pattern.z.toString().padStart(maxZWidth);
            const filtered = pattern.R.filter(r => r !== pattern.z);
            const rStr = JSON.stringify(filtered).replaceAll(',', ', ');
            console.log(` ${nStr} | ${zStr} | ${rStr} `);
        }
    }
}

main();
