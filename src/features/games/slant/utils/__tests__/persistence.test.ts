import { describe, test, expect, vi, beforeEach } from 'vitest';

import type { SlantState } from '../../types';
import {
    serializeSlantState,
    isSavedSlantState,
    deserializeSlantState,
    persistSlantState,
    hasSavedUnsolvedPuzzle,
} from '../persistence';

import { createGridSize } from '@/features/games/types';

function makeMockState(overrides: Partial<SlantState> = {}): SlantState {
    return {
        grid: [[0]],
        numbers: [[1]],
        solution: [[0]],
        rows: createGridSize(3),
        cols: createGridSize(3),
        solved: false,
        errorNodes: new Set(['0,0']),
        cycleCells: new Set(['1,1']),
        satisfiedNodes: new Set(['2,2']),
        ...overrides,
    } as SlantState;
}

describe('serializeSlantState', () => {
    test('converts Sets to arrays', () => {
        const state = makeMockState();
        const result = serializeSlantState(state);

        expect(Array.isArray(result.errorNodes)).toBe(true);
        expect(Array.isArray(result.cycleCells)).toBe(true);
        expect(Array.isArray(result.satisfiedNodes)).toBe(true);
        expect(result.errorNodes).toEqual(['0,0']);
        expect(result.cycleCells).toEqual(['1,1']);
        expect(result.satisfiedNodes).toEqual(['2,2']);
    });

    test('preserves other state fields', () => {
        const state = makeMockState({
            rows: createGridSize(5),
            cols: createGridSize(7),
            solved: true,
        });
        const result = serializeSlantState(state);

        expect(result.rows).toBe(5);
        expect(result.cols).toBe(7);
        expect(result.solved).toBe(true);
    });
});

describe('isSavedSlantState', () => {
    test('returns true for valid saved state', () => {
        const valid = {
            grid: [[0]],
            numbers: [[1]],
            solution: [[0]],
            rows: 3,
            cols: 3,
            solved: false,
            errorNodes: ['0,0'],
            cycleCells: [],
            satisfiedNodes: [],
        };
        expect(isSavedSlantState(valid)).toBe(true);
    });

    test('returns false for null', () => {
        expect(isSavedSlantState(null)).toBe(false);
    });

    test('returns false for non-object', () => {
        expect(isSavedSlantState('string')).toBe(false);
        expect(isSavedSlantState(42)).toBe(false);
    });

    test('returns false when required fields are missing', () => {
        expect(isSavedSlantState({ grid: [] })).toBe(false);
        expect(isSavedSlantState({ grid: [], numbers: [] })).toBe(false);
    });

    test('returns false when field types are wrong', () => {
        const invalid = {
            grid: 'not-array',
            numbers: [[1]],
            solution: [[0]],
            rows: 3,
            cols: 3,
            solved: false,
            errorNodes: [],
            cycleCells: [],
            satisfiedNodes: [],
        };
        expect(isSavedSlantState(invalid)).toBe(false);
    });

    test('returns false when solved is not boolean', () => {
        const invalid = {
            grid: [[0]],
            numbers: [[1]],
            solution: [[0]],
            rows: 3,
            cols: 3,
            solved: 'yes',
            errorNodes: [],
            cycleCells: [],
            satisfiedNodes: [],
        };
        expect(isSavedSlantState(invalid)).toBe(false);
    });
});

describe('deserializeSlantState', () => {
    test('converts arrays back to Sets', () => {
        const saved = {
            grid: [[0]],
            numbers: [[1]],
            solution: [[0]],
            rows: 3,
            cols: 3,
            solved: false,
            errorNodes: ['0,0', '1,1'],
            cycleCells: ['2,2'],
            satisfiedNodes: [],
        };
        const result = deserializeSlantState(saved as never);

        expect(result.errorNodes).toBeInstanceOf(Set);
        expect(result.errorNodes).toEqual(new Set(['0,0', '1,1']));
        expect(result.cycleCells).toEqual(new Set(['2,2']));
        expect(result.satisfiedNodes).toEqual(new Set());
    });
});

describe('persistSlantState', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('stores serialized state under the correct key', () => {
        const state = makeMockState({
            rows: createGridSize(4),
            cols: createGridSize(5),
        });
        persistSlantState(state, 4, 5);

        const stored = localStorage.getItem('slant-state-4x5');
        expect(stored).not.toBeNull();

        const parsed: unknown = JSON.parse(stored!);
        expect(parsed).toEqual(expect.objectContaining({ rows: 4, cols: 5 }));
    });

    test('silently ignores storage errors', () => {
        const spy = vi.spyOn(Storage.prototype, 'setItem');
        spy.mockImplementation(() => {
            throw new DOMException('QuotaExceededError');
        });

        expect(() => {
            persistSlantState(makeMockState(), 3, 3);
        }).not.toThrow();

        spy.mockRestore();
    });
});

describe('hasSavedUnsolvedPuzzle', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('returns false when nothing is saved', () => {
        expect(hasSavedUnsolvedPuzzle(3, 3)).toBe(false);
    });

    test('returns true when an unsolved puzzle is saved', () => {
        localStorage.setItem(
            'slant-state-3x3',
            JSON.stringify({ solved: false }),
        );
        expect(hasSavedUnsolvedPuzzle(3, 3)).toBe(true);
    });

    test('returns false when the saved puzzle is solved', () => {
        localStorage.setItem(
            'slant-state-3x3',
            JSON.stringify({ solved: true }),
        );
        expect(hasSavedUnsolvedPuzzle(3, 3)).toBe(false);
    });

    test('returns false for invalid JSON', () => {
        localStorage.setItem('slant-state-3x3', 'not-json');
        expect(hasSavedUnsolvedPuzzle(3, 3)).toBe(false);
    });

    test('returns false for non-object JSON', () => {
        localStorage.setItem('slant-state-3x3', '"string"');
        expect(hasSavedUnsolvedPuzzle(3, 3)).toBe(false);
    });
});
