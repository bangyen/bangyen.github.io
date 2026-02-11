import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGamePersistence } from '../useGamePersistence';

describe('useGamePersistence', () => {
    const defaultOptions = {
        storageKey: 'test-game',
        rows: 5,
        cols: 5,
        state: { board: [0, 1] },
        onRestore: vi.fn(),
    };

    const key = 'test-game-5x5';

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should restore state from localStorage on mount', () => {
        const savedState = { board: [1, 0] };
        localStorage.setItem(key, JSON.stringify(savedState));

        renderHook(() => {
            useGamePersistence(defaultOptions);
        });

        expect(defaultOptions.onRestore).toHaveBeenCalledWith(savedState);
    });

    it('should use custom deserialize if provided', () => {
        const savedData = { raw: 'data' };
        localStorage.setItem(key, JSON.stringify(savedData));
        const deserialize = vi.fn().mockReturnValue({ board: [1, 1] });

        renderHook(() => {
            useGamePersistence({
                ...defaultOptions,
                deserialize,
            });
        });

        expect(deserialize).toHaveBeenCalledWith(savedData);
        expect(defaultOptions.onRestore).toHaveBeenCalledWith({
            board: [1, 1],
        });
    });

    it('should clear localStorage and not restore if JSON is invalid', () => {
        localStorage.setItem(key, 'invalid-json');

        renderHook(() => {
            useGamePersistence(defaultOptions);
        });

        expect(defaultOptions.onRestore).not.toHaveBeenCalled();
        expect(localStorage.getItem(key)).toBeNull();
    });

    it('should save state to localStorage with debounce', () => {
        const { rerender } = renderHook(
            props => {
                useGamePersistence(props);
            },
            { initialProps: defaultOptions }
        );

        const newState = { board: [1, 1] };
        rerender({ ...defaultOptions, state: newState });

        // Should not be saved immediately
        expect(localStorage.getItem(key)).toBeNull();

        // Wait for debounce
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(JSON.parse(localStorage.getItem(key)!)).toEqual(newState);
    });

    it('should use custom serialize if provided', () => {
        const serialize = vi.fn().mockReturnValue('serialized-data');
        const state = { board: [1] };

        renderHook(() => {
            useGamePersistence({
                ...defaultOptions,
                state,
                serialize,
            });
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(serialize).toHaveBeenCalledWith(state);
        expect(JSON.parse(localStorage.getItem(key)!)).toBe('serialized-data');
    });

    it('should not save if disabled', () => {
        renderHook(() => {
            useGamePersistence({
                ...defaultOptions,
                enabled: false,
            });
        });

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(localStorage.getItem(key)).toBeNull();
    });
});
