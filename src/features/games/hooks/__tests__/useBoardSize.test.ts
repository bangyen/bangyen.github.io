import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { calculateBoardSize } from '../boardSizeUtils';
import { useBoardSize } from '../useBoardSize';

vi.mock('../boardSizeUtils', () => ({
    calculateBoardSize: vi.fn().mockReturnValue(4.5),
}));

const mockCalculateBoardSize = calculateBoardSize as ReturnType<typeof vi.fn>;

describe('useBoardSize', () => {
    const baseParams = {
        rows: 5,
        cols: 5,
        width: 1024,
        height: 768,
        mobile: false,
        headerOffset: { mobile: 56, desktop: 64 },
        boardConfig: {
            boardPadding: 16,
            boardMaxWidth: 1200,
            boardSizeFactor: 0.9,
            maxCellSize: 100,
            remBase: 16,
        },
    };

    it('returns computed cell size from calculateBoardSize', () => {
        const { result } = renderHook(() => useBoardSize(baseParams));
        expect(result.current).toBe(4.5);
    });

    it('resolves function-based boardPadding', () => {
        const paddingFn = vi.fn().mockReturnValue({ x: 10, y: 20 });
        const params = {
            ...baseParams,
            boardConfig: {
                ...baseParams.boardConfig,
                boardPadding: paddingFn,
            },
        };

        renderHook(() => useBoardSize(params));
        expect(paddingFn).toHaveBeenCalledWith(false);
    });

    it('applies rowOffset and colOffset', () => {
        mockCalculateBoardSize.mockClear();

        const params = {
            ...baseParams,
            boardConfig: {
                ...baseParams.boardConfig,
                rowOffset: 1,
                colOffset: 2,
            },
        };

        renderHook(() => useBoardSize(params));

        expect(mockCalculateBoardSize).toHaveBeenCalledWith(
            expect.objectContaining({ rows: 6, cols: 7 }),
        );
    });
});
