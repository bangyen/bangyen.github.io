import init, { invert_matrix } from 'lights-out-wasm';

// Initialize the Wasm module
// Since we use vite-plugin-top-level-await, we can wait for it here
try {
    await init();
} catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Lights Out Wasm:', e);
}

export function getMatrix(cols: number): bigint[] {
    if (cols === 1) return [1n];
    const first = 7n << BigInt(cols - 2);
    const matrix = [first];

    for (let k = 1; k < cols; k++) {
        const prev = matrix[k - 1];
        if (prev !== undefined) {
            const next = prev >> 1n;
            matrix.push(next);
        }
    }

    const firstVal = matrix[0];
    if (firstVal !== undefined) matrix[0] = firstVal - (1n << BigInt(cols));
    return matrix;
}

export function countBits(num: bigint): number {
    let count = 0;

    let n = num;
    if (n < 0n) {
        throw new Error('countBits called on negative bigint');
    }

    while (n > 0n) {
        n &= n - 1n;
        count++;
    }

    return count;
}

export function toSuperscript(num: number): string {
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

export function polyToString(p: bigint): string {
    if (p === 0n) return '0';
    if (p === 1n) return '1';
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

export function multiplySym(matrixA: bigint[], matrixB: bigint[]): bigint[] {
    const size = matrixA.length;
    const output: bigint[] = [];

    // In GF(2), (AB)_i = sum_j A_{ij} B_j
    // This is equivalent to XORing rows of B where A_{ij} is 1.
    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        let outputRow = 0n;

        if (rowA !== undefined) {
            for (let c = 0; c < size; c++) {
                // Check if c-th bit of rowA is set.
                // Our bit order is: index 0 is high bit (c=0 corresponds to length-1 index)
                // Wait, getMatrix builds rows where index 0 is bit (cols - 1).
                // So bit j (from right) corresponds to column (size - 1 - j).
                // Or simply: bit index 'c' from left is (size - 1 - c) from right.
                if (rowA & (1n << BigInt(size - 1 - c))) {
                    const rowB = matrixB[c];
                    if (rowB !== undefined) {
                        outputRow ^= rowB;
                    }
                }
            }
        }

        output.push(outputRow);
    }

    return output;
}

export function getIdentity(size: number): bigint[] {
    const output = Array<bigint>(size).fill(1n);

    for (let r = 0; r < size; r++) {
        const val = output[r];
        if (val !== undefined) output[r] = val << BigInt(size - r - 1);
    }

    return output;
}

export function symmetricPow(
    matrix: bigint[],
    power: number,
    cache?: Map<number, bigint[]>
): bigint[] {
    const cached = cache?.get(power);
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

    cache?.set(power, output);

    return output;
}

export function addSym(matrixA: bigint[], matrixB: bigint[]): bigint[] {
    const size = matrixA.length;
    const output: bigint[] = [];

    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        const rowB = matrixB[r];
        if (rowA !== undefined && rowB !== undefined) {
            const outputRow = rowA ^ rowB;
            output.push(outputRow);
        }
    }

    return output;
}

export function getPolynomial(index: number): bigint {
    const output = [0n, 1n];

    for (let k = 1; k < index; k++) {
        const curr = output[k];
        const prev = output[k - 1];
        if (curr !== undefined && prev !== undefined) {
            const double = curr << 1n;
            output.push(double ^ prev);
        }
    }

    return output[index] ?? 0n;
}

export function polyDegree(p: bigint): number {
    if (p === 0n) return -1;
    return p.toString(2).length - 1;
}

export function polyDiv(
    a: bigint,
    b: bigint
): { quotient: bigint; remainder: bigint } {
    if (b === 0n) throw new Error('Division by zero polynomial');
    let quotient = 0n;
    let remainder = a;
    const degreeB = polyDegree(b);

    while (polyDegree(remainder) >= degreeB) {
        const shift = polyDegree(remainder) - degreeB;
        quotient ^= 1n << BigInt(shift);
        remainder ^= b << BigInt(shift);
    }

    return { quotient, remainder };
}

export function polyMod(a: bigint, b: bigint): bigint {
    return polyDiv(a, b).remainder;
}

export function getMinimalPolynomial(A: bigint[]): bigint {
    const size = A.length;

    function flatten(mat: bigint[]): bigint {
        let res = 0n;
        for (const r of mat) {
            res = (res << BigInt(size)) | r;
        }
        return res;
    }

    const basis: { vector: bigint; poly: bigint }[] = [];

    for (let d = 0; d <= size * size; d++) {
        const poly = 1n << BigInt(d);
        const Ad = evalPolynomial(A, poly);
        let v = flatten(Ad);
        let currentPoly = poly;

        for (const b of basis) {
            if (polyDegree(v ^ b.vector) < polyDegree(v)) {
                v ^= b.vector;
                currentPoly ^= b.poly;
            }
        }

        if (v === 0n) {
            return currentPoly;
        } else {
            basis.push({ vector: v, poly: currentPoly });
            basis.sort((a, b) => (a.vector > b.vector ? -1 : 1));
        }
    }

    return getPolynomial(size + 1);
}

const irreduciblesCache: bigint[] = [2n, 3n]; // x, x+1
let maxCachedDegree = 1;

export function getIrreducibles(maxDegree: number): bigint[] {
    if (maxDegree <= maxCachedDegree) {
        return irreduciblesCache.filter(p => polyDegree(p) <= maxDegree);
    }

    for (
        let p = 1n << BigInt(maxCachedDegree + 1);
        polyDegree(p) <= maxDegree;
        p++
    ) {
        let isIrreducible = true;
        const degP = polyDegree(p);
        for (const f of irreduciblesCache) {
            if (polyDegree(f) > degP / 2) break;
            if (polyMod(p, f) === 0n) {
                isIrreducible = false;
                break;
            }
        }
        if (isIrreducible) irreduciblesCache.push(p);
    }

    maxCachedDegree = maxDegree;
    return irreduciblesCache;
}

export function factorPoly(p: bigint): { factor: bigint; exponent: number }[] {
    if (p === 0n) return [];
    if (p === 1n) return [];
    const factors: { factor: bigint; exponent: number }[] = [];
    let rem = p;
    const irreducibles = getIrreducibles(polyDegree(p));

    for (const f of irreducibles) {
        if (polyMod(rem, f) === 0n) {
            let exponent = 0;
            while (polyMod(rem, f) === 0n) {
                rem = polyDiv(rem, f).quotient;
                exponent++;
            }
            factors.push({ factor: f, exponent });
        }
        if (rem === 1n) break;
    }

    return factors;
}

export function evalPolynomial(
    matrix: bigint[],
    poly: bigint,
    cache?: Map<number, bigint[]>
): bigint[] {
    const size = matrix.length;
    let output = Array<bigint>(size).fill(0n);
    let degree = 0;

    let p = poly;
    while (p > 0n) {
        if (p & 1n) {
            const power = symmetricPow(matrix, degree, cache);

            output = addSym(output, power);
        }

        p >>= 1n;
        degree++;
    }

    return output;
}

export function sortMatrices(
    matrix: bigint[],
    identity: bigint[]
): [bigint[], bigint[]] {
    const size = matrix.length;
    const sorted = [...Array(size).keys()].sort((a, b) => {
        const valB = matrix[b];
        const valA = matrix[a];
        if (valB === undefined || valA === undefined) return 0;
        if (valB > valA) return 1;
        if (valB < valA) return -1;
        return 0;
    });

    const original = sorted.map(row => matrix[row] ?? 0n);
    const inverted = sorted.map(row => identity[row] ?? 0n);

    return [original, inverted];
}

export function invertMatrix(matrix: bigint[]): bigint[] {
    const size = matrix.length;
    const identity = getIdentity(size);

    let original = matrix;
    let inverted = identity;

    for (let c = 0; c < size; c++) {
        const pow = 1n << BigInt(size - c - 1);

        [original, inverted] = sortMatrices(original, inverted);

        for (let r = 0; r < size; r++) {
            const alt = original[r];
            if (alt === undefined) continue;

            if (r === c) continue;

            if (alt & pow) {
                const rowC = original[c];
                const invC = inverted[c];
                if (rowC !== undefined) {
                    const targetRow = original[r];
                    if (targetRow !== undefined) original[r] = targetRow ^ rowC;
                }
                if (invC !== undefined) {
                    const targetInv = inverted[r];
                    if (targetInv !== undefined) inverted[r] = targetInv ^ invC;
                }
            }
        }
    }

    return inverted;
}

export function isIdentity(matrix: bigint[]): boolean {
    const size = matrix.length;
    const identity = getIdentity(size);
    return matrix.every((val, i) => val === identity[i]);
}

export function isZero(matrix: bigint[]): boolean {
    return matrix.every(val => val === 0n);
}

export function getDivisors(n: number): number[] {
    const divisors: number[] = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            divisors.push(i);
            if (i !== n / i) {
                divisors.push(n / i);
            }
        }
    }
    return divisors.sort((a, b) => a - b);
}

function findMinimalPeriod(z: number, R: number[]): { z: number; R: number[] } {
    for (const candidate of getDivisors(z)) {
        if (candidate === 1 || candidate === z) continue;

        const candidateR = R.map(r => r % candidate)
            .filter((r, i, arr) => arr.indexOf(r) === i)
            .sort((a, b) => a - b);

        const expectedR: number[] = [];
        for (let v = 0; v < z; v++) {
            if (candidateR.includes(v % candidate)) {
                expectedR.push(v);
            }
        }

        if (
            JSON.stringify(R) === JSON.stringify(expectedR) &&
            candidateR.length < R.length
        ) {
            return findMinimalPeriod(candidate, candidateR);
        }
    }

    return { z, R };
}

export interface Pattern {
    n: number;
    z: number;
    R: number[];
    z_seq: number;
}

export function findPattern(n: number): Pattern {
    const A = getMatrix(n);
    const I = getIdentity(n);
    const Zero = Array.from({ length: n }, () => 0n);

    const sparseA: number[][] = [];
    for (let r = 0; r < n; r++) {
        const rowIndices: number[] = [];
        const rowVal = A[r];
        if (rowVal !== undefined) {
            for (let c = 0; c < n; c++) {
                if (rowVal & (1n << BigInt(n - 1 - c))) {
                    rowIndices.push(c);
                }
            }
        }
        sparseA.push(rowIndices);
    }

    let prev = [...Zero];
    let curr = [...I];
    const R: number[] = [0];

    for (let k = 2; k <= 10000000; k++) {
        const next: bigint[] = [];
        for (let r = 0; r < n; r++) {
            let nextRow = prev[r] ?? 0n;
            const indices = sparseA[r];
            if (indices) {
                for (const c of indices) {
                    const currRow = curr[c];
                    if (currRow !== undefined) {
                        nextRow ^= currRow;
                    }
                }
            }
            next.push(nextRow);
        }

        if (isIdentity(next)) {
            R.push(k - 1);
        }

        if (isIdentity(next) && isZero(curr)) {
            const fullZ = k - 1;
            const R_filtered = R.filter(r => r !== fullZ);
            const { z: minZ, R: minR } = findMinimalPeriod(fullZ, R_filtered);
            return { n, z: minZ, R: minR, z_seq: fullZ };
        }

        prev = curr;
        curr = next;
    }

    throw new Error(`Period not found for n=${n.toString()}`);
}

// Cache for matrix inversions: "rows,cols" -> inverse matrix
const inverseCache: Record<string, bigint[]> = {};

export function getProduct(
    input: number[],
    rows: number,
    cols: number
): number[] {
    const key = `${rows.toString()},${cols.toString()}`;

    if (!inverseCache[key]) {
        const matrix = getMatrix(cols);
        const weights = getPolynomial(rows + 1);
        const product = evalPolynomial(matrix, weights);

        if (cols <= 64) {
            try {
                // Convert bigint[] to BigUint64Array for Wasm
                // Note: BigInts in JS are arbitrary precision, but for <=64 cols they fit in 64 bits.
                const input = new BigUint64Array(
                    product.map(b => BigInt.asUintN(64, b))
                );
                const result = invert_matrix(input, product.length);
                inverseCache[key] = Array.from(result);
            } catch (_e) {
                // eslint-disable-next-line no-console
                console.warn('Wasm inversion failed, falling back to JS', _e);
                inverseCache[key] = invertMatrix(product);
            }
        } else {
            inverseCache[key] = invertMatrix(product);
        }
    }

    const inverse = inverseCache[key] as bigint[] | undefined;
    const binaryStr = input.join('');
    const binary = binaryStr ? BigInt('0b' + binaryStr) : 0n;

    const getParity = (row: bigint): number => {
        const value = row & binary;
        const count = countBits(value);
        return count & 1;
    };

    if (inverse === undefined) {
        throw new Error('Inverse matrix not found in cache');
    }

    return inverse.map(getParity);
}

export function getKernelBasis(matrix: bigint[], size: number): bigint[] {
    const rows = [...matrix];
    const basis: bigint[] = getIdentity(size);
    let pivotRow = 0;

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);

        // Find pivot
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            // Swap
            const rowP = rows[p];
            const basisP = basis[p];
            const rowPivot = rows[pivotRow];
            const basisPivot = basis[pivotRow];

            if (
                rowP !== undefined &&
                basisP !== undefined &&
                rowPivot !== undefined &&
                basisPivot !== undefined
            ) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                basis[pivotRow] = basisP;
                basis[p] = basisPivot;

                const rP = rows[pivotRow] ?? 0n;
                const bP = basis[pivotRow] ?? 0n;

                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    const basisR = basis[r];
                    if (
                        r !== pivotRow &&
                        rowR !== undefined &&
                        basisR !== undefined &&
                        rowR & pow
                    ) {
                        rows[r] = rowR ^ rP;
                        basis[r] = basisR ^ bP;
                    }
                }
            }
            pivotRow++;
        }
    }

    // The kernel corresponds to rows in the diagonalized matrix that are zero
    const kernel: bigint[] = [];
    for (let i = pivotRow; i < rows.length; i++) {
        const rowBasis = basis[i];
        if (rowBasis !== undefined) {
            kernel.push(rowBasis);
        }
    }
    return kernel;
}

export function getMinWeightSolution(
    matrix: bigint[],
    target: bigint,
    size: number
): bigint {
    const rows = [...matrix];
    const basis: bigint[] = getIdentity(size);
    let pivotRow = 0;
    const pivots: number[] = [];

    // Gaussian elimination to RREF
    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const basisP = basis[p];
            const rowPivot = rows[pivotRow];
            const basisPivot = basis[pivotRow];

            if (
                rowP !== undefined &&
                basisP !== undefined &&
                rowPivot !== undefined &&
                basisPivot !== undefined
            ) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                basis[pivotRow] = basisP;
                basis[p] = basisPivot;

                const rP = rows[pivotRow] ?? 0n;
                const bP = basis[pivotRow] ?? 0n;

                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    const basisR = basis[r];
                    if (
                        r !== pivotRow &&
                        rowR !== undefined &&
                        basisR !== undefined &&
                        rowR & pow
                    ) {
                        rows[r] = rowR ^ rP;
                        basis[r] = basisR ^ bP;
                    }
                }
            }
            pivots[pivotRow] = c;
            pivotRow++;
        }
    }

    // Find particular solution
    let particular = 0n;
    let current = target;
    for (let i = 0; i < pivotRow; i++) {
        const c = pivots[i];
        if (c === undefined) continue;

        const pow = 1n << BigInt(size - 1 - c);
        if (current & pow) {
            const rowI = rows[i];
            const basisI = basis[i];
            if (rowI !== undefined && basisI !== undefined) {
                current ^= rowI;
                particular ^= basisI;
            }
        }
    }

    if (current !== 0n) return -1n; // No solution

    // Combine with kernel to find min weight (brute force for small kernels, heuristic for large)
    const kernel = getKernelBasis(matrix, size);
    if (kernel.length > 20) return particular; // Too large to brute force efficiently here

    let minSol = particular;
    let minWeight = countBits(particular);

    for (let i = 1; i < 1 << kernel.length; i++) {
        let candidate = particular;
        for (let j = 0; j < kernel.length; j++) {
            if ((i >> j) & 1) {
                const kernelJ = kernel[j];
                if (kernelJ !== undefined) {
                    candidate ^= kernelJ;
                }
            }
        }
        const weight = countBits(candidate);
        if (weight < minWeight) {
            minWeight = weight;
            minSol = candidate;
        }
    }

    return minSol;
}

export function getImageBasis(matrix: bigint[], size: number): bigint[] {
    const rows = [...matrix];
    let pivotRow = 0;

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const rowPivot = rows[pivotRow];
            if (rowP !== undefined && rowPivot !== undefined) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                const rP = rows[pivotRow] ?? 0n;
                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    if (r !== pivotRow && rowR !== undefined && rowR & pow) {
                        rows[r] = rowR ^ rP;
                    }
                }
            }
            pivotRow++;
        }
    }

    return rows.slice(0, pivotRow);
}

export function getImageMapping(
    matrix: bigint[],
    size: number
): { state: bigint; toggle: bigint }[] {
    const rows = [...matrix];
    const mapping: bigint[] = getIdentity(size);
    let pivotRow = 0;

    for (let c = 0; c < size && pivotRow < rows.length; c++) {
        const pow = 1n << BigInt(size - 1 - c);
        let p = pivotRow;
        while (p < rows.length) {
            const rowP = rows[p];
            if (rowP !== undefined && rowP & pow) break;
            p++;
        }

        if (p < rows.length) {
            const rowP = rows[p];
            const mapP = mapping[p];
            const rowPivot = rows[pivotRow];
            const mapPivot = mapping[pivotRow];

            if (
                rowP !== undefined &&
                mapP !== undefined &&
                rowPivot !== undefined &&
                mapPivot !== undefined
            ) {
                rows[pivotRow] = rowP;
                rows[p] = rowPivot;
                mapping[pivotRow] = mapP;
                mapping[p] = mapPivot;

                const rP = rows[pivotRow] ?? 0n;
                const mP = mapping[pivotRow] ?? 0n;

                for (let r = 0; r < rows.length; r++) {
                    const rowR = rows[r];
                    const mapR = mapping[r];
                    if (
                        r !== pivotRow &&
                        rowR !== undefined &&
                        mapR !== undefined &&
                        rowR & pow
                    ) {
                        rows[r] = rowR ^ rP;
                        mapping[r] = mapR ^ mP;
                    }
                }
            }
            pivotRow++;
        }
    }

    const result: { state: bigint; toggle: bigint }[] = [];
    for (let i = 0; i < pivotRow; i++) {
        const state = rows[i];
        const toggle = mapping[i];
        if (state !== undefined && toggle !== undefined) {
            result.push({ state, toggle });
        }
    }
    return result;
}
