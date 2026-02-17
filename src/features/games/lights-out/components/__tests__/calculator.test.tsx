import { renderHook } from '@testing-library/react';
import { vi, type Mock } from 'vitest';

import type { DragProps } from '../../../hooks/useDrag';
import { useGetters } from '../../hooks/boardUtils';
import { getInput, getOutput, useHandler } from '../Calculator';

// Mock useGetters from boardUtils
vi.mock('../../hooks/boardUtils', () => ({
    useGetters: vi.fn(
        (
            _getTile: (r: number, c: number) => number,
            palette: { primary: string; secondary: string },
        ) => ({
            getColor: (_r: number, _c: number) => ({
                front: palette.primary,
                back: palette.secondary,
                isLit: false,
            }),
            getBorder: (_r: number, _c: number) => ({
                border: '1px solid black',
            }),
        }),
    ),
}));

describe('Lights Out Calculator UI Helpers', () => {
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const mockGetters = {
        getColor: vi.fn(() => ({ front: 'red', back: 'blue', isLit: false })),
        getBorder: vi.fn(() => ({ border: '1px solid' })),
        getFiller: vi.fn(() => 'red'),
    };

    describe('getInput', () => {
        it('returns correct props for a tile', () => {
            const mockGetDragProps = vi.fn((pos: string) => ({
                onMouseDown: vi.fn(),
                onMouseEnter: vi.fn(),
                onFocus: vi.fn(),
                onTouchStart: vi.fn(),
                onKeyDown: vi.fn(),
                role: 'button',
                tabIndex: 0,
                'data-pos': pos,
                sx: { touchAction: 'none' as const, transition: 'none' },
            }));

            const getProps = getInput(mockGetters, mockGetDragProps);
            const props = getProps(0, 0);

            expect(props.backgroundColor).toBe('red');
            expect(props.style).toEqual({ border: '1px solid' });
            expect(props.color).toBe('red');
            expect(props.sx).toBeDefined();

            // Verify getDragProps was called
            expect(mockGetDragProps).toHaveBeenCalledWith('0');
        });

        it('calls getters with correct coordinates', () => {
            const getProps = getInput(
                mockGetters,
                vi.fn(
                    (pos: string) =>
                        ({
                            onMouseDown: vi.fn(),
                            onMouseEnter: vi.fn(),
                            onFocus: vi.fn(),
                            onTouchStart: vi.fn(),
                            onKeyDown: vi.fn(),
                            role: 'button',
                            tabIndex: 0,
                            'data-pos': pos,
                            sx: {
                                touchAction: 'none' as const,
                                transition: 'none',
                            },
                        }) as DragProps,
                ),
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
            const calls = (useGetters as Mock).mock.calls as [
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
