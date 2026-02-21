// @vitest-environment node
import { describe, it, expect } from 'vitest';

import { getMatrix } from '../matrixOperations';

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
});
