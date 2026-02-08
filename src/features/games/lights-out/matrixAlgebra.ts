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
