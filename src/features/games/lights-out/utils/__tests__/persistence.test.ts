import { describe, test, expect } from 'vitest';

import { isBoardState } from '../persistence';

describe('isBoardState', () => {
    test('returns true for a valid BoardState', () => {
        const valid = {
            grid: [0, 3, 7],
            score: 5,
            rows: 3,
            cols: 3,
            initialized: true,
        };
        expect(isBoardState(valid)).toBe(true);
    });

    test('returns false for null', () => {
        expect(isBoardState(null)).toBe(false);
    });

    test('returns false for non-object', () => {
        expect(isBoardState('string')).toBe(false);
        expect(isBoardState(42)).toBe(false);
        expect(isBoardState(undefined)).toBe(false);
    });

    test('returns false when grid is not an array', () => {
        expect(
            isBoardState({
                grid: 'not-array',
                score: 0,
                rows: 3,
                cols: 3,
                initialized: true,
            }),
        ).toBe(false);
    });

    test('returns false when score is not a number', () => {
        expect(
            isBoardState({
                grid: [0],
                score: 'five',
                rows: 3,
                cols: 3,
                initialized: true,
            }),
        ).toBe(false);
    });

    test('returns false when initialized is not a boolean', () => {
        expect(
            isBoardState({
                grid: [0],
                score: 0,
                rows: 3,
                cols: 3,
                initialized: 1,
            }),
        ).toBe(false);
    });

    test('returns false when required fields are missing', () => {
        expect(isBoardState({ grid: [0] })).toBe(false);
        expect(isBoardState({})).toBe(false);
    });
});
