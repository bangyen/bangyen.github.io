// @vitest-environment happy-dom
import { render, screen, renderHook } from '@testing-library/react';
import React from 'react';

import {
    usePalette,
    useGetters,
    useHandler,
} from '../../lights-out/hooks/boardUtils';
import { Board } from '../Board';

import { COLORS } from '@/config/theme';

describe('Board Component', () => {
    const mockOverlayProps = vi.fn((r: number, c: number) => ({
        'data-testid': `front-${String(r)}-${String(c)}`,
        children: 'Front',
    }));
    const mockCellProps = vi.fn((r: number, c: number) => ({
        'data-testid': `back-${String(r)}-${String(c)}`,
        children: 'Back',
    }));

    test('renders overlay and cell grids correctly', () => {
        render(
            <Board
                size={20}
                layers={[
                    { rows: 1, cols: 1, cellProps: mockCellProps },
                    { rows: 2, cols: 2, cellProps: mockOverlayProps },
                ]}
            />,
        );

        // Check overlay grid items (2x2)
        expect(screen.getByTestId('front-0-0')).toBeInTheDocument();
        expect(screen.getByTestId('front-0-1')).toBeInTheDocument();
        expect(screen.getByTestId('front-1-0')).toBeInTheDocument();
        expect(screen.getByTestId('front-1-1')).toBeInTheDocument();

        // Check cell grid items (cellRows x cellCols = 1x1)
        expect(screen.getByTestId('back-0-0')).toBeInTheDocument();
    });

    test('renders with correct layout styles', () => {
        render(
            <Board
                size={20}
                layers={[
                    { rows: 2, cols: 2, cellProps: mockCellProps },
                    { rows: 2, cols: 2, cellProps: mockOverlayProps },
                ]}
            />,
        );

        const outerBox = screen.getByTestId('board-container');
        expect(outerBox).toHaveStyle({
            display: 'grid',
            placeItems: 'center',
        });
    });

    test('handles decorative layers via explicit boolean props', () => {
        const { container } = render(
            <Board
                size={20}
                layers={[
                    {
                        rows: 2,
                        cols: 2,
                        cellProps: mockCellProps,
                        decorative: true,
                    },
                    {
                        rows: 2,
                        cols: 2,
                        cellProps: mockOverlayProps,
                        decorative: true,
                    },
                ]}
            />,
        );

        const decorative = container.querySelectorAll('[aria-hidden="true"]');
        expect(decorative).toHaveLength(2);
    });
});

describe('usePalette', () => {
    test('returns primary and secondary colors based on theme', () => {
        const { result } = renderHook(() => usePalette(0));

        expect(result.current).toEqual({
            primary: COLORS.primary.main,
            secondary: COLORS.primary.dark,
        });
    });
});

describe('useGetters', () => {
    const mockPalette = {
        primary: 'blue',
        secondary: 'red',
    };

    test('getColor returns correct front/back colors based on tile value', () => {
        const getTile = vi.fn((r, c) => (r === 0 && c === 0 ? 1 : 0));
        const { result } = renderHook(() => useGetters(getTile, mockPalette));

        // Tile with value 1
        expect(result.current.getColor(0, 0)).toEqual({
            front: 'blue',
            back: 'red',
            isLit: true,
        });

        // Tile with value 0
        expect(result.current.getColor(0, 1)).toEqual({
            front: 'red',
            back: 'blue',
            isLit: false,
        });
    });

    // Test borderHandler logic via getBorder
    test('getBorder calculates border radius correctly', () => {
        // Setup a 2x2 grid where (0,0) matches neighbors to affect borders
        const getTile = vi.fn(() => 1); // All tiles are same
        const { result } = renderHook(() => useGetters(getTile, mockPalette));

        const borderProps = result.current.getBorder(1, 1);

        // Since all neighbors match, corners should be flattened (radius 0)
        expect(borderProps).toHaveProperty('borderTopLeftRadius', 0);
        expect(borderProps).toHaveProperty('borderTopRightRadius', 0);
        expect(borderProps).toHaveProperty('borderBottomLeftRadius', 0);
        expect(borderProps).toHaveProperty('borderBottomRightRadius', 0);
    });

    test('getBorder handles boundaries correctly', () => {
        // Setup a grid where neighbors are different
        const getTile = vi.fn((r, c) => (r === 1 && c === 1 ? 1 : 0));
        const { result } = renderHook(() => useGetters(getTile, mockPalette));

        const borderProps = result.current.getBorder(1, 1);

        // No neighbors match, so no border radius overrides
        expect(borderProps).not.toHaveProperty('borderTopLeftRadius');
    });

    // Test fillerHandler logic via getFiller
    test('getFiller determines filler color correctly', () => {
        // Case 1: All corners match or sufficient logic for color=true
        // Logic: if ((!topLeft || !botRight) && total < 3) color = false;

        // Let's test specific conditions

        // All 1s -> total = 4. Condition false. color = true.
        const getTileAllOnes = vi.fn(() => 1);
        const { result: res1 } = renderHook(() =>
            useGetters(getTileAllOnes, mockPalette),
        );
        expect(res1.current.getFiller(0, 0)).toBe('blue');

        // topLeft=0, others=0 -> total=0. (!0 || !0) is true. total < 3 is true. color = false.
        const getTileAllZeros = vi.fn(() => 0);
        const { result: res2 } = renderHook(() =>
            useGetters(getTileAllZeros, mockPalette),
        );
        expect(res2.current.getFiller(0, 0)).toBe('red');
    });
});

describe('useHandler', () => {
    const mockPalette = {
        primary: 'blue',
        secondary: 'red',
    };

    test('getTile returns correct values from grid state', () => {
        const state = {
            grid: [1, 2], // Row 0: bit 0 (1), Row 1: bit 1 (2)
            rows: 2,
            cols: 2,
        };

        const { result } = renderHook(() => useHandler(state, mockPalette));

        expect(result.current.getColor(0, 0).front).toBe('blue'); // 1
        expect(result.current.getColor(0, 1).front).toBe('red'); // 0
    });

    test('getTile returns -1 for out of bounds', () => {
        const state = {
            grid: [1],
            rows: 1,
            cols: 1,
        };

        const { result } = renderHook(() => useHandler(state, mockPalette));

        expect(result.current.getColor(-1, 0).front).toBe('blue');
    });
});
