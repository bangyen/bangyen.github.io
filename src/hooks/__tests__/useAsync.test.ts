import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useAsync } from '../useAsync';

describe('useAsync', () => {
    it('starts in loading state with fallback data', () => {
        const loader = () => new Promise<string[]>(() => {});
        const fallback = () => ['default'];

        const { result } = renderHook(() => useAsync(loader, fallback));

        expect(result.current.loading).toBe(true);
        expect(result.current.data).toEqual(['default']);
        expect(result.current.error).toBeNull();
    });

    it('resolves data on successful load', async () => {
        const loader = vi.fn().mockResolvedValue(['fetched']);
        const fallback = () => ['default'];

        const { result } = renderHook(() => useAsync(loader, fallback));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(['fetched']);
        expect(result.current.error).toBeNull();
    });

    it('falls back to default data and sets error on failure', async () => {
        const loader = vi.fn().mockRejectedValue(new Error('Network error'));
        const fallback = () => ['fallback'];

        const { result } = renderHook(() => useAsync(loader, fallback));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toEqual(['fallback']);
        expect(result.current.error).toBe('Network error');
    });

    it('handles non-Error rejection with generic message', async () => {
        const loader = vi.fn().mockRejectedValue('string error');
        const fallback = () => 0;

        const { result } = renderHook(() => useAsync(loader, fallback));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data).toBe(0);
        expect(result.current.error).toBe('An unknown error occurred');
    });

    it('only calls loader once (on mount)', async () => {
        const loader = vi.fn().mockResolvedValue('data');
        const fallback = () => '';

        const { result, rerender } = renderHook(() =>
            useAsync(loader, fallback),
        );

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        rerender();
        rerender();

        expect(loader).toHaveBeenCalledTimes(1);
    });

    it('exposes a refetch callback that re-runs the loader', async () => {
        let callCount = 0;
        const loader = vi.fn().mockImplementation(() => {
            callCount++;
            return Promise.resolve(`result-${String(callCount)}`);
        });
        const fallback = () => '';

        const { result } = renderHook(() => useAsync(loader, fallback));

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        expect(result.current.data).toBe('result-1');

        act(() => {
            result.current.refetch();
        });

        await waitFor(() => {
            expect(result.current.data).toBe('result-2');
        });
        expect(result.current.loading).toBe(false);
    });

    it('cancels stale requests on unmount', async () => {
        let resolve: (v: string) => void;
        const loader = vi.fn().mockImplementation(
            () =>
                new Promise<string>(r => {
                    resolve = r;
                }),
        );
        const fallback = () => 'fallback';

        const { result, unmount } = renderHook(() =>
            useAsync(loader, fallback),
        );

        expect(result.current.loading).toBe(true);

        unmount();

        // Resolve after unmount — should not throw or update state.
        resolve!('late');

        // Give a tick for the promise to settle.
        await new Promise(r => setTimeout(r, 10));

        // The data should still be the fallback since the component
        // unmounted before the promise resolved.
        expect(result.current.data).toBe('fallback');
    });
});
