import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useDebouncedEffect } from '../useDebouncedEffect';

describe('useDebouncedEffect', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('fires the callback after the specified delay', () => {
        const callback = vi.fn();

        renderHook(() => {
            useDebouncedEffect(callback, 200, [1]);
        });

        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(200);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('does not fire before the delay elapses', () => {
        const callback = vi.fn();

        renderHook(() => {
            useDebouncedEffect(callback, 300, [1]);
        });

        vi.advanceTimersByTime(299);

        expect(callback).not.toHaveBeenCalled();
    });

    it('resets the timer when dependencies change', () => {
        const callback = vi.fn();
        let dep = 1;

        const { rerender } = renderHook(() => {
            useDebouncedEffect(callback, 200, [dep]);
        });

        vi.advanceTimersByTime(150);
        expect(callback).not.toHaveBeenCalled();

        dep = 2;
        rerender();

        vi.advanceTimersByTime(150);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(50);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('cleans up the timer on unmount', () => {
        const callback = vi.fn();

        const { unmount } = renderHook(() => {
            useDebouncedEffect(callback, 200, [1]);
        });

        unmount();
        vi.advanceTimersByTime(300);

        expect(callback).not.toHaveBeenCalled();
    });

    it('respects different delay values', () => {
        const fast = vi.fn();
        const slow = vi.fn();

        renderHook(() => {
            useDebouncedEffect(fast, 50, ['a']);
        });
        renderHook(() => {
            useDebouncedEffect(slow, 500, ['b']);
        });

        vi.advanceTimersByTime(50);
        expect(fast).toHaveBeenCalledTimes(1);
        expect(slow).not.toHaveBeenCalled();

        vi.advanceTimersByTime(450);
        expect(slow).toHaveBeenCalledTimes(1);
    });
});
