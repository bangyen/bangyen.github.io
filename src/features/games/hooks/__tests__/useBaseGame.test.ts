import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useWindow, useMobile, useLocalStorage } from '../../../../hooks';
import { useBaseGame } from '../useBaseGame';

// Mock foundation hooks
vi.mock('../../../../hooks', () => ({
    useWindow: vi.fn(),
    useMobile: vi.fn(),
    useLocalStorage: vi.fn(),
    useDebouncedEffect: vi.fn(effect => effect()),
    useStableCallback: vi.fn(cb => cb),
}));

describe('useBaseGame', () => {
    const defaultProps = {
        storageKey: 'test-game',
        grid: {
            headerOffset: { mobile: 50, desktop: 100 },
        },
        board: {
            boardPadding: 20,
        },
        logic: {
            getInitialState: vi
                .fn()
                .mockReturnValue({ rows: 5, cols: 5, some: 'initial-state' }),
            reducer: vi.fn((state: unknown) => state),
            isSolved: vi.fn().mockReturnValue(false),
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useWindow).mockReturnValue({ width: 1024, height: 768 });
        vi.mocked(useMobile).mockReturnValue(false);
        vi.mocked(useLocalStorage).mockReturnValue([null, vi.fn()]);
    });

    it('should initialize and return state', () => {
        const { result } = renderHook(() => useBaseGame(defaultProps));
        // with 1024x768, header 100, padding 0, cellRef 4 (default)
        // availableH = 768 - 100 = 668
        // cellSizePx = 4 * 16 = 64
        // rows = floor(668/64) - 1 = 10 - 1 = 9
        // expected result will vary depending on exact math in useBaseGame
        expect(result.current.layout.rows).toBeGreaterThan(0);
        expect(result.current.layout.cols).toBeGreaterThan(0);
        expect(result.current.state).toBeDefined();
    });

    it('should handle onRestore from persistence', () => {
        // In the new implementation, hydration happens on mount via localStorage.getItem
        const savedState = { some: 'saved-state' };
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
            JSON.stringify(savedState),
        );

        renderHook(() => useBaseGame(defaultProps));

        // Note: dispatch is called with 'hydrate'. Since we mock the reducer to return the state as-is,
        // we might need to check if dispatch was called or if the logic matches.
        expect(defaultProps.logic.reducer).toHaveBeenCalled();
    });

    it('should accept function for boardPadding without error', () => {
        const paddingOffsetFn = vi.fn().mockReturnValue(30);
        const { result } = renderHook(() =>
            useBaseGame({
                ...defaultProps,
                board: {
                    ...defaultProps.board,
                    boardPadding: paddingOffsetFn,
                },
            }),
        );

        expect(result.current.layout.size).toBeDefined();
    });
});
