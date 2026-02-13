import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useBaseGame } from '../useBaseGame';
import { useGamePersistence } from '../useGamePersistence';
import { useGridSize } from '../useGridSize';

// Mock other hooks
vi.mock('../useGridSize', () => ({
    useGridSize: vi.fn(),
}));
vi.mock('../useGamePersistence', () => ({
    useGamePersistence: vi.fn(),
}));
vi.mock('../useWinTransition', () => ({
    useWinTransition: vi.fn(),
}));
vi.mock('../usePageTitle', () => ({
    usePageTitle: vi.fn(),
}));
vi.mock('../useResponsiveBoardSize', () => ({
    useResponsiveBoardSize: vi
        .fn()
        .mockReturnValue({ width: 500, height: 500 }),
}));
vi.mock('../../../utils/gameUtils', () => ({
    createGameReducer: vi.fn().mockReturnValue((state: any) => state),
    getPosKey: vi.fn(),
}));

describe('useBaseGame', () => {
    const defaultProps: any = {
        gridConfig: {
            storageKey: 'grid-key',
            headerOffset: { mobile: 50, desktop: 100 },
        },
        storageKeys: { state: 'state-key' },
        initialState: { some: 'state' },
        getInitialState: vi.fn().mockReturnValue({ some: 'initial-state' }),
        reducer: vi.fn(state => state),
        isSolved: vi.fn().mockReturnValue(false),
        boardConfig: {
            paddingOffset: 20,
        },
        pageTitle: 'Test Game',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useGridSize as any).mockReturnValue({
            rows: 5,
            cols: 5,
            mobile: false,
        });
    });

    it('should initialize and return state', () => {
        const { result } = renderHook(() => useBaseGame(defaultProps));
        expect(result.current.rows).toBe(5);
        expect(result.current.cols).toBe(5);
        expect(result.current.state).toBeDefined();
    });

    it('should handle onRestore from persistence', () => {
        let onRestoreCallback: any;
        (useGamePersistence as any).mockImplementation((options: any) => {
            onRestoreCallback = options.onRestore;
        });

        renderHook(() => useBaseGame(defaultProps));

        const savedState = { some: 'saved-state' };
        act(() => {
            onRestoreCallback(savedState);
        });

        // After restoring, state should be update (if the mocked reducer/dispatch allows)
        // Since we are mocking the reducer to return whatever, we expect dispatch to have been called.
    });

    it('should use function for paddingOffset if provided', () => {
        const paddingOffsetFn = vi.fn().mockReturnValue(30);
        renderHook(() =>
            useBaseGame({
                ...defaultProps,
                boardConfig: {
                    ...defaultProps.boardConfig,
                    paddingOffset: paddingOffsetFn,
                },
            }),
        );

        expect(paddingOffsetFn).toHaveBeenCalled();
    });
});
