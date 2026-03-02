/**
 * @vitest-environment happy-dom
 */
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import type { DragProps } from '../../../hooks/useDrag';
import { getInput, getOutput, useHandler } from '../calculatorHelpers';

describe('Lights Out Calculator UI Helpers', () => {
    const mockPalette = { primary: 'red', secondary: 'blue' };
    const mockGetters = {
        getColor: vi.fn((r: number, c: number) => ({
            front: 'red',
            back: 'blue',
            isLit: r === 0 && c === 0,
        })),
        getBorder: vi.fn(() => ({ border: '1px solid' })),
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

            // Verify getDragProps was called with row,col pos key
            expect(mockGetDragProps).toHaveBeenCalledWith('0,0');
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
        it('derives correct color and border from state', () => {
            const row = [1, 0, 1];
            const { result } = renderHook(() =>
                useHandler(row, 3, mockPalette),
            );

            const { getColor, getBorder } = result.current;

            // Test getColor
            expect(getColor(0, 0).isLit).toBe(true);
            expect(getColor(0, 0).front).toBe('red');
            expect(getColor(0, 1).isLit).toBe(false);
            expect(getColor(0, 1).front).toBe('blue');

            // Test getBorder
            const border00 = getBorder(0, 0);
            expect(border00).toBeDefined();

            // Test invalid coordinates
            expect(getColor(1, 0).isLit).toBe(false); // Out of bounds r
            expect(getColor(0, 3).isLit).toBe(false); // Out of bounds c
        });
    });
});
