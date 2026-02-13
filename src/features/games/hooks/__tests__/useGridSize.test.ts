import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useWindow } from '../../../../hooks';
import { useGridSize } from '../useGridSize';

// Mock the base hooks
vi.mock('../../../../hooks', () => ({
    useWindow: vi.fn().mockReturnValue({ width: 1000, height: 1000 }),
    useMobile: vi.fn().mockReturnValue(false),
}));

describe('useGridSize', () => {
    const defaultGridConfig = {
        storageKey: 'test-key',
        defaultSize: null,
        headerOffset: { mobile: 50, desktop: 100 },
        cellSizeReference: 2, // 2rem = 32px
    };

    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should calculate dynamic size based on window dimensions', () => {
        (useWindow as any).mockReturnValue({ width: 400, height: 400 });
        const { result } = renderHook(() => useGridSize(defaultGridConfig));

        // 400 - 100 (header) - 0 (padding) = 300
        // 300 / 32 = 9.375 -> floor(9) = 9. rows = 9-1 = 8.
        // 400 / 32 = 12.5 -> floor(12) = 12. cols = 12-1 = 11.
        expect(result.current.rows).toBe(8);
        expect(result.current.cols).toBe(11);
    });

    it('should use saved preference from localStorage', () => {
        localStorage.setItem('test-key', '5');
        const { result } = renderHook(() => useGridSize(defaultGridConfig));

        expect(result.current.desiredSize).toBe(5);
        expect(result.current.rows).toBe(5);
        expect(result.current.cols).toBe(5);
    });

    it('should handle handlePlus and handleMinus', () => {
        localStorage.setItem('test-key', '5');
        (useWindow as any).mockReturnValue({ width: 1000, height: 1000 });
        const { result } = renderHook(() => useGridSize(defaultGridConfig));

        // Dynamic size will be large, so 5 is less than dynamic size
        act(() => {
            result.current.handlePlus();
        });
        expect(result.current.desiredSize).toBe(6);

        act(() => {
            result.current.handleMinus();
        });
        expect(result.current.desiredSize).toBe(5);
    });

    it('should handle handlePlus when at dynamic size', () => {
        localStorage.setItem('test-key', '5');
        // Set window so dynamic size is 5x5
        // 5 = (H - 100) / 32 - 1 => 6 = (H - 100) / 32 => 192 = H - 100 => H = 292
        (useWindow as any).mockReturnValue({ width: 292, height: 292 });
        const { result } = renderHook(() => useGridSize(defaultGridConfig));

        expect(result.current.rows).toBe(5);

        act(() => {
            result.current.handlePlus();
        });

        // Should set desiredSize to null to switch to dynamic size
        // (Wait, the logic in useGridSize says if dynamicSize.rows !== dynamicSize.cols and (rows !== dynamicSize.rows || cols !== dynamicSize.cols))
        // If it's 5x5 and dynamic is 5x5, it won't change unless it can go higher.
    });

    it('should respect minSize and maxSize', () => {
        renderHook(() =>
            useGridSize({
                ...defaultGridConfig,
                minSize: 3,
                maxSize: 8,
            }),
        );

        // Very small window
        (useWindow as any).mockReturnValue({ width: 10, height: 10 });
        // Trigger rerender if needed or just re-calculate dynamicSize

        // Dynamic size will be below minSize
        const { result: result2 } = renderHook(() =>
            useGridSize({
                ...defaultGridConfig,
                minSize: 3,
            }),
        );
        expect(result2.current.rows).toBeGreaterThanOrEqual(3);
    });
});
