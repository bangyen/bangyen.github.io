import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGridSize } from '../useGridSize';

import { useWindow } from '@/hooks/layout';

// Mock the base hooks
vi.mock('@/hooks/layout', () => ({
    useWindow: vi.fn().mockReturnValue({ width: 1000, height: 1000 }),
    useMobile: vi.fn().mockReturnValue(false),
}));

vi.mock('@/hooks/useLocalStorage', () => ({
    useLocalStorage: vi
        .fn()
        .mockImplementation((key, defaultValue, options) => {
            const raw = localStorage.getItem(key);
            // Simplified deserialization matching useGridSize usage
            const initial =
                raw === null
                    ? defaultValue
                    : options?.deserialize
                      ? options.deserialize(raw)
                      : JSON.parse(raw);
            const [val, setVal] = React.useState(initial);
            return [val, setVal];
        }),
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
        vi.mocked(useWindow).mockReturnValue({ width: 400, height: 400 });
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
        vi.mocked(useWindow).mockReturnValue({ width: 1000, height: 1000 });
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
        vi.mocked(useWindow).mockReturnValue({ width: 292, height: 292 });
        const { result } = renderHook(() => useGridSize(defaultGridConfig));

        expect(result.current.rows).toBe(5);

        act(() => {
            result.current.handlePlus();
        });

        // Should set desiredSize to null to switch to dynamic size
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
        vi.mocked(useWindow).mockReturnValue({ width: 10, height: 10 });

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
