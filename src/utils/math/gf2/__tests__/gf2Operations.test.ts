// @vitest-environment node
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
            expect(gf2.getIdentity(2)).toEqual([0b01n, 0b10n]);
            expect(gf2.getIdentity(3)).toEqual([0b001n, 0b010n, 0b100n]);
        });
    });

    describe('addSym', () => {
        it('should perform XOR addition of matrices', () => {
            const A = [0b01n, 0b10n];
            const B = [0b11n, 0b11n];
            expect(gf2.addSym(A, B)).toEqual([0b10n, 0b01n]);
        });
    });

    describe('multiplySym', () => {
        it('should multiply matrices in GF(2)', () => {
            // [1 0] [1 1]   [1 1]
            // [1 1] [0 1] = [1 0]
            // Convention: each row bitmask has bit 0 as col 0.
            // A = [bit0 set, bit0+1 set] = [1, 3]
            // B = [bit0+1 set, bit1 set] = [3, 2]
            const A = [1n, 3n];
            const B = [3n, 2n];
            // Row 0 of A * B: (col 0 of A) * (row 0 of B) = 1 * [3, 2] = [3, 2]? No.
            // (A*B)_0 = sum A_0,k * B_k = A_0,0 * B_0 + A_0,1 * B_1 = 1 * B_0 + 0 * B_1 = B_0 = 3.
            // (A*B)_1 = A_1,0 * B_0 + A_1,1 * B_1 = 1 * B_0 + 1 * B_1 = 3 ^ 2 = 1.
            expect(gf2.multiplySym(A, B)).toEqual([3n, 1n]);
        });

        it('should return zero matrix when multiplying by zero matrix', () => {
            const A = [0b10n, 0b11n];
            const Z = [0n, 0n];
            expect(gf2.multiplySym(A, Z)).toEqual([0n, 0n]);
        });

        it('should return same matrix when multiplying by identity', () => {
            const A = [3n, 2n];
            const I = gf2.getIdentity(2);
            expect(gf2.multiplySym(A, I)).toEqual(A);
            expect(gf2.multiplySym(I, A)).toEqual(A);
        });
    });

    describe('symmetricPow', () => {
        it('should compute matrix power correctly', () => {
            const A = [3n, 2n];
            expect(gf2.symmetricPow(A, 0)).toEqual(gf2.getIdentity(2));
            expect(gf2.symmetricPow(A, 1)).toEqual(A);
            expect(gf2.symmetricPow(A, 2)).toEqual(gf2.multiplySym(A, A));
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

    describe('getSolutionMatrix', () => {
        it('should invert an invertible matrix', () => {
            // A = [1 1; 0 1] = [3, 2]. Self-inverse.
            const A = [3n, 2n];
            const inv = gf2.getSolutionMatrix(A);
            expect(inv).not.toBeNull();
            if (inv) {
                expect(inv).toEqual([3n, 2n]);
                expect(gf2.multiplySym(A, inv)).toEqual(gf2.getIdentity(2));
            }
        });

        it('should invert a 3x3 matrix', () => {
            // A = [1 1 0; 0 1 0; 0 0 1] = [3, 2, 4]
            const A = [3n, 2n, 4n];
            const inv = gf2.getSolutionMatrix(A);
            expect(inv).not.toBeNull();
            if (inv) {
                const product = gf2.multiplySym(A, inv);
                expect(product).toEqual(gf2.getIdentity(3));
            }
        });

        it('should find a solution matrix for singular matrices', () => {
            const A = [0b10n, 0b00n]; // Singular
            const solution = gf2.getSolutionMatrix(A);
            expect(solution).not.toBeNull();
            // Should be [0, 1] or similar - just needs to not be null.
            if (solution) {
                expect(solution).toHaveLength(2);
            }
        });
    });

    // ... (skipping some lines)

    describe('calculateSolutionVector', () => {
        it('should compute solution for simple grid (3x3)', () => {
            const input = [1, 0, 0, 0, 0, 0, 0, 0, 0];
            const result = gf2.calculateSolutionVector(input, 3, 3);
            expect(result).not.toBeNull();
            if (result) {
                expect(result).toHaveLength(3);
                expect(result.every(x => x === 0 || x === 1)).toBe(true);
            }
        });

        it('should handle empty input', () => {
            const input: number[] = [];
            const result = gf2.calculateSolutionVector(input, 3, 3);
            expect(result).not.toBeNull();
            if (result) {
                expect(result).toHaveLength(3);
                expect(result).toEqual([0, 0, 0]);
            }
        });
    });
});
