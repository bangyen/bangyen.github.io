import {
    getMatrix,
    countBits,
    getIdentity,
    multiplySym,
    addSym,
    symmetricPow,
    getPolynomial,
    invertMatrix,
    getProduct,
    sortMatrices, // Exported this too
    evalPolynomial, // And this
} from '../matrices';

describe('Lights Out Matrix Utilities', () => {
    test('countBits returns correct number of set bits', () => {
        expect(countBits(0)).toBe(0);
        expect(countBits(1)).toBe(1);
        expect(countBits(3)).toBe(2); // 11
        expect(countBits(7)).toBe(3); // 111
        expect(countBits(0b10101)).toBe(3);
    });

    test('getIdentity returns identity matrix', () => {
        const id3 = getIdentity(3);
        // Size 3:
        // 100 -> 4
        // 010 -> 2
        // 001 -> 1
        expect(id3).toEqual([4, 2, 1]);
    });

    test('getMatrix generates correct matrix for size 3', () => {
        const m3 = getMatrix(3);
        // Expected: [6, 7, 3] as derived
        // 110 (6)
        // 111 (7)
        // 011 (3)
        expect(m3).toEqual([6, 7, 3]);
    });

    test('addSym performs XOR addition', () => {
        const a = [0b101, 0b010];
        const b = [0b011, 0b110];
        // 101 ^ 011 = 110 (6)
        // 010 ^ 110 = 100 (4)
        expect(addSym(a, b)).toEqual([6, 4]);
    });

    test('addSym satisfies A + A = 0', () => {
        const a = [123, 456];
        expect(addSym(a, a)).toEqual([0, 0]);
    });

    test('multiplySym performs matrix multiplication over GF(2)', () => {
        const id = getIdentity(3);
        const mat = [6, 7, 3];
        // I * A = A
        expect(multiplySym(id, mat)).toEqual(mat);
        // A * I = A (since sym)
        expect(multiplySym(mat, id)).toEqual(mat);
    });

    test('symmetricPow computes powers', () => {
        const mat = getIdentity(3);
        // I^n = I
        expect(symmetricPow(mat, 5)).toEqual(mat);

        const m3 = getMatrix(3);
        // m3^0 = I
        expect(symmetricPow(m3, 0)).toEqual(getIdentity(3));
        // m3^1 = m3
        expect(symmetricPow(m3, 1)).toEqual(m3);
        // m3^2 = m3 * m3
        expect(symmetricPow(m3, 2)).toEqual(multiplySym(m3, m3));
    });

    test('getPolynomial returns correct polynomial', () => {
        // Based on implementation: [0, 1]
        // k=1: curr=1, prev=0. double=2. push 2^0 = 2. output=[0, 1, 2]
        // k=2: curr=2, prev=1. double=4. push 4^1 = 5. output=[0, 1, 2, 5]
        // k=3: curr=5, prev=2. double=10. push 10^2 = 8. output=[0, 1, 2, 5, 8]
        // Values seem to depend on previous.
        expect(getPolynomial(0)).toBe(0);
        expect(getPolynomial(1)).toBe(1);
        expect(getPolynomial(2)).toBe(2);
        expect(getPolynomial(3)).toBe(5);
    });

    test('invertMatrix inverts a matrix', () => {
        const id = getIdentity(3);
        expect(invertMatrix(id)).toEqual(id);

        // A * A^-1 = I
        // Let's use getMatrix(3) which should be invertible?
        const m3 = getMatrix(3);
        const inv = invertMatrix(m3);
        const prod = multiplySym(m3, inv);
        expect(prod).toEqual(id);
    });

    test('sortMatrices sorts rows based on value', () => {
        const mat = [1, 4, 2];
        const id = [1, 2, 4];
        // Sort descending: 4 (idx 1), 2 (idx 2), 1 (idx 0)
        const [sortedMat, sortedId] = sortMatrices(mat, id);
        expect(sortedMat).toEqual([4, 2, 1]);
        expect(sortedId).toEqual([2, 4, 1]);
    });

    test('evalPolynomial evaluates poly on matrix', () => {
        const mat = getMatrix(3);
        // Poly 0 -> 0 matrix
        expect(evalPolynomial(mat, 0)).toEqual([0, 0, 0]);
        // Poly 1 -> I * mat^0 = I
        expect(evalPolynomial(mat, 1)).toEqual(getIdentity(3));
        // Poly 2 -> I * mat^1 + 0 * mat^0 ? No
        // Poly 2 (10 binary) -> bit 1 set. mat^1.
        expect(evalPolynomial(mat, 2)).toEqual(mat);
        // Poly 3 (11 binary) -> mat^1 + mat^0
        expect(evalPolynomial(mat, 3)).toEqual(addSym(mat, getIdentity(3)));
    });

    test('getProduct returns solution vector', () => {
        // Empty inputs
        expect(getProduct([], 3, 3)).toEqual([0, 0, 0]);
        // Input all 0s
        expect(getProduct([0, 0, 0], 3, 3)).toEqual([0, 0, 0]);
    });
});
