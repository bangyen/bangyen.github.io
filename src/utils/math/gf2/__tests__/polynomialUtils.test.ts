import { describe, it, expect } from 'vitest';

import { getMatrix } from '../matrixOperations';
import {
    polyDegree,
    polyDiv,
    polyMod,
    evalPolynomial,
    getMinimalPolynomial,
    getIrreducibles,
    factorPoly,
    getDivisors,
    findPattern,
} from '../polynomialUtils';

describe('polynomialUtils', () => {
    describe('polyDegree', () => {
        it('should return correct degree for GF(2) polynomials', () => {
            expect(polyDegree(0n)).toBe(-1);
            expect(polyDegree(1n)).toBe(0); // 1
            expect(polyDegree(2n)).toBe(1); // x
            expect(polyDegree(3n)).toBe(1); // x + 1
            expect(polyDegree(4n)).toBe(2); // x^2
            expect(polyDegree(7n)).toBe(2); // x^2 + x + 1
        });
    });

    describe('polyDiv and polyMod', () => {
        it('should perform polynomial division in GF(2)[x]', () => {
            // (x^2 + x + 1) / (x + 1)
            // In binary: 111 / 11
            // 111 = 11 * (10) + 1  => x^2+x+1 = (x+1)*x + 1
            const { quotient, remainder } = polyDiv(0b111n, 0b11n);
            expect(quotient).toBe(0b10n);
            expect(remainder).toBe(0b1n);
        });

        it('should return correct remainder with polyMod', () => {
            expect(polyMod(0b111n, 0b11n)).toBe(0b1n);
            expect(polyMod(0b110n, 0b11n)).toBe(0n);
        });
    });

    describe('evalPolynomial', () => {
        it('should evaluate polynomial with matrix correctly', () => {
            const mat = [0b110n, 0b111n, 0b011n]; // getMatrix(3)
            // poly = x + 1 (0b11)
            // res = mat + I
            const res = evalPolynomial(mat, 0b11n);
            expect(res).toEqual([
                0b110n ^ 0b100n,
                0b111n ^ 0b010n,
                0b011n ^ 0b001n,
            ]);
        });
    });

    describe('getMinimalPolynomial', () => {
        it('should find the minimal polynomial of a matrix', () => {
            const mat = getMatrix(3);
            const minPoly = getMinimalPolynomial(mat);
            // Minimal polynomial of A for n=3 is x^3 + x^2 + 1 (1101 = 13)
            // Check by evaluating:
            const res = evalPolynomial(mat, minPoly);
            expect(res.every(row => row === 0n)).toBe(true);
        });
    });

    describe('getIrreducibles', () => {
        it('should return irreducible polynomials up to degree 3', () => {
            const irr = getIrreducibles(3);
            // Deg 1: x (2), x+1 (3)
            // Deg 2: x^2+x+1 (7)
            // Deg 3: x^3+x+1 (11), x^3+x^2+1 (13)
            expect(irr).toContain(2n);
            expect(irr).toContain(3n);
            expect(irr).toContain(7n);
            expect(irr).toContain(11n);
            expect(irr).toContain(13n);
        });
    });

    describe('factorPoly', () => {
        it('should factor polynomials in GF(2)[x]', () => {
            // (x+1)^2 = x^2 + 1 (0b101)
            const factors = factorPoly(0b101n);
            expect(factors).toContainEqual({ factor: 3n, exponent: 2 });

            // (x^3+x+1)(x+1) = x^4 + x^3 + x^2 + 1 (0b11101 = 29)
            // Wait: (x^3+x+1)*(x+1) = x^4 + x^3 + x^2 + x + x + 1 = x^4 + x^3 + x^2 + 1 (in GF2)
            const factors2 = factorPoly(0b11101n);
            expect(factors2).toContainEqual({ factor: 11n, exponent: 1 });
            expect(factors2).toContainEqual({ factor: 3n, exponent: 1 });
        });
    });

    describe('getDivisors', () => {
        it('should compute all divisors of a number', () => {
            expect(getDivisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
            expect(getDivisors(7)).toEqual([1, 7]);
        });
    });

    describe('findPattern', () => {
        it('should find the period pattern for size 3', () => {
            const pattern = findPattern(3);
            expect(pattern.n).toBe(3);
            expect(pattern.z).toBeGreaterThan(0);
            expect(pattern.z_seq).toBeGreaterThan(0);
        });
    });
});
