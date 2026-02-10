import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Props to apply to draggable DOM elements.
 * Contains all event handlers and attributes needed for drag interactions.
 */
export interface DragProps {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    'data-pos'?: string;
    'data-col'?: string;
    role: string;
    tabIndex: number;
    sx: {
        touchAction: 'none';
        transition: string;
        [key: string]: unknown;
    };
}

/**
 * Configuration options for the useDrag hook.
 */
interface UseDragOptions {
    /** Callback when a cell is interacted with (mouse/touch/keyboard) */
    onAction: (
        pos: string,
        isRightClick: boolean,
        isInitialClick: boolean
    ) => void;
    /** Optional check to enable/disable drag interactions */
    checkEnabled?: () => boolean;
    /** Timeout in ms to debounce touch from mouse (default: 500) */
    touchTimeout?: number;
    /** Data attribute to use for position tracking */
    posAttribute?: 'data-pos' | 'data-col';
    /** Whether to prevent default browser behavior (default: true) */
    preventDefault?: boolean;
    /** CSS transition property for visual feedback */
    transition?: string;
}

/**
 * Custom hook for managing drag interactions across mouse, touch, and keyboard.
 *
 * Handles:
 * - Left/right-click dragging with continuous action on hover
 * - Touch dragging with movement tracking
 * - Keyboard activation (Enter/Space)
 * - Accessibility with proper ARIA roles
 *
 * @param options - Configuration for drag behavior
 * @returns Object with drag state and getDragProps function
 *
 * @example
 * ```tsx
 * const { isDragging, getDragProps } = useDrag({
 *   onAction: (pos, isRight, initial) => {
 *     console.log(`Cell ${pos}: right=${isRight}, initial=${initial}`);
 *   },
 *   checkEnabled: () => !isGameOver,
 *   touchTimeout: 500
 * });
 *
 * return (
 *   <div {...getDragProps('0,0')}>
 *     Cell Content
 *   </div>
 * );
 * ```
 */
export function useDrag({
    onAction,
    checkEnabled = () => true,
    touchTimeout = 500,
    posAttribute = 'data-pos',
    preventDefault = true,
    transition = 'all 0.2s',
}: UseDragOptions) {
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const draggedItems = useRef(new Set<string>());
    const lastTouchTime = useRef(0);

    const stopDragging = useCallback(() => {
        setIsDragging(null);
        draggedItems.current.clear();
    }, []);

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (isDragging === null) return;

            const touch = e.touches[0];
            if (!touch) return;

            const element = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            );
            if (!element) return;

            const cell = element.closest(`[${posAttribute}]`);
            if (cell) {
                const pos = cell.getAttribute(posAttribute);
                if (pos && !draggedItems.current.has(pos)) {
                    onAction(pos, isDragging === 2, false);
                    draggedItems.current.add(pos);
                }
            }
        },
        [isDragging, onAction, posAttribute]
    );

    useEffect(() => {
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchcancel', stopDragging);
        window.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });

        return () => {
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('touchend', stopDragging);
            window.removeEventListener('touchcancel', stopDragging);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [stopDragging, handleTouchMove]);

    const getDragProps = useCallback(
        (pos: string): DragProps => ({
            onMouseDown: (e: React.MouseEvent) => {
                if (!checkEnabled()) return;
                if (e.button !== 0 && e.button !== 2) return;
                if (Date.now() - lastTouchTime.current < touchTimeout) return;

                if (preventDefault) e.preventDefault();
                setIsDragging(e.button);
                onAction(pos, e.button === 2, true);
                draggedItems.current.add(pos);
            },
            onMouseEnter: () => {
                if (
                    isDragging !== null &&
                    !draggedItems.current.has(pos) &&
                    checkEnabled()
                ) {
                    onAction(pos, isDragging === 2, false);
                    draggedItems.current.add(pos);
                }
            },
            onTouchStart: (e: React.TouchEvent) => {
                if (!checkEnabled()) return;
                if (e.cancelable && preventDefault) e.preventDefault();
                lastTouchTime.current = Date.now();
                setIsDragging(0); // Touch as left click
                onAction(pos, false, true);
                draggedItems.current.add(pos);
            },
            onKeyDown: (e: React.KeyboardEvent) => {
                if (!checkEnabled()) return;
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onAction(pos, false, true);
                }
            },
            onContextMenu: (e: React.MouseEvent) => {
                if (preventDefault) e.preventDefault();
            },
            [posAttribute]: pos,
            role: 'button',
            tabIndex: 0,
            sx: {
                touchAction: 'none',
                transition,
            },
        }),
        [
            onAction,
            checkEnabled,
            isDragging,
            touchTimeout,
            posAttribute,
            preventDefault,
            transition,
        ]
    );

    return {
        isDragging: isDragging !== null,
        draggingButton: isDragging,
        getDragProps,
        lastTouchTime,
    };
}
