import { renderHook } from '@testing-library/react';
import { getInput, getOutput, useHandler } from '../calculator';
import { useGetters } from '../../components/Board';

// Mock useGetters from Board component
jest.mock('../../components/Board', () => ({
    useGetters: jest.fn(
        (
            _getTile: (r: number, c: number) => number,
            palette: { primary: string; secondary: string }
        ) => ({
            getColor: (_r: number, _c: number) => ({
                front: palette.primary,
                back: palette.secondary,
            }),
            getBorder: (_r: number, _c: number) => ({
                border: '1px solid black',
            }),
        })
    ),
}));

describe('Lights Out Calculator UI Helpers', () => {
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const mockGetters = {
        getColor: jest.fn(() => ({ front: 'red', back: 'blue' })),
        getBorder: jest.fn(() => ({ border: '1px solid' })),
        getFiller: jest.fn(() => 'red'),
    };

    describe('getInput', () => {
        it('returns correct props for a tile', () => {
            const toggleTile = jest.fn();
            const isDragging = false;
            const setIsDragging = jest.fn();
            const draggedCols = { current: new Set<number>() };
            const addDraggedCol = jest.fn();
            const lastTouchTime = { current: 0 };
            const getProps = getInput(
                mockGetters,
                toggleTile,
                isDragging,
                setIsDragging,
                draggedCols,
                addDraggedCol,
                lastTouchTime
            );
            const props = getProps(0, 0);

            expect(props.backgroundColor).toBe('red');
            expect(props.style).toEqual({ border: '1px solid' });
            expect(props.color).toBe('red');
            expect(props.sx).toBeDefined();

            // Verify onClick handler creation (via onMouseDown)
            props.onMouseDown({ button: 0 } as React.MouseEvent);
            expect(toggleTile).toHaveBeenCalledWith(0);
        });

        it('calls getters with correct coordinates', () => {
            const getProps = getInput(
                mockGetters,
                jest.fn(),
                false,
                jest.fn(),
                { current: new Set() },
                jest.fn(),
                { current: 0 }
            );
            getProps(1, 2);
            expect(mockGetters.getColor).toHaveBeenCalledWith(1, 2);
            expect(mockGetters.getBorder).toHaveBeenCalledWith(1, 2);
        });
    });

    describe('getOutput', () => {
        it('returns correct props for output tile', () => {
            const getProps = getOutput(mockGetters);
            const props = getProps(0, 0);

            expect(props.backgroundColor).toBe('red');
            expect(props.style).toEqual({ border: '1px solid' });
            expect(props.sx.transition).toBeDefined();
        });
    });

    describe('useHandler', () => {
        it('calls useGetters with correct getTile function', () => {
            const row = [1, 0, 1];

            renderHook(() => useHandler(row, 3, mockPalette));

            expect(useGetters).toHaveBeenCalled();
            const calls = (useGetters as jest.Mock).mock.calls as [
                (r: number, c: number) => number,
            ][];
            const getTile = calls[0]![0];

            expect(getTile(0, 0)).toBe(1); // row 0, col 0 -> valid
            expect(getTile(0, 1)).toBe(0); // row 0, col 1 -> valid
            expect(getTile(0, 2)).toBe(1); // row 0, col 2 -> valid
            expect(getTile(1, 0)).toBe(-1); // row 1 -> invalid (only 1 row)
            expect(getTile(0, -1)).toBe(-1); // col -1 -> invalid
            expect(getTile(0, 3)).toBe(-1); // col 3 -> invalid (size 3)
        });
    });
});
