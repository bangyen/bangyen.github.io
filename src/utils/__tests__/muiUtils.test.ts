// @vitest-environment node
import { describe, it, expect } from 'vitest';

import { toSxArray } from '../muiUtils';

describe('muiUtils', () => {
    describe('toSxArray', () => {
        it('should return empty array for undefined', () => {
            expect(toSxArray(undefined)).toEqual([]);
        });

        it('should wrap object in array', () => {
            const sx = { color: 'red' };
            expect(toSxArray(sx)).toEqual([sx]);
        });

        it('should return the same array if already an array', () => {
            const sx = [{ color: 'red' }, { margin: 1 }];
            expect(toSxArray(sx)).toEqual(sx);
        });
    });
});
