// @vitest-environment node
import { describe, it, expect } from 'vitest';

import { evalPolynomial, getPolynomial } from '../polynomialUtils';

describe('polynomialUtils', () => {
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
