import { renderHook, act } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useDrag } from '../useDrag';

describe('useDrag grid mode (onToggle)', () => {
    const onToggle = vi.fn();
    const defaultOptions = {
        onToggle,
        checkEnabled: () => true,
        touchTimeout: 500,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call onToggle with parsed coordinates on initial click', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('1,2');

        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as MouseEvent);
        });

        expect(onToggle).toHaveBeenCalledWith(1, 2, false, undefined, true);
    });

    it('should handle dragging value', () => {
        onToggle.mockReturnValueOnce('drag-val');
        const { result } = renderHook(() => useDrag(defaultOptions));

        // Initial click
        act(() => {
            result.current.getDragProps('1,2').onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as MouseEvent);
        });

        expect(onToggle).toHaveBeenCalledWith(1, 2, false, undefined, true);

        // Move to next cell
        act(() => {
            result.current.getDragProps('1,3').onMouseEnter();
        });

        expect(onToggle).toHaveBeenCalledWith(1, 3, false, 'drag-val', false);
    });

    it('should not call onToggle if disabled', () => {
        const { result } = renderHook(() =>
            useDrag({
                ...defaultOptions,
                checkEnabled: () => false,
            }),
        );

        act(() => {
            result.current.getDragProps('1,2').onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as MouseEvent);
        });

        expect(onToggle).not.toHaveBeenCalled();
    });

    it('should ignore invalid pos strings', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));

        act(() => {
            result.current.getDragProps('invalid').onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as MouseEvent);
        });

        expect(onToggle).not.toHaveBeenCalled();
    });
});
