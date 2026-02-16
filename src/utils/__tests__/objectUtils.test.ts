import { describe, it, expect } from 'vitest';

import { mergeDefaults } from '../objectUtils';

describe('mergeDefaults', () => {
    it('returns defaults when overrides is empty', () => {
        const defaults = { a: 1, b: 'hello' };
        expect(mergeDefaults(defaults, {})).toEqual({ a: 1, b: 'hello' });
    });

    it('applies defined overrides on top of defaults', () => {
        const defaults = { a: 1, b: 2, c: 3 };
        expect(mergeDefaults(defaults, { b: 20 })).toEqual({
            a: 1,
            b: 20,
            c: 3,
        });
    });

    it('drops undefined values so they do not clobber defaults', () => {
        const defaults = { a: 1, b: 2 };
        expect(mergeDefaults(defaults, { a: undefined, b: 20 })).toEqual({
            a: 1,
            b: 20,
        });
    });

    it('preserves explicit null overrides', () => {
        const defaults = { a: 1, b: 'x' as string | null };
        expect(mergeDefaults(defaults, { b: null })).toEqual({ a: 1, b: null });
    });

    it('preserves explicit falsy overrides (0, empty string, false)', () => {
        const defaults = { count: 10, label: 'default', active: true };
        expect(
            mergeDefaults(defaults, { count: 0, label: '', active: false }),
        ).toEqual({ count: 0, label: '', active: false });
    });
});
