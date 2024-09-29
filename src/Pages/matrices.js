function getMatrix(cols) {
    const first = 7 << (cols - 2);
    const matrix = [first];

    for (let k = 1; k < cols; k++) {
        const prev = matrix[k - 1];
        const next = prev >> 1;
        matrix.push(next);
    }

    matrix[0] -= 2 ** cols;
    return matrix;
}

function countBits(num) {
    let count = 0;

    while (num) {
        num &= num - 1;
        count++;
    }

    return count;
}

function multiplySym(matrixA, matrixB) {
    const size = matrixA.length;
    const output = [];

    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        let outputRow = 0;

        for (let c = 0; c < size; c++) {
            const colB = matrixB[c];
            const value = rowA & colB;
            const count = countBits(value);

            outputRow <<= 1;
            outputRow += count & 1;
        }

        output.push(outputRow);
    }

    return output;
}

function getIdentity(size) {
    const output = Array(size).fill(1);

    for (let r = 0; r < size; r++)
        output[r] <<= (size - r - 1);

    return output;
}

function symmetricPow(matrix, power) {
    const size = matrix.length;
    let output = getIdentity(size);

    for (let k = 0; k < power; k++)
        output = multiplySym(
            output, matrix);

    return output;
}

function addSym(matrixA, matrixB) {
    const size = matrixA.length;
    const output = [];

    for (let r = 0; r < size; r++) {
        const rowA = matrixA[r];
        const rowB = matrixB[r];
        const outputRow = rowA ^ rowB;
        output.push(outputRow);
    }

    return output;
}

function getPolynomial(index) {
    const output = [0, 1];

    for (let k = 1; k < index; k++) {
        const curr = output[k];
        const prev = output[k - 1];
        const double = curr << 1;
        output.push(double ^ prev);
    }

    return output[index];
}

function evalPolynomial(matrix, poly) {
    const size = matrix.length;
    let output = Array(size).fill(0);
    let degree = 0;

    while (poly) {
        if (poly & 1) {
            const power = symmetricPow(
                matrix, degree);
            output = addSym(
                output, power);
        }

        poly >>= 1;
        degree++;
    }

    return output;
}

function sortMatrices(matrix, identity) {
    const size = matrix.length;
    const sorted = [...Array(size).keys()]
        .sort((a, b) => matrix[b] - matrix[a]);

    const original = sorted.map(row => matrix[row]);
    const inverted = sorted.map(row => identity[row]);

    return [original, inverted];
}

function invertMatrix(matrix) {
    const size = matrix.length;
    const identity = getIdentity(size);

    let original = matrix;
    let inverted = identity;

    for (let c = 0; c < size; c++) {
        const pow = 1 << (size - c - 1);

        [original, inverted] = sortMatrices(
            original, inverted);

        for (let r = 0; r < size; r++) {
            const alt = original[r];

            if (r === c)
                continue;

            if (alt & pow) {
                original[r] ^= original[c];
                inverted[r] ^= inverted[c];
            }
        }
    }

    return inverted;
}

export function getInverse(input, rows, cols) {
    const matrix  = getMatrix(cols);
    const weights = getPolynomial(rows + 1);
    const product = evalPolynomial(matrix, weights);

    const inverse = invertMatrix(product);
    const binary  = parseInt(input.join(''), 2);

    const getParity = row => {
        const value = row & binary;
        const count = countBits(value);
        return count & 1;
    };

    return inverse
        .map(getParity);
}
