import React from 'react';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { Board, usePalette, useGetters, useHandler } from '../Board';
import { COLORS } from '../../../../config/theme';

describe('Board Component', () => {
    const mockFrontProps = jest.fn((r: number, c: number) => ({
        'data-testid': `front-${String(r)}-${String(c)}`,
        children: 'Front',
    }));
    const mockBackProps = jest.fn((r: number, c: number) => ({
        'data-testid': `back-${String(r)}-${String(c)}`,
        children: 'Back',
    }));

    test('renders front and back grids correctly', () => {
        render(
            <Board
                frontProps={mockFrontProps}
                backProps={mockBackProps}
                size={20}
                rows={2}
                cols={2}
            />
        );

        // Check front grid items (2x2)
        expect(screen.getByTestId('front-0-0')).toBeInTheDocument();
        expect(screen.getByTestId('front-0-1')).toBeInTheDocument();
        expect(screen.getByTestId('front-1-0')).toBeInTheDocument();
        expect(screen.getByTestId('front-1-1')).toBeInTheDocument();

        // Check back grid items (rows-1 x cols-1, so 1x1)
        expect(screen.getByTestId('back-0-0')).toBeInTheDocument();
    });

    test('renders with correct layout styles', () => {
        const { container } = render(
            <Board
                frontProps={mockFrontProps}
                backProps={mockBackProps}
                size={20}
                rows={2}
                cols={2}
            />
        );

        const outerBox = container.firstChild as HTMLElement;
        expect(outerBox).toHaveStyle('display: grid');
        expect(outerBox).toHaveStyle('place-items: center');
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
        const getTile = jest.fn((r, c) => (r === 0 && c === 0 ? 1 : 0));
        const { result } = renderHook(() => useGetters(getTile, mockPalette));

        // Tile with value 1
        expect(result.current.getColor(0, 0)).toEqual({
            front: 'blue',
            back: 'red',
        });

        // Tile with value 0
        expect(result.current.getColor(0, 1)).toEqual({
            front: 'red',
            back: 'blue',
        });
    });

    // Test borderHandler logic via getBorder
    test('getBorder calculates border radius correctly', () => {
        // Setup a 2x2 grid where (0,0) matches neighbors to affect borders
        const getTile = jest.fn(() => 1); // All tiles are same
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
        const getTile = jest.fn((r, c) => (r === 1 && c === 1 ? 1 : 0));
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
        const getTileAllOnes = jest.fn(() => 1);
        const { result: res1 } = renderHook(() =>
            useGetters(getTileAllOnes, mockPalette)
        );
        expect(res1.current.getFiller(0, 0)).toBe('blue');

        // topLeft=0, others=0 -> total=0. (!0 || !0) is true. total < 3 is true. color = false.
        const getTileAllZeros = jest.fn(() => 0);
        const { result: res2 } = renderHook(() =>
            useGetters(getTileAllZeros, mockPalette)
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
            grid: [
                [1, 0],
                [0, 1],
            ],
            rows: 2,
            cols: 2,
        };

        const { result } = renderHook(() => useHandler(state, mockPalette));

        // Access getTile internally via the exported getters wrappers if possible,
        // or re-verify via getColor which uses getTile

        expect(result.current.getColor(0, 0).front).toBe('blue'); // 1
        expect(result.current.getColor(0, 1).front).toBe('red'); // 0
    });

    test('getTile returns -1 for out of bounds', () => {
        const state = {
            grid: [[1]],
            rows: 1,
            cols: 1,
        };

        const { result } = renderHook(() => useHandler(state, mockPalette));

        // -1 should map to truthy logic in getColor?
        // In useGetters: val ? primary : secondary. -1 is truthy in JS.
        expect(result.current.getColor(-1, 0).front).toBe('blue');
    });
});
