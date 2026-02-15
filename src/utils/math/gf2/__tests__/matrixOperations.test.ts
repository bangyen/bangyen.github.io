// @vitest-environment node
import { describe, it, expect } from 'vitest';

import { getIdentity } from '../gf2Operations';
import {
    getMatrix,
    getKernelBasis,
    getMinWeightSolution,
    getImageBasis,
    getImageMapping,
} from '../matrixOperations';

describe('matrixOperations', () => {
    describe('getMatrix', () => {
        it('should generate correct 1D adjacency matrix for size 3', () => {
            const m3 = getMatrix(3);
            // Expected:
            // 110 (6) - first light affects self and right
            // 111 (7) - middle light affects self and both neighbors
            // 011 (3) - last light affects self and left
            expect(m3).toEqual([6n, 7n, 3n]);
        });

        it('should handle size 1', () => {
            expect(getMatrix(1)).toEqual([1n]);
        });
    });

    describe('getKernelBasis', () => {
        it('should find empty kernel for invertible matrix', () => {
            const id = getIdentity(3);
            const kernel = getKernelBasis(id, 3);
            expect(kernel).toHaveLength(0);
        });

        it('should find non-empty kernel for singular matrix', () => {
            const mat = [0b110n, 0b110n, 0b001n];
            const kernel = getKernelBasis(mat, 3);
            expect(kernel).toHaveLength(1);
            expect(kernel[0]).toBe(0b110n);
        });

        it('should handle matrix where some columns have no pivot', () => {
            // Matrix with middle column zero:
            // 1 0 0
            // 0 0 0
            // 0 0 1
            const mat = [0b100n, 0b000n, 0b001n];
            const kernel = getKernelBasis(mat, 3);
            // Nullity should be size - rank = 3 - 2 = 1
            expect(kernel).toHaveLength(1);
        });
    });

    describe('getImageBasis', () => {
        it('should return full basis for invertible matrix', () => {
            const id = getIdentity(3);
            const basis = getImageBasis(id, 3);
            expect(basis).toHaveLength(3);
        });

        it('should return reduced basis for singular matrix', () => {
            const mat = [0b110n, 0b110n, 0b001n];
            const basis = getImageBasis(mat, 3);
            expect(basis).toHaveLength(2);
        });
    });

    describe('getMinWeightSolution', () => {
        it('should find solution for invertible system', () => {
            const mat = [6n, 7n, 3n]; // getMatrix(3)
            const target = 0b111n; // all lights on
            const solution = getMinWeightSolution(mat, target, 3);
            expect(solution).not.toBe(-1n);

            let res = 0n;
            for (let i = 0; i < 3; i++) {
                if ((solution >> BigInt(3 - 1 - i)) & 1n) {
                    res ^= mat[i]!;
                }
            }
            expect(res).toBe(target);
        });

        it('should return -1n for unsolvable system', () => {
            const mat = [0b110n, 0b110n, 0b001n];
            const target = 0b100n;
            const solution = getMinWeightSolution(mat, target, 3);
            expect(solution).toBe(-1n);
        });

        it('should find minimum weight solution in presence of kernel', () => {
            const mat = [0b100n, 0b100n, 0b001n];
            const solution = getMinWeightSolution(mat, 0b101n, 3);
            expect(countBits(solution)).toBe(2);
        });

        it('should return particular solution early for very large kernels', () => {
            // kernel size > 20
            // We can simulate this with a matrix of size 30 and rank 5
            const size = 30;
            const mat = new Array<bigint>(size).fill(0n);
            for (let i = 0; i < 5; i++) mat[i] = 1n << BigInt(size - 1 - i);
            const target = 0b1_1111n << BigInt(size - 5);
            const solution = getMinWeightSolution(mat, target, size);
            expect(solution).not.toBe(-1n);
            // Since kernel length > 20, it returns the particular solution
            // which in this case is just the first 5 bits
            expect(solution).toBe(target);
        });
    });

    describe('getImageMapping', () => {
        it('should return correct mapping pairs', () => {
            const mat = [0b110n, 0b011n, 0b101n];
            const mapping = getImageMapping(mat, 3);
            expect(mapping.length).toBeGreaterThan(0);

            for (const { state, toggle } of mapping) {
                let res = 0n;
                for (let i = 0; i < 3; i++) {
                    if ((toggle >> BigInt(3 - 1 - i)) & 1n) {
                        res ^= mat[i]!;
                    }
                }
                expect(res).toBe(state);
            }
        });

        it('should handle singular matrices', () => {
            const mat = [0b100n, 0b100n, 0b001n];
            const mapping = getImageMapping(mat, 3);
            // Rank is 2, so mapping should have 2 entries
            expect(mapping).toHaveLength(2);
        });
    });
});

function countBits(n: bigint): number {
    let count = 0;
    let temp = n;
    while (temp > 0n) {
        temp &= temp - 1n;
        count++;
    }
    return count;
}
