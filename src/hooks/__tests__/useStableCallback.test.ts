import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useStableCallback } from '../useStableCallback';

describe('useStableCallback', () => {
    it('returns a function with stable identity across renders', () => {
        let cb = () => 1;
        const { result, rerender } = renderHook(() => useStableCallback(cb));

        const first = result.current;

        cb = () => 2;
        rerender();

        expect(result.current).toBe(first);
    });

    it('always delegates to the latest callback version', () => {
        let value = 'first';
        const { result, rerender } = renderHook(() =>
            useStableCallback(() => value),
        );

        expect(result.current()).toBe('first');

        value = 'second';
        rerender();

        expect(result.current()).toBe('second');
    });

    it('forwards all arguments to the underlying callback', () => {
        const spy = vi.fn((a: number, b: string) => `${String(a)}-${b}`);
        const { result } = renderHook(() => useStableCallback(spy));

        const returned = result.current(42, 'hello');

        expect(spy).toHaveBeenCalledWith(42, 'hello');
        expect(returned).toBe('42-hello');
    });

    it('returns the latest callback value even after many re-renders', () => {
        let counter = 0;
        const { result, rerender } = renderHook(() =>
            useStableCallback(() => counter),
        );

        for (let i = 1; i <= 10; i++) {
            counter = i;
            rerender();
        }

        expect(result.current()).toBe(10);
    });

    it('preserves identity when callback changes on every render', () => {
        const { result, rerender } = renderHook(
            ({ n }: { n: number }) => useStableCallback(() => n),
            { initialProps: { n: 0 } },
        );

        const ref = result.current;

        rerender({ n: 1 });
        rerender({ n: 2 });

        expect(result.current).toBe(ref);
        expect(result.current()).toBe(2);
    });
});
