import { renderHook, waitFor } from '@testing-library/react';
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
});
