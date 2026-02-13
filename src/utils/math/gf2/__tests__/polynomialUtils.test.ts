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
    polyToString,
    toSuperscript,
    getPolynomial,
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
            const { quotient, remainder } = polyDiv(0b111n, 0b11n);
            expect(quotient).toBe(0b10n);
            expect(remainder).toBe(0b1n);
        });

        it('should throw error for division by zero', () => {
            expect(() => polyDiv(0b1n, 0n)).toThrow(
                'Division by zero polynomial',
            );
        });

        it('should return correct remainder with polyMod', () => {
            expect(polyMod(0b111n, 0b11n)).toBe(0b1n);
            expect(polyMod(0b110n, 0b11n)).toBe(0n);
        });
    });

    describe('evalPolynomial', () => {
        it('should evaluate polynomial with matrix correctly', () => {
            const mat = [0b110n, 0b111n, 0b011n];
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
            const res = evalPolynomial(mat, minPoly);
            expect(res.every(row => row === 0n)).toBe(true);
        });
    });

    describe('getIrreducibles', () => {
        it('should return irreducible polynomials and use cache', () => {
            const irr1 = getIrreducibles(1);
            expect(irr1).toContain(2n);
            expect(irr1).toContain(3n);

            const irr2 = getIrreducibles(1);
            expect(irr2).toEqual(irr1);

            const irr3 = getIrreducibles(4);
            expect(irr3.length).toBeGreaterThan(irr1.length);
            expect(irr3).toContain(19n); // x^4+x+1
        });
    });

    describe('factorPoly', () => {
        it('should factor polynomials in GF(2)[x]', () => {
            const factors = factorPoly(0b101n);
            expect(factors).toContainEqual({ factor: 3n, exponent: 2 });

            const factors2 = factorPoly(0b1_1101n);
            expect(factors2).toContainEqual({ factor: 11n, exponent: 1 });
        });

        it('should return empty list for 0 and 1', () => {
            expect(factorPoly(0n)).toEqual([]);
            expect(factorPoly(1n)).toEqual([]);
        });
    });

    describe('polyToString and toSuperscript', () => {
        it('should format polynomials correctly', () => {
            expect(polyToString(0n)).toBe('0');
            expect(polyToString(1n)).toBe('1');
            expect(polyToString(2n)).toBe('x');
            expect(polyToString(3n)).toBe('x + 1');
            expect(polyToString(0b1011n)).toBe('x^{3} + x + 1');
        });

        it('should handle middle terms correctly', () => {
            // x^3 + 1 (binary 1001)
            expect(polyToString(0b1001n)).toBe('x^{3} + 1');
            // x^3 + x (binary 1010)
            expect(polyToString(0b1010n)).toBe('x^{3} + x');
        });

        it('should format superscripts correctly', () => {
            expect(toSuperscript(2)).toBe('^{2}');
            expect(toSuperscript(10)).toBe('^{10}');
        });
    });

    describe('getPolynomial', () => {
        it('should return correct polynomials in the sequence', () => {
            expect(getPolynomial(0)).toBe(0n);
            expect(getPolynomial(1)).toBe(1n);
            expect(getPolynomial(2)).toBe(2n);
            expect(getPolynomial(3)).toBe(5n);
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
        });

        it('should find pattern for size 1 and 2', () => {
            const p1 = findPattern(1);
            expect(p1.n).toBe(1);
            expect(p1.z).toBe(3);

            const p2 = findPattern(2);
            expect(p2.n).toBe(2);
            expect(p2.z).toBe(2);
        });
    });
});
