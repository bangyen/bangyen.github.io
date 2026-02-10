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
            // Matrix:
            // 1 1 0
            // 1 1 0
            // 0 0 1
            const mat = [0b110n, 0b110n, 0b001n];
            const kernel = getKernelBasis(mat, 3);
            expect(kernel).toHaveLength(1);
            // Kernel should be [1, 1, 0] = 0b110 = 6n
            expect(kernel[0]).toBe(0b110n);
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

            // Verify: multiplySym(mat, solution) == target
            // Note: multiplySym treats the first argument as a list of rows.
            // For a vector x, M*x is computed by XORing rows where x[i] is 1.
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
            const target = 0b100n; // Can't toggle just the first light without the second
            const solution = getMinWeightSolution(mat, target, 3);
            expect(solution).toBe(-1n);
        });

        it('should find minimum weight solution in presence of kernel', () => {
            // Lights out 3x1 has a kernel [1, 0, 1] if we use a different operator?
            // Let's create a custom system where there are multiple solutions
            const mat = [
                0b100n, // row 0: affects light 0
                0b100n, // row 1: affects light 0 (redundant)
                0b001n, // row 2: affects light 2
            ];
            // Target: 0b101n (lights 0 and 2)
            // Solutions:
            // 0b101n (toggles 0 and 2) - weight 2
            // 0b011n (toggles 1 and 2) - weight 2
            // 0b111n (toggles 0, 1, 2) - weight 3
            const solution = getMinWeightSolution(mat, 0b101n, 3);
            expect(countBits(solution)).toBe(2);
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
