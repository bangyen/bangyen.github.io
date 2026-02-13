import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { useWinTransition } from '../useWinTransition';

describe('useWinTransition', () => {
    it('should not trigger callback if not solved', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();
        renderHook(() => {
            useWinTransition(false, onComplete, 1000);
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(onComplete).not.toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('should trigger callback after delay when solved', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();
        renderHook(() => {
            useWinTransition(true, onComplete, 1000);
        });

        // Before delay
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(onComplete).not.toHaveBeenCalled();

        // After delay
        act(() => {
            vi.advanceTimersByTime(500);
        });
        expect(onComplete).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('should clear timeout on unmount', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();
        const { unmount } = renderHook(() => {
            useWinTransition(true, onComplete, 1000);
        });

        unmount();

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(onComplete).not.toHaveBeenCalled();
        vi.useRealTimers();
    });

    it('should clear timeout if solved becomes false before delay', () => {
        vi.useFakeTimers();
        const onComplete = vi.fn();
        const { rerender } = renderHook(
            ({ solved }) => {
                useWinTransition(solved, onComplete, 1000);
            },
            {
                initialProps: { solved: true },
            },
        );

        act(() => {
            vi.advanceTimersByTime(500);
        });

        rerender({ solved: false });

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(onComplete).not.toHaveBeenCalled();
        vi.useRealTimers();
    });
});
