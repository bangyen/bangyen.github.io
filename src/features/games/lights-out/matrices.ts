export function getMatrix(cols: number): number[] {
    const first = 7 << (cols - 2);
    const matrix = [first];

    for (let k = 1; k < cols; k++) {
        const prev = matrix[k - 1];
        if (prev !== undefined) {
            const next = prev >> 1;
            matrix.push(next);
        }
    }

    const firstVal = matrix[0];
    if (firstVal !== undefined) matrix[0] = firstVal - 2 ** cols;
    return matrix;
}

export function countBits(num: number): number {
    let count = 0;

    while (num) {
        num &= num - 1;
        count++;
    }

    return count;
}

export function multiplySym(matrixA: number[], matrixB: number[]): number[] {
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

                outputRow <<= 1;
                outputRow += count & 1;
            }
        }

        output.push(outputRow);
    }

    return output;
}

export function getIdentity(size: number): number[] {
    const output = Array<number>(size).fill(1);

    for (let r = 0; r < size; r++) {
        const val = output[r];
        if (val !== undefined) output[r] = val << (size - r - 1);
    }

    return output;
}

export function symmetricPow(matrix: number[], power: number): number[] {
    const size = matrix.length;
    let output = getIdentity(size);

    for (let k = 0; k < power; k++) output = multiplySym(output, matrix);

    return output;
}

export function addSym(matrixA: number[], matrixB: number[]): number[] {
    const size = matrixA.length;
    const output: number[] = [];

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

export function getPolynomial(index: number): number {
    const output = [0, 1];

    for (let k = 1; k < index; k++) {
        const curr = output[k];
        const prev = output[k - 1];
        if (curr !== undefined && prev !== undefined) {
            const double = curr << 1;
            output.push(double ^ prev);
        }
    }

    return output[index] ?? 0;
}

export function evalPolynomial(matrix: number[], poly: number): number[] {
    const size = matrix.length;
    let output = Array<number>(size).fill(0);
    let degree = 0;

    while (poly) {
        if (poly & 1) {
            const power = symmetricPow(matrix, degree);

            output = addSym(output, power);
        }

        poly >>= 1;
        degree++;
    }

    return output;
}

export function sortMatrices(
    matrix: number[],
    identity: number[]
): [number[], number[]] {
    const size = matrix.length;
    const sorted = [...Array(size).keys()].sort((a, b) => {
        const valB = matrix[b];
        const valA = matrix[a];
        if (valB === undefined || valA === undefined) return 0;
        return valB - valA;
    });

    const original = sorted.map(row => matrix[row] ?? 0);
    const inverted = sorted.map(row => identity[row] ?? 0);

    return [original, inverted];
}

export function invertMatrix(matrix: number[]): number[] {
    const size = matrix.length;
    const identity = getIdentity(size);

    let original = matrix;
    let inverted = identity;

    for (let c = 0; c < size; c++) {
        const pow = 1 << (size - c - 1);

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
const inverseCache: Record<string, number[]> = {};

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
    const binary = parseInt(input.join(''), 2);

    const getParity = (row: number): number => {
        const value = row & binary;
        const count = countBits(value);
        return count & 1;
    };

    return inverse.map(getParity);
}
