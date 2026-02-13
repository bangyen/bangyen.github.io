import {
    getMatrix,
    getPolynomial,
    evalPolynomial,
    getKernelBasis,
    getImageBasis,
    getMinWeightSolution,
    countBits,
} from '../utils';

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
    reset: '\u001B[0m',
    bold: '\u001B[1m',
    dim: '\u001B[2m',
    green: '\u001B[32m',
    yellow: '\u001B[33m',
    blue: '\u001B[34m',
    magenta: '\u001B[35m',
    cyan: '\u001B[36m',
    red: '\u001B[31m',
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
        `\n${COLORS.bold}${COLORS.cyan}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`,
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}║             MATHEMATICAL ANALYSIS OF SOLVABILITY           ║${COLORS.reset}`,
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}╚════════════════════════════════════════════════════════════╝${COLORS.reset}`,
    );

    const labelWidth = 24;
    const formatRow = (label: string, value: string) =>
        `  ${COLORS.dim}${label.padEnd(labelWidth)}${COLORS.reset} ${value}`;

    console.log(
        formatRow('Grid Size', `${COLORS.bold}${n}x${n}${COLORS.reset}`),
    );
    console.log(formatRow('Characteristic Matrix', `P${n + 1}(A)`));
    console.log(
        formatRow('Rank (GF2)', `${COLORS.green}${rank}${COLORS.reset}`),
    );
    console.log(
        formatRow('Nullity (GF2)', `${COLORS.yellow}${nullity}${COLORS.reset}`),
    );
    console.log(
        formatRow(
            'Solvable Configurations',
            `2${n === rank ? `^${n}` : `^${rank}`} / 2^${n}`,
        ),
    );

    const imageBasis = getImageBasis(matrix, n);
    const reachableCount = 1n << BigInt(imageBasis.length);

    if (nullity > 0) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.blue}● QUIET PATTERNS (KERNEL BASIS)${COLORS.reset}`,
        );
        console.log(
            `    ${COLORS.dim}Top row configurations that leave the board unchanged if played twice,${COLORS.reset}`,
        );
        console.log(
            `    ${COLORS.dim}or equivalently, that solve an empty bottom row.${COLORS.reset}\n`,
        );

        for (const [i, k] of kernel.entries()) {
            console.log(
                `    Basis Vector ${i + 1}: ${COLORS.magenta}${toBinaryString(k, n)}${COLORS.reset} (Weight: ${countBits(k)})`,
            );
        }
    } else {
        console.log(
            `\n  ${COLORS.bold}${COLORS.green}● UNIQUE SOLVABILITY${COLORS.reset}`,
        );
        console.log(
            `    Every possible bottom row configuration has exactly one unique solution.`,
        );
    }

    const displayLimit = 256;
    const toDisplay =
        reachableCount < BigInt(displayLimit)
            ? Number(reachableCount)
            : displayLimit;

    console.log(
        `\n  ${COLORS.bold}${COLORS.blue}● REACHABLE STATES${COLORS.reset}`,
    );
    console.log(
        `    ${COLORS.dim}Listing ${toDisplay < Number(reachableCount) ? `first ${toDisplay}` : 'all'} reachable combinations of the image basis...${COLORS.reset}\n`,
    );

    for (let i = 0; i < toDisplay; i++) {
        let target = 0n;
        for (const [j, basisVector] of imageBasis.entries()) {
            if ((i >> j) & 1 && basisVector !== undefined) {
                target ^= basisVector;
            }
        }
        const sol = getMinWeightSolution(matrix, target, n);
        console.log(
            `    ${toBinaryString(target, n)} : ${COLORS.green}${toBinaryString(sol, n)}${COLORS.reset} (${COLORS.bold}${countBits(sol)}${COLORS.reset})`,
        );
    }

    if (reachableCount > BigInt(displayLimit)) {
        console.log(
            `    ${COLORS.dim}... and ${reachableCount - BigInt(displayLimit)} more reachable states.${COLORS.reset}`,
        );
    }

    // Exhaustive analysis for "reasonable" state spaces (up to 2^18)
    const analysisThreshold = 262_144n; // 2^18
    if (reachableCount > 1n /* && reachableCount <= analysisThreshold */) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.blue}● EXHAUSTIVE STATE SPACE ANALYSIS${COLORS.reset}`,
        );
        console.log(
            `    ${COLORS.dim}Scanning all 2^${imageBasis.length} states to find difficulty distribution...${COLORS.reset}\n`,
        );

        const total = Number(reachableCount);
        let maxWeight = 0;
        let maxWeightTarget = 0n;
        const weights: Record<number, number> = {};

        for (let i = 0; i < total; i++) {
            let target = 0n;
            for (const [j, basisVector] of imageBasis.entries()) {
                if ((i >> j) & 1 && basisVector !== undefined) {
                    target ^= basisVector;
                }
            }
            const sol = getMinWeightSolution(matrix, target, n);
            const w = countBits(sol);
            weights[w] = (weights[w] ?? 0) + 1;
            if (w > maxWeight) {
                maxWeight = w;
                maxWeightTarget = target;
            }

            if (total > 1000 && i % 100 === 0) {
                drawProgressBar(i + 1, total);
            }
        }
        if (total > 1000) drawProgressBar(total, total);

        console.log(
            `\n    Maximum Toggles Required: ${COLORS.bold}${maxWeight}${COLORS.reset}`,
        );
        console.log(
            `    "Hardest" Configuration: ${toBinaryString(maxWeightTarget, n)}`,
        );
    } else if (reachableCount > analysisThreshold) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.yellow}● STATE SPACE OVERVIEW${COLORS.reset}`,
        );
        console.log(
            `    Total Reachable: 2^${imageBasis.length} (${reachableCount})`,
        );
        console.log(
            `    ${COLORS.dim}Exhaustive analysis skipped to avoid excessive computation.${COLORS.reset}`,
        );
    }

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}══════════════════════════════════════════════════════════════${COLORS.reset}\n`,
    );
}

function main() {
    const nArg = process.argv[2] ?? '5';
    let nRange: number[] = [];
    if (nArg.includes('-')) {
        const [start, end] = nArg.split('-').map(v => Number.parseInt(v, 10));
        if (start !== undefined && end !== undefined) {
            for (let i = start; i <= end; i++) nRange.push(i);
        }
    } else {
        nRange = [Number.parseInt(nArg, 10)];
    }

    for (const n of nRange) {
        if (isNaN(n)) continue;
        analyzeSolvability(n);
    }
}

main();
