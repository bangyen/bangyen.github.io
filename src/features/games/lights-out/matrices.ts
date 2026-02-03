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

/*
    https://math.stackexchange.com/questions/2237467
    https://en.wikipedia.org/wiki/Fibonacci_polynomials
    https://graphics.stanford.edu/~seander/bithacks.html#:~:text=Brian%20Kernighan
*/
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
        inverseCache[key] = invertMatrix(product);
    }

    const inverse = inverseCache[key];
    const binaryStr = input.join('');
    const binary = binaryStr ? BigInt('0b' + binaryStr) : 0n;

    const getParity = (row: bigint): number => {
        const value = row & binary;
        const count = countBits(value);
        return count & 1;
    };

    return inverse.map(getParity);
}
