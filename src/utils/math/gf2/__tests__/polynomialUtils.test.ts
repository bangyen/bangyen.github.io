// @vitest-environment node
import { describe, it, expect } from 'vitest';

import {
    polyDegree,
    polyDiv,
    polyMod,
    evalPolynomial,
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

    describe('getPolynomial', () => {
        it('should return correct polynomials in the sequence', () => {
            expect(getPolynomial(0)).toBe(0n);
            expect(getPolynomial(1)).toBe(1n);
            expect(getPolynomial(2)).toBe(2n);
            expect(getPolynomial(3)).toBe(5n);
        });
    });
});
