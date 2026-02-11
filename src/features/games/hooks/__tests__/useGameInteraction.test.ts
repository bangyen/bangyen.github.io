import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useGameInteraction } from '../useGameInteraction';

describe('useGameInteraction', () => {
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
        const { result } = renderHook(() => useGameInteraction(defaultOptions));
        const props = result.current.getDragProps('1,2');

        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as any);
        });

        expect(onToggle).toHaveBeenCalledWith(1, 2, false, undefined, true);
    });

    it('should handle dragging value', () => {
        onToggle.mockReturnValueOnce('drag-val');
        const { result } = renderHook(() => useGameInteraction(defaultOptions));

        // Initial click
        act(() => {
            result.current.getDragProps('1,2').onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as any);
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
            useGameInteraction({
                ...defaultOptions,
                checkEnabled: () => false,
            })
        );

        act(() => {
            result.current.getDragProps('1,2').onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as any);
        });

        expect(onToggle).not.toHaveBeenCalled();
    });

    it('should ignore invalid pos strings', () => {
        const { result } = renderHook(() => useGameInteraction(defaultOptions));

        act(() => {
            result.current.getDragProps('invalid').onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as any);
        });

        expect(onToggle).not.toHaveBeenCalled();
    });
});
