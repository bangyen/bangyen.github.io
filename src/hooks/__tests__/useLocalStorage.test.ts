import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns the default value when nothing is stored', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 42));

        expect(result.current[0]).toBe(42);
    });

    it('returns the stored value when one exists', () => {
        localStorage.setItem('test-key', JSON.stringify('saved'));

        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'default'),
        );

        expect(result.current[0]).toBe('saved');
    });

    it('persists value changes to localStorage', () => {
        const { result } = renderHook(() =>
            useLocalStorage('test-key', 'initial'),
        );

        act(() => {
            result.current[1]('updated');
        });

        expect(result.current[0]).toBe('updated');
        expect(localStorage.getItem('test-key')).toBe(
            JSON.stringify('updated'),
        );
    });

    it('supports functional updates', () => {
        const { result } = renderHook(() => useLocalStorage('counter', 0));

        act(() => {
            result.current[1](prev => prev + 1);
        });

        expect(result.current[0]).toBe(1);
    });

    it('falls back to default when stored JSON is corrupt', () => {
        localStorage.setItem('bad-key', '{not valid json');

        const { result } = renderHook(() =>
            useLocalStorage('bad-key', 'fallback'),
        );

        expect(result.current[0]).toBe('fallback');
    });

    it('accepts a custom serializer', () => {
        const { result } = renderHook(() =>
            useLocalStorage('custom', [1, 2, 3], {
                serialize: (v: number[]) => v.join(','),
            }),
        );

        act(() => {
            result.current[1]([4, 5]);
        });

        expect(localStorage.getItem('custom')).toBe('4,5');
    });

    it('accepts a custom deserializer', () => {
        localStorage.setItem('custom', '10,20,30');

        const { result } = renderHook(() =>
            useLocalStorage<number[]>('custom', [], {
                deserialize: (raw: string) => raw.split(',').map(Number),
            }),
        );

        expect(result.current[0]).toEqual([10, 20, 30]);
    });

    it('falls back to default when deserializer returns undefined', () => {
        localStorage.setItem('guard', '"bad"');

        const { result } = renderHook(() =>
            useLocalStorage<number>('guard', 99, {
                deserialize: () => undefined,
            }),
        );

        expect(result.current[0]).toBe(99);
    });

    it('silently ignores storage errors on write', () => {
        const spy = vi
            .spyOn(Storage.prototype, 'setItem')
            .mockImplementation(() => {
                throw new Error('QuotaExceeded');
            });

        const { result } = renderHook(() => useLocalStorage('fail', 'value'));

        act(() => {
            result.current[1]('new');
        });

        expect(result.current[0]).toBe('new');
        spy.mockRestore();
    });

    it('returns a stable setter reference across renders', () => {
        const { result, rerender } = renderHook(() =>
            useLocalStorage('stable', 0),
        );

        const firstSetter = result.current[1];
        rerender();

        expect(result.current[1]).toBe(firstSetter);
    });
});
