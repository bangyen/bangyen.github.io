/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    getKernelBasis,
    getImageBasis,
    getMinWeightSolution,
    countBits,
} from '../matrices';

function drawProgressBar(current: number, total: number, width = 30) {
    const progress = Math.min(1, current / total);
    const filled = Math.round(width * progress);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percent = Math.round(progress * 100);
    process.stdout.write(`\r    [${bar}] ${percent}% (${current}/${total})`);
    if (current === total) process.stdout.write('\n');
}

const COLORS = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
};

function toBinaryString(val: bigint, size: number): string {
    return val.toString(2).padStart(size, '0');
}

function analyzeSolvability(n: number) {
    const A = getMatrix(n);
    const Pn = getPolynomial(n + 1);
    const matrix = evalPolynomial(A, Pn);
    const kernel = getKernelBasis(matrix, n);
    const nullity = kernel.length;
    const rank = n - nullity;

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}║             MATHEMATICAL ANALYSIS OF SOLVABILITY           ║${COLORS.reset}`
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}╚════════════════════════════════════════════════════════════╝${COLORS.reset}`
    );

    const labelWidth = 24;
    const formatRow = (label: string, value: string) =>
        `  ${COLORS.dim}${label.padEnd(labelWidth)}${COLORS.reset} ${value}`;

    console.log(
        formatRow('Grid Size', `${COLORS.bold}${n}x${n}${COLORS.reset}`)
    );
    console.log(formatRow('Characteristic Matrix', `P${n + 1}(A)`));
    console.log(
        formatRow('Rank (GF2)', `${COLORS.green}${rank}${COLORS.reset}`)
    );
    console.log(
        formatRow('Nullity (GF2)', `${COLORS.yellow}${nullity}${COLORS.reset}`)
    );
    console.log(
        formatRow(
            'Solvable Configurations',
            `2${n === rank ? `^${n}` : `^${rank}`} / 2^${n}`
        )
    );

    const imageBasis = getImageBasis(matrix, n);
    const reachableCount = 1n << BigInt(imageBasis.length);

    if (nullity > 0) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.blue}● QUIET PATTERNS (KERNEL BASIS)${COLORS.reset}`
        );
        console.log(
            `    ${COLORS.dim}Top row configurations that leave the board unchanged if played twice,${COLORS.reset}`
        );
        console.log(
            `    ${COLORS.dim}or equivalently, that solve an empty bottom row.${COLORS.reset}\n`
        );

        kernel.forEach((k, i) => {
            console.log(
                `    Basis Vector ${i + 1}: ${COLORS.magenta}${toBinaryString(k, n)}${COLORS.reset} (Weight: ${countBits(k)})`
            );
        });
    } else {
        console.log(
            `\n  ${COLORS.bold}${COLORS.green}● UNIQUE SOLVABILITY${COLORS.reset}`
        );
        console.log(
            `    Every possible bottom row configuration has exactly one unique solution.`
        );
    }

    if (reachableCount <= 65536n) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.blue}● REACHABLE STATES${COLORS.reset}`
        );
        console.log(
            `    ${COLORS.dim}Generating all linear combinations of the image basis...${COLORS.reset}\n`
        );

        const totalToGenerate = Number(reachableCount);
        const reachableStates: { target: bigint; sol: bigint }[] = [];

        for (let i = 0; i < totalToGenerate; i++) {
            let target = 0n;
            for (let j = 0; j < imageBasis.length; j++) {
                const basisVector = imageBasis[j];
                if ((i >> j) & 1 && basisVector !== undefined) {
                    target ^= basisVector;
                }
            }
            const sol = getMinWeightSolution(matrix, target, n);
            reachableStates.push({ target, sol });

            if (totalToGenerate > 100 && i % 10 === 0) {
                drawProgressBar(i + 1, totalToGenerate);
            }
        }
        if (totalToGenerate > 100)
            drawProgressBar(totalToGenerate, totalToGenerate);

        const displayLimit = 256;
        console.log(
            `\n    ${COLORS.dim}Listing up to ${displayLimit} reachable states:${COLORS.reset}\n`
        );

        reachableStates.slice(0, displayLimit).forEach(({ target, sol }) => {
            console.log(
                `    ${toBinaryString(target, n)} : ${COLORS.green}${toBinaryString(sol, n)}${COLORS.reset} (${COLORS.bold}${countBits(sol)}${COLORS.reset})`
            );
        });

        if (totalToGenerate > displayLimit) {
            console.log(`    ... and ${totalToGenerate - displayLimit} more.`);
        }

        console.log(
            `\n    ${COLORS.dim}Total Reachable: ${totalToGenerate}${COLORS.reset}`
        );
    } else {
        console.log(
            `\n  ${COLORS.bold}${COLORS.blue}● SAMPLE REACHABLE STATES${COLORS.reset}`
        );
        console.log(
            `    (Large state space: 2^${imageBasis.length} reachable states. Showing only samples)\n`
        );

        const samples = [1n, (1n << BigInt(n)) - 1n];
        samples.forEach(target => {
            const sol = getMinWeightSolution(matrix, target, n);
            if (sol === -1n) {
                console.log(
                    `    ${toBinaryString(target, n)} : ${COLORS.red}UNREACHABLE${COLORS.reset}`
                );
            } else {
                console.log(
                    `    ${toBinaryString(target, n)} : ${COLORS.green}${toBinaryString(sol, n)}${COLORS.reset} (${COLORS.bold}${countBits(sol)}${COLORS.reset})`
                );
            }
        });
    }

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}══════════════════════════════════════════════════════════════${COLORS.reset}\n`
    );
}

function main() {
    const nArg = process.argv[2] ?? '5';
    let nRange: number[] = [];
    if (nArg.includes('-')) {
        const [start, end] = nArg.split('-').map(v => parseInt(v, 10));
        if (start !== undefined && end !== undefined) {
            for (let i = start; i <= end; i++) nRange.push(i);
        }
    } else {
        nRange = [parseInt(nArg, 10)];
    }

    for (const n of nRange) {
        if (isNaN(n)) continue;
        analyzeSolvability(n);
    }
}

main();
