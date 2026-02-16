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
vi.mock('../useBoardSize', () => ({
    useBoardSize: vi.fn().mockReturnValue(3),
}));
vi.mock('../../../utils/gameUtils', () => ({
    createGameReducer: vi.fn().mockReturnValue((state: any) => state),
    getPosKey: vi.fn(),
}));

describe('useBaseGame', () => {
    const defaultProps: any = {
        storageKey: 'test-game',
        grid: {
            headerOffset: { mobile: 50, desktop: 100 },
        },
        board: {
            boardPadding: 20,
        },
        logic: {
            getInitialState: vi.fn().mockReturnValue({ some: 'initial-state' }),
            reducer: vi.fn(state => state),
            isSolved: vi.fn().mockReturnValue(false),
        },
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

        expect(result.current.size).toBeDefined();
    });
});
