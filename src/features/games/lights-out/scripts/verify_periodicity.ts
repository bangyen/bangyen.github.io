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

function getMatrix(cols: number): number[] {
    if (cols === 1) return [1];
    const first = 7 << (cols - 2);
    const matrix = [first];
    for (let k = 1; k < cols; k++) {
        const prev = matrix[k - 1];
        if (prev !== undefined) matrix.push(prev >> 1);
    }
    const firstVal = matrix[0];
    if (firstVal !== undefined) matrix[0] = firstVal - 2 ** cols;
    return matrix;
}

function countBits(num: number): number {
    let count = 0;
    let n = num;
    while (n) {
        n &= n - 1;
        count++;
    }
    return count;
}

function multiplySym(matrixA: number[], matrixB: number[]): number[] {
    const size = matrixA.length;
    const output: number[] = [];
    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        let outputRow = 0;
        for (let c = 0; c < size; c++) {
            const colB = matrixB[c];
            if (rowA !== undefined && colB !== undefined) {
                const value = rowA & colB;
                const count = countBits(value);
                outputRow = (outputRow << 1) | (count & 1);
            }
        }
        output.push(outputRow);
    }
    return output;
}

function getIdentity(size: number): number[] {
    return Array.from({ length: size }, (_, r) => 1 << (size - r - 1));
}

function symmetricPow(
    matrix: number[],
    power: number,
    cache: Map<number, number[]>
): number[] {
    const cached = cache.get(power);
    if (cached) return cached;
    const size = matrix.length;
    let output = getIdentity(size);
    let base = [...matrix];
    let p = power;
    while (p > 0) {
        if (p % 2 === 1) output = multiplySym(output, base);
        base = multiplySym(base, base);
        p = Math.floor(p / 2);
    }
    cache.set(power, output);
    return output;
}

function addSym(matrixA: number[], matrixB: number[]): number[] {
    return matrixA.map((val, i) => val ^ (matrixB[i] ?? 0));
}

/**
 * Gets the coefficients of the Fibonacci polynomial F_{index}(x) over F_2.
 * Returns a BigInt where the k-th bit is the coefficient of x^k.
 */
function getPolynomial(index: number): bigint {
    const output: bigint[] = [0n, 1n];
    for (let k = 1; k < index; k++) {
        output.push(((output[k] ?? 0n) << 1n) ^ (output[k - 1] ?? 0n));
    }
    return output[index] ?? 0n;
}

function evalPolynomial(
    matrix: number[],
    poly: bigint,
    cache: Map<number, number[]>
): number[] {
    const size = matrix.length;
    let output = Array<number>(size).fill(0);
    let p = poly;
    let degree = 0;
    while (p > 0n) {
        if (p & 1n) {
            output = addSym(output, symmetricPow(matrix, degree, cache));
        }
        p >>= 1n;
        degree++;
    }
    return output;
}

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
