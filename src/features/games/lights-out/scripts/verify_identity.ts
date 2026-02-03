/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/*
    Verification Script for Lights Out Identity Matrix Property
    
    This script empirically checks which grid sizes (rows x cols) result in the 
    calculator acting as an Identity Matrix (output == input).
    
    It re-implements the core matrix logic from the game to run in a standalone node environment.
    
    Usage:
    npx tsx src/features/games/lights-out/verify_identity.ts
*/

function getMatrix(cols: number): number[] {
    // Special case for n=1: L_1 = [1] (1x1 matrix)
    // The general formula 7 << (cols-2) fails for cols=1 due to negative shift
    if (cols === 1) {
        return [1];
    }

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

function countBits(num: number): number {
    let count = 0;
    // Brian Kernighan's algorithm
    while (num) {
        num &= num - 1;
        count++;
    }
    return count;
}

// Matrix Multiplication over GF(2)
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

                outputRow <<= 1;
                outputRow += count & 1;
            }
        }

        output.push(outputRow);
    }

    return output;
}

function getIdentity(size: number): number[] {
    const output = Array<number>(size).fill(1);

    for (let r = 0; r < size; r++) {
        const val = output[r];
        if (val !== undefined) output[r] = val << (size - r - 1);
    }

    return output;
}

// Matrix Exponentiation (M^k)
function symmetricPow(matrix: number[], power: number): number[] {
    const size = matrix.length;
    let output = getIdentity(size);

    for (let k = 0; k < power; k++) output = multiplySym(output, matrix);

    return output;
}

// Matrix Addition over GF(2) (XOR)
function addSym(matrixA: number[], matrixB: number[]): number[] {
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

/*
    Fibonacci Polynomials over GF(2):
    F_0 = 0, F_1 = 1
    F_{k} = x * F_{k-1} + F_{k-2}
    
    Weights are computed based on these polynomials.
*/
function getPolynomial(index: number): number {
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

function evalPolynomial(matrix: number[], poly: number): number[] {
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

function check(rows: number, cols: number): boolean {
    // 1. Construct the Adjacency Matrix + Identity for the path graph of size 'cols'
    const matrix = getMatrix(cols);

    // 2. Compute the polynomial F_{rows+1}(x+1) + 1  (The code implicitly handles the basis change)
    // Actually, 'getPolynomial' computes coefficients for F_{rows+1}
    const weights = getPolynomial(rows + 1);

    // 3. Evaluate the polynomial on the matrix
    const product = evalPolynomial(matrix, weights);

    // 4. Check if the result is the Identity Matrix
    const identity = getIdentity(cols);

    for (let i = 0; i < cols; i++) {
        if (product[i] !== identity[i]) return false;
    }
    return true;
}

const args = process.argv.slice(2);
const MAX_SEARCH = parseInt(args[0] ?? '30', 10);

if (isNaN(MAX_SEARCH) || MAX_SEARCH <= 0) {
    console.error(
        'Invalid argument. Please provide a positive integer for the max grid size.'
    );
    process.exit(1);
}

console.log(
    `Searching for Identity Matrix cases (Rows x Cols) up to ${MAX_SEARCH}x${MAX_SEARCH}...`
);
console.log('----------------------------------------------------------------');

for (let r = 1; r <= MAX_SEARCH; r++) {
    for (let c = 1; c <= MAX_SEARCH; c++) {
        if (check(r, c)) {
            console.log(`[PASS] ${r} rows x ${c} cols`);
        }
    }
}
console.log('----------------------------------------------------------------');
console.log('Done.');
