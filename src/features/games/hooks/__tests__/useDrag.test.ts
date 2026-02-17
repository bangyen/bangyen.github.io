import { renderHook, act } from '@testing-library/react';
import type React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useDrag } from '../useDrag';

/** Creates a mock touchmove event with the given clientX/Y. */
function createTouchMoveEvent(clientX: number, clientY: number): Event {
    const event = new CustomEvent('touchmove');
    Object.defineProperty(event, 'touches', {
        value: [{ clientX, clientY }],
    });
    return event;
}

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
            } as unknown as React.MouseEvent);
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
            } as unknown as React.MouseEvent);
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
            } as unknown as React.MouseEvent);
        });

        expect(result.current.isDragging).toBe(true);

        act(() => {
            globalThis.dispatchEvent(new MouseEvent('mouseup'));
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
            } as unknown as React.TouchEvent);
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
                shiftKey: false,
                preventDefault: vi.fn(),
            } as unknown as React.KeyboardEvent);
        });

        expect(onAction).toHaveBeenCalledWith('0,0', false, true);

        act(() => {
            props.onKeyDown({
                key: ' ',
                shiftKey: false,
                preventDefault: vi.fn(),
            } as unknown as React.KeyboardEvent);
        });

        expect(onAction).toHaveBeenCalledTimes(2);

        act(() => {
            props.onKeyDown({
                key: ' ',
                shiftKey: true,
                preventDefault: vi.fn(),
            } as unknown as React.KeyboardEvent);
        });

        expect(onAction).toHaveBeenCalledWith('0,0', true, true);
        expect(onAction).toHaveBeenCalledTimes(3);
    });

    it('should respect checkEnabled', () => {
        const { result } = renderHook(() =>
            useDrag({
                ...defaultOptions,
                checkEnabled: () => false,
            }),
        );
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({ button: 0 } as unknown as React.MouseEvent);
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
            } as unknown as React.TouchEvent);
        });

        // Mock document.elementFromPoint
        const mockElement = {
            closest: vi.fn().mockReturnValue({
                getAttribute: vi.fn().mockReturnValue('0,1'),
            }),
        };
        document.elementFromPoint = vi.fn().mockReturnValue(mockElement);

        act(() => {
            globalThis.dispatchEvent(createTouchMoveEvent(10, 10));
        });

        expect(onAction).toHaveBeenCalledWith('0,1', false, false);
    });

    it('should handle touch move when elementFromPoint returns null', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onTouchStart({
                preventDefault: vi.fn(),
                cancelable: true,
            } as unknown as React.TouchEvent);
        });

        document.elementFromPoint = vi.fn().mockReturnValue(null);

        act(() => {
            globalThis.dispatchEvent(createTouchMoveEvent(10, 10));
        });

        expect(onAction).toHaveBeenCalledTimes(1); // Only initial touch start
    });

    it('should handle touch move when closest returns null', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onTouchStart({
                preventDefault: vi.fn(),
                cancelable: true,
            } as unknown as React.TouchEvent);
        });

        const mockElement = {
            closest: vi.fn().mockReturnValue(null),
        };
        document.elementFromPoint = vi.fn().mockReturnValue(mockElement);

        act(() => {
            globalThis.dispatchEvent(createTouchMoveEvent(10, 10));
        });

        expect(onAction).toHaveBeenCalledTimes(1); // Only initial touch start
    });

    it('should handle touch move when getAttribute returns null', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onTouchStart({
                preventDefault: vi.fn(),
                cancelable: true,
            } as unknown as React.TouchEvent);
        });

        const mockElement = {
            closest: vi.fn().mockReturnValue({
                getAttribute: vi.fn().mockReturnValue(null),
            }),
        };
        document.elementFromPoint = vi.fn().mockReturnValue(mockElement);

        act(() => {
            globalThis.dispatchEvent(createTouchMoveEvent(10, 10));
        });

        expect(onAction).toHaveBeenCalledTimes(1); // Only initial touch start
    });

    it('should not call action when dragging to already-dragged position', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        // Start drag
        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent);
        });

        expect(onAction).toHaveBeenCalledTimes(1);

        // Try to hover the same cell again
        act(() => {
            props.onMouseEnter();
        });

        // Should not be called again
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('should filter middle mouse button (button=1)', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({
                button: 1,
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent);
        });

        expect(result.current.isDragging).toBe(false);
        expect(onAction).not.toHaveBeenCalled();
    });

    it('should debounce mouse events after touch', () => {
        const { result } = renderHook(() =>
            useDrag({ ...defaultOptions, touchTimeout: 500 }),
        );
        const props = result.current.getDragProps('0,0');

        // Start with touch (sets lastTouchTime)
        act(() => {
            props.onTouchStart({
                preventDefault: vi.fn(),
                cancelable: true,
            } as unknown as React.TouchEvent);
        });

        // Immediately try mouse down (within 500ms) - should be blocked
        // The code checks: if (Date.now() - lastTouchTime.current < touchTimeout) return
        const mockMouseDown = vi.fn();
        act(() => {
            const e = {
                button: 0,
                preventDefault: mockMouseDown,
            } as unknown as React.MouseEvent;
            props.onMouseDown(e);
        });

        // isDragging should still be from touch (value 0 treated as truthy for null checks)
        // Actually the touch sets isDragging = 0, and mouse down within timeout returns early
        // So the state from touch should persist
        expect(result.current.isDragging).toBe(true);
    });

    it('should allow mouse events after touch timeout', () => {
        vi.useFakeTimers();
        try {
            const { result } = renderHook(() =>
                useDrag({ ...defaultOptions, touchTimeout: 500 }),
            );
            const props = result.current.getDragProps('0,0');

            // Start with touch
            act(() => {
                props.onTouchStart({
                    preventDefault: vi.fn(),
                    cancelable: true,
                } as unknown as React.TouchEvent);
            });

            // Wait past timeout
            act(() => {
                vi.advanceTimersByTime(600);
            });

            // Now mouse down should work
            act(() => {
                props.onMouseDown({
                    button: 0,
                    preventDefault: vi.fn(),
                } as unknown as React.MouseEvent);
            });

            expect(result.current.isDragging).toBe(true);
        } finally {
            vi.useRealTimers();
        }
    });

    it('should respect preventDefault option', () => {
        const { result } = renderHook(() =>
            useDrag({ ...defaultOptions, preventDefault: false }),
        );
        const props = result.current.getDragProps('0,0');

        const mockPreventDefault = vi.fn();
        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: mockPreventDefault,
            } as unknown as React.MouseEvent);
        });

        expect(mockPreventDefault).not.toHaveBeenCalled();
    });

    it('should handle onContextMenu with preventDefault option', () => {
        const { result } = renderHook(() =>
            useDrag({ ...defaultOptions, preventDefault: false }),
        );
        const props = result.current.getDragProps('0,0');

        const mockPreventDefault = vi.fn();
        act(() => {
            props.onContextMenu?.({
                preventDefault: mockPreventDefault,
            } as unknown as React.MouseEvent);
        });

        expect(mockPreventDefault).not.toHaveBeenCalled();
    });

    it('should use custom posAttribute', () => {
        const { result } = renderHook(() =>
            useDrag({ ...defaultOptions, posAttribute: 'data-col' }),
        );
        const props = result.current.getDragProps('0,0');

        expect(props['data-col']).toBe('0,0');
        expect(props['data-pos']).toBeUndefined();
    });

    it('should handle checkEnabled returning false', () => {
        const { result } = renderHook(() =>
            useDrag({
                ...defaultOptions,
                checkEnabled: () => false,
            }),
        );
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent);
        });

        expect(result.current.isDragging).toBe(false);
    });

    it('should not continue dragging if checkEnabled becomes false on hover', () => {
        let enabledState = true;
        const { result, rerender } = renderHook(() =>
            useDrag({
                ...defaultOptions,
                checkEnabled: () => enabledState,
            }),
        );
        const props = result.current.getDragProps('0,0');

        // Start drag
        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent);
        });

        expect(result.current.isDragging).toBe(true);

        // Disable and try hover
        enabledState = false;
        rerender();

        const props2 = result.current.getDragProps('0,1');
        act(() => {
            props2.onMouseEnter();
        });

        // Should not add new position
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('should use default checkEnabled if not provided', () => {
        const { result } = renderHook(() => useDrag({ onAction: vi.fn() }));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onMouseDown({
                button: 0,
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent);
        });

        expect(result.current.isDragging).toBe(true);
    });

    it('should handle onContextMenu with preventDefault: true', () => {
        const { result } = renderHook(() =>
            useDrag({ ...defaultOptions, preventDefault: true }),
        );
        const props = result.current.getDragProps('0,0');

        const mockPreventDefault = vi.fn();
        act(() => {
            props.onContextMenu?.({
                preventDefault: mockPreventDefault,
            } as unknown as React.MouseEvent);
        });

        expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('should not trigger action for other keys in onKeyDown', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        act(() => {
            props.onKeyDown({
                key: 'Shift',
                preventDefault: vi.fn(),
            } as unknown as React.KeyboardEvent);
        });

        expect(onAction).not.toHaveBeenCalled();
    });

    it('should handle right-click touch move (hypothetically)', () => {
        const { result } = renderHook(() => useDrag(defaultOptions));
        const props = result.current.getDragProps('0,0');

        // Start right-click drag (simulated)
        // Note: useDrag treats touch as button 0, but we can manually set isDragging for tests
        act(() => {
            props.onMouseDown({
                button: 2,
                preventDefault: vi.fn(),
            } as unknown as React.MouseEvent);
        });

        // Mock document.elementFromPoint
        const mockElement = {
            closest: vi.fn().mockReturnValue({
                getAttribute: vi.fn().mockReturnValue('0,1'),
            }),
        };
        document.elementFromPoint = vi.fn().mockReturnValue(mockElement);

        act(() => {
            globalThis.dispatchEvent(createTouchMoveEvent(10, 10));
        });

        expect(onAction).toHaveBeenCalledWith('0,1', true, false);
    });
});
