import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useDrag } from '../useDrag';

describe('useDrag', () => {
    const onAction = vi.fn();
    const defaultOptions = {
        onAction,
        checkEnabled: () => true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should handle mouse down and drag', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
                clientX: 0,
                clientY: 0,
            } as any);
        });

        expect(result.current.isDragging).toBe(true);
        expect(onAction).toHaveBeenCalledWith('0,0', false, true);

        // Hover another cell
        const props2 = result.current.getDragProps('0,1');
        act(() => {
            props2.onMouseEnter();
        });

        expect(onAction).toHaveBeenCalledWith('0,1', false, false);
    });

    it('should handle right click drag', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({
                button: 2,
                preventDefault: vi.fn(),
            } as any);
        });

        expect(result.current.isDragging).toBe(true);
        expect(result.current.draggingButton).toBe(2);
        expect(onAction).toHaveBeenCalledWith('0,0', true, true);
    });

    it('should stop dragging on mouse up (global listener)', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as any);
        });

        expect(result.current.isDragging).toBe(true);

        act(() => {
            window.dispatchEvent(new MouseEvent('mouseup'));
        });

        expect(result.current.isDragging).toBe(false);
    });

    it('should handle touch start', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onTouchStart({
                preventDefault: vi.fn(),
                cancelable: true,
            } as any);
        });

        expect(result.current.isDragging).toBe(true);
        expect(onAction).toHaveBeenCalledWith('0,0', false, true);
    });

    it('should handle keyboard activation', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onKeyDown({
                key: 'Enter',
                preventDefault: vi.fn(),
            } as any);
        });

        expect(onAction).toHaveBeenCalledWith('0,0', false, true);

        act(() => {
            props.onKeyDown({
                key: ' ',
                preventDefault: vi.fn(),
            } as any);
        });

        expect(onAction).toHaveBeenCalledTimes(2);
    });

    it('should respect checkEnabled', () => {
        const { result } = renderHook(() =>
            useDrag({
                ...defaultOptions,
                checkEnabled: () => false,
            })
        );
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({ button: 0 } as any);
        });

        expect(result.current.isDragging).toBe(false);
        expect(onAction).not.toHaveBeenCalled();
    });

    it('should handle touch move using elementFromPoint', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        // Start drag
        act(() => {
            props.onTouchStart({
                preventDefault: vi.fn(),
                cancelable: true,
            } as any);
        });

        // Mock document.elementFromPoint
        const mockElement = {
            closest: vi.fn().mockReturnValue({
                getAttribute: vi.fn().mockReturnValue('0,1'),
            }),
        };
        document.elementFromPoint = vi.fn().mockReturnValue(mockElement);

        act(() => {
            const touchMoveEvent = new CustomEvent('touchmove') as any;
            touchMoveEvent.touches = [{ clientX: 10, clientY: 10 }];
            window.dispatchEvent(touchMoveEvent);
        });

        expect(onAction).toHaveBeenCalledWith('0,1', false, false);
    });
});
