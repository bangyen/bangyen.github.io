/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { getImageBasis } from '../matrices';

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

function getToggleVector(r: number, c: number, n: number): bigint {
    let vector = 0n;
    const cells = [
        [r, c],
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
    ];
    for (const cell of cells) {
        const [vR, vC] = cell;
        if (
            vR !== undefined &&
            vC !== undefined &&
            vR >= 0 &&
            vR < n &&
            vC >= 0 &&
            vC < n
        ) {
            vector |= 1n << BigInt(vR * n + vC);
        }
    }
    return vector;
}

function getToggleVectors(n: number): bigint[] {
    const vectors: bigint[] = [];
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            vectors.push(getToggleVector(r, c, n));
        }
    }
    return vectors;
}

function getPivots(basis: bigint[], size: number): number[] {
    const pivots: number[] = [];
    for (const row of basis) {
        for (let bit = size - 1; bit >= 0; bit--) {
            if ((row >> BigInt(bit)) & 1n) {
                pivots.push(bit);
                break;
            }
        }
    }
    return pivots;
}

function toIndex(state: bigint, pivots: number[]): number {
    let index = 0;
    for (let i = 0; i < pivots.length; i++) {
        const p = pivots[i];
        if (p !== undefined && (state >> BigInt(p)) & 1n) {
            index |= 1 << i;
        }
    }
    return index;
}

function drawProgressBar(current: number, total: number, width = 30) {
    const progress = Math.min(1, current / total);
    const filled = Math.round(width * progress);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percent = Math.round(progress * 100);
    process.stdout.write(`\r    [${bar}] ${percent}% (${current}/${total})`);
    if (current === total) process.stdout.write('\n');
}

function analyzeGodsNumber(n: number) {
    const title = `GOD'S NUMBER ANALYSIS: ${n}x${n} GRID`;
    const boxWidth = 60;
    const padding = Math.max(0, (boxWidth - title.length) / 2);
    const leftPadDirection = Math.floor(padding);
    const rightPadDirection = Math.ceil(padding);

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}╔${'═'.repeat(boxWidth)}╗${COLORS.reset}`
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}║${' '.repeat(leftPadDirection)}${title}${' '.repeat(rightPadDirection)}║${COLORS.reset}`
    );
    console.log(
        `${COLORS.bold}${COLORS.cyan}╚${'═'.repeat(boxWidth)}╝${COLORS.reset}`
    );

    const toggleVectors = getToggleVectors(n);
    const basis = getImageBasis(toggleVectors, n * n);
    const r = basis.length;
    const nullity = n * n - r;

    console.log(`  ${COLORS.dim}Total States:${COLORS.reset} 2^${n * n}`);
    console.log(
        `  ${COLORS.dim}Reachable States (Image):${COLORS.reset} 2^${r}`
    );
    console.log(
        `  ${COLORS.dim}Kernel Dimension (Nullity):${COLORS.reset} ${nullity}`
    );

    if (r === n * n) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.green}● FULLY INVERTIBLE GRID${COLORS.reset}`
        );
        console.log(
            `    The toggle matrix is surjective. Every state is solvable.`
        );
        console.log(
            `    God's Number is exactly the maximum moves: ${COLORS.bold}${n * n}${COLORS.reset}`
        );
        console.log(
            `    (Achieved by the state require all cells to be toggled)`
        );
    } else if (r <= 24) {
        console.log(
            `\n  ${COLORS.bold}${COLORS.blue}● EXHAUSTIVE BFS SEARCH${COLORS.reset}`
        );
        console.log(`    Exploring ${1 << r} states layer by layer...`);

        const pivots = getPivots(basis, n * n);
        const numStates = 1 << r;

        console.log(`    Pre-calculating toggle transitions...`);
        const toggleIndices = new Uint32Array(toggleVectors.length);
        for (let i = 0; i < toggleVectors.length; i++) {
            const v = toggleVectors[i];
            if (v !== undefined) {
                toggleIndices[i] = toIndex(v, pivots);
            }
        }

        const visited = new Uint8Array(numStates >> 3);

        const getVisited = (idx: number) => {
            const byte = visited[idx >> 3];
            return byte !== undefined ? (byte >> (idx & 7)) & 1 : 0;
        };
        const setVisited = (idx: number) => {
            const current = visited[idx >> 3];
            if (current !== undefined) {
                visited[idx >> 3] = current | (1 << (idx & 7));
            }
        };

        let currentLayer = new Uint32Array(numStates);
        let nextLayer = new Uint32Array(numStates);

        currentLayer[0] = 0;
        let currentSize = 1;
        setVisited(0);

        let distance = 0;
        let totalVisited = 1;

        while (currentSize > 0) {
            let nextSize = 0;
            process.stdout.write(
                `    Layer ${distance.toString().padStart(2)}: `
            );

            for (let i = 0; i < currentSize; i++) {
                const stateIdx = currentLayer[i];
                if (stateIdx === undefined) continue;

                for (const toggleIdx of toggleIndices) {
                    const nextIdx = stateIdx ^ toggleIdx;
                    if (!getVisited(nextIdx)) {
                        setVisited(nextIdx);
                        if (nextSize < numStates) {
                            nextLayer[nextSize++] = nextIdx;
                        }
                        totalVisited++;
                    }
                }

                if (currentSize > 10000 && i % 1000 === 0) {
                    drawProgressBar(i + 1, currentSize);
                }
            }

            if (currentSize > 10000) drawProgressBar(currentSize, currentSize);
            else process.stdout.write(`${nextSize} states\n`);

            if (nextSize === 0) break;

            distance++;
            if (currentSize > 10000) {
                console.log(
                    `    Layer ${distance.toString().padStart(2)} confirmed: ${nextSize.toString().padStart(8)} states`
                );
            }

            // Swap buffers properly
            const temp = currentLayer;
            currentLayer = nextLayer;
            nextLayer = temp;
            currentSize = nextSize;
        }

        console.log(`\n  ${COLORS.bold}${COLORS.green}● RESULT${COLORS.reset}`);
        console.log(
            `    God's Number for ${n}x${n}: ${COLORS.bold}${distance}${COLORS.reset}`
        );
        console.log(`    Total reachable states verified: ${totalVisited}`);
    } else {
        console.log(
            `\n  ${COLORS.bold}${COLORS.yellow}● STATE SPACE TOO LARGE${COLORS.reset}`
        );
        console.log(
            `    State space 2^${r} exceeds reasonable computation limits for this script.`
        );
        console.log(
            `    However, we know God's Number is bounded by ${n * n}.`
        );
    }

    console.log(
        `\n${COLORS.bold}${COLORS.cyan}══════════════════════════════════════════════════════════════${COLORS.reset}\n`
    );
}

function main() {
    const nArg = process.argv[2] ?? '5';
    const n = parseInt(nArg, 10);
    if (!isNaN(n)) {
        analyzeGodsNumber(n);
    }
}

main();
