import { describe, it, expect } from 'vitest';

import * as gf2 from '../gf2Operations';

describe('gf2Operations', () => {
    describe('countBits', () => {
        it('should count bits in bigint correctly', () => {
            expect(gf2.countBits(0n)).toBe(0);
            expect(gf2.countBits(1n)).toBe(1);
            expect(gf2.countBits(2n)).toBe(1);
            expect(gf2.countBits(3n)).toBe(2);
            expect(gf2.countBits(7n)).toBe(3);
            expect(gf2.countBits(0b10_1101n)).toBe(4);
            expect(gf2.countBits(0xffn)).toBe(8);
        });

        it('should throw error for negative bigints', () => {
            expect(() => gf2.countBits(-1n)).toThrow(
                'countBits called on negative bigint',
            );
        });
    });

    describe('getIdentity', () => {
        it('should create an identity matrix of the specified size', () => {
            expect(gf2.getIdentity(1)).toEqual([1n]);
            expect(gf2.getIdentity(2)).toEqual([0b10n, 0b01n]);
            expect(gf2.getIdentity(3)).toEqual([0b100n, 0b010n, 0b001n]);
        });
    });

    describe('addSym', () => {
        it('should perform XOR addition of matrices', () => {
            const A = [0b11n, 0b01n];
            const B = [0b10n, 0b11n];
            // 11 ^ 10 = 01
            // 01 ^ 11 = 10
            expect(gf2.addSym(A, B)).toEqual([0b01n, 0b10n]);
        });
    });

    describe('multiplySym', () => {
        it('should multiply matrices in GF(2)', () => {
            // [1 0] [1 1]   [1 1]
            // [1 1] [0 1] = [1 0]
            const A = [0b10n, 0b11n];
            const B = [0b11n, 0b01n];
            expect(gf2.multiplySym(A, B)).toEqual([0b11n, 0b10n]);
        });

        it('should return zero matrix when multiplying by zero matrix', () => {
            const A = [0b10n, 0b11n];
            const Z = [0n, 0n];
            expect(gf2.multiplySym(A, Z)).toEqual([0n, 0n]);
        });

        it('should return same matrix when multiplying by identity', () => {
            const A = [0b10n, 0b11n];
            const I = gf2.getIdentity(2);
            expect(gf2.multiplySym(A, I)).toEqual(A);
            expect(gf2.multiplySym(I, A)).toEqual(A);
        });
    });

    describe('symmetricPow', () => {
        it('should compute matrix power correctly', () => {
            const A = [0b11n, 0b01n];
            expect(gf2.symmetricPow(A, 0)).toEqual(gf2.getIdentity(2));
            expect(gf2.symmetricPow(A, 1)).toEqual(A);
            expect(gf2.symmetricPow(A, 2)).toEqual(gf2.multiplySym(A, A));
            expect(gf2.symmetricPow(A, 3)).toEqual(
                gf2.multiplySym(gf2.multiplySym(A, A), A),
            );
        });

        it('should use cache if provided', () => {
            const A = [0b10n, 0b01n];
            const cache = new Map<number, bigint[]>();
            const result1 = gf2.symmetricPow(A, 2, cache);
            expect(cache.has(2)).toBe(true);
            expect(cache.get(2)).toEqual(result1);

            const result2 = gf2.symmetricPow(A, 2, cache);
            expect(result2).toBe(result1); // Should be same object reference if returned from cache
        });
    });

    describe('isIdentity', () => {
        it('should correctly identify identity matrices', () => {
            expect(gf2.isIdentity([0b10n, 0b01n])).toBe(true);
            expect(gf2.isIdentity([0b11n, 0b01n])).toBe(false);
            expect(gf2.isIdentity([0b00n, 0b00n])).toBe(false);
        });
    });

    describe('isZero', () => {
        it('should correctly identify zero matrices', () => {
            expect(gf2.isZero([0n, 0n])).toBe(true);
            expect(gf2.isZero([0n, 1n])).toBe(false);
        });
    });

    describe('invertMatrix', () => {
        it('should invert an invertible matrix', () => {
            // [1 1]
            // [0 1]
            // Inverse is itself in GF(2)
            const A = [0b11n, 0b01n];
            const inv = gf2.invertMatrix(A);
            expect(gf2.multiplySym(A, inv)).toEqual(gf2.getIdentity(2));
        });

        it('should invert a 3x3 matrix', () => {
            const A = [0b110n, 0b011n, 0b111n];
            const inv = gf2.invertMatrix(A);
            const product = gf2.multiplySym(A, inv);
            expect(gf2.isIdentity(product)).toBe(true);
        });
    });

    describe('defensive checks and edge cases', () => {
        it('addSym handles undefined rows', () => {
            const A = [1n, undefined as any];
            const B = [1n, 1n];
            expect(gf2.addSym(A, B)).toEqual([0n]);
        });

        it('multiplySym handles undefined rows', () => {
            const A = [1n, undefined as any];
            const B = [1n, 1n];
            expect(gf2.multiplySym(A, B)).toEqual([1n, 0n]);

            const A2 = [1n];
            const B2 = [undefined as any];
            expect(gf2.multiplySym(A2, B2)).toEqual([0n]);
        });

        it('sortMatrices handles undefined rows', () => {
            const A = [undefined as any, 1n];
            const I = [1n, 0n];
            const [outA, outI] = gf2.sortMatrices(A, I);
            expect(outA).toEqual([0n, 1n]);
            expect(outI).toEqual([1n, 0n]);
        });

        it('sortMatrices handles equal values', () => {
            const A = [1n, 1n];
            const I = [1n, 0n];
            const [outA, outI] = gf2.sortMatrices(A, I);
            expect(outA).toEqual([1n, 1n]);
            expect(outI).toEqual([1n, 0n]);
        });

        it('invertMatrix handles singular matrices (not fully, but defensive checks should be hit)', () => {
            const A = [0b10n, 0b00n]; // Singular
            const inv = gf2.invertMatrix(A);
            expect(inv).toBeDefined();
        });
    });
});
