import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

/**
 * Props to apply to draggable DOM elements.
 * Contains all event handlers and attributes needed for drag interactions.
 */
export interface DragProps {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onFocus: () => void;
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
 * Shared options for both raw and grid drag modes.
 */
interface UseDragOptionsBase {
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
 * Raw drag mode: receives position strings directly.
 * Used when the caller doesn't need row/col parsing (e.g. single-axis inputs).
 */
interface UseDragRawOptions extends UseDragOptionsBase {
    /** Callback when a cell is interacted with (mouse/touch/keyboard) */
    onAction: (
        pos: string,
        isRightClick: boolean,
        isInitialClick: boolean,
    ) => void;
    onToggle?: undefined;
}

/**
 * Grid drag mode: parses "row,col" position strings into numbers and
 * persists a dragging value across cells during a single drag operation.
 * Replaces the former `useGameInteraction` wrapper.
 *
 * @template T - Type of value persisted during drag
 */
interface UseDragGridOptions<T> extends UseDragOptionsBase {
    onAction?: undefined;
    /** Callback when a grid cell is toggled (row, col, rightClick, draggingValue, isInitialClick) */
    onToggle: (
        row: number,
        col: number,
        isRightClick: boolean,
        draggingValue?: T,
        isInitialClick?: boolean,
    ) => T | undefined;
}

type UseDragOptions<T = void> = UseDragRawOptions | UseDragGridOptions<T>;

/**
 * Custom hook for managing drag interactions across mouse, touch, and keyboard.
 *
 * Supports two modes:
 * - **Raw mode** (`onAction`): receives position strings directly.
 * - **Grid mode** (`onToggle`): parses "row,col" strings into numbers and
 *   persists a dragging value across cells during a single drag operation,
 *   replacing the former `useGameInteraction` hook.
 *
 * Handles:
 * - Left/right-click dragging with continuous action on hover
 * - Touch dragging with movement tracking
 * - Keyboard activation (Space/Enter) and keyboard drag (hold key + navigate)
 * - Accessibility with proper ARIA roles
 *
 * @param options - Configuration for drag behavior
 * @returns Object with drag state and getDragProps function
 *
 * @example
 * ```tsx
 * // Raw mode
 * const { getDragProps } = useDrag({
 *   onAction: (pos, isRight, initial) => { ... },
 *   checkEnabled: () => !isGameOver,
 * });
 *
 * // Grid mode
 * const { getDragProps } = useDrag({
 *   onToggle: (row, col, isRight, draggingValue, isInitial) => {
 *     dispatch({ type: 'toggle', row, col });
 *     return newValue; // persisted across drag
 *   },
 *   checkEnabled: () => !solved,
 *   touchTimeout: 500,
 * });
 * ```
 */
export function useDrag<T = void>({
    checkEnabled = () => true,
    touchTimeout = 500,
    posAttribute = 'data-pos',
    preventDefault = true,
    transition = 'all 0.2s',
    ...callbacks
}: UseDragOptions<T>) {
    // Grid-mode: wrap onToggle into an onAction with coordinate parsing
    // and dragging-value persistence.
    const draggingValue = useRef<T | undefined>(undefined);
    const onToggleRef = useRef(callbacks.onToggle);
    onToggleRef.current = callbacks.onToggle;

    const isGridMode = callbacks.onToggle !== undefined;
    const rawOnAction = callbacks.onAction;

    const checkEnabledRef = useRef(checkEnabled);
    checkEnabledRef.current = checkEnabled;

    const onAction = useMemo(() => {
        if (!isGridMode && rawOnAction) return rawOnAction;

        return (
            pos: string,
            isRightClick: boolean,
            isInitialClick: boolean,
        ) => {
            if (!checkEnabledRef.current()) return;
            const toggle = onToggleRef.current;
            if (!toggle) return;

            const [r, c] = pos.split(',').map(Number);
            if (r === undefined || c === undefined) return;

            if (isInitialClick) {
                draggingValue.current = toggle(
                    r,
                    c,
                    isRightClick,
                    undefined,
                    true,
                );
            } else {
                toggle(r, c, isRightClick, draggingValue.current, false);
            }
        };
    }, [isGridMode, rawOnAction]);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const isDraggingRef = useRef<number | null>(null);

    const updateDragging = useCallback((val: number | null) => {
        setIsDragging(val);
        isDraggingRef.current = val;
    }, []);

    const draggedItems = useRef(new Set<string>());
    const lastTouchTime = useRef(0);

    // Keyboard drag: null = inactive, false = Space (forward), true = Enter (reverse).
    const kbDragReverse = useRef<boolean | null>(null);

    const stopDragging = useCallback(() => {
        updateDragging(null);
        kbDragReverse.current = null;
        draggedItems.current.clear();
    }, [updateDragging]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (
            (e.key === ' ' || e.key === 'Enter') &&
            kbDragReverse.current !== null
        ) {
            kbDragReverse.current = null;
            draggedItems.current.clear();
        }
    }, []);

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (isDraggingRef.current === null) return;

            const touch = e.touches[0];
            if (!touch) return;

            const element = document.elementFromPoint(
                touch.clientX,
                touch.clientY,
            );
            if (!element) return;

            const cell = element.closest(`[${posAttribute}]`);
            if (cell) {
                const pos = cell.getAttribute(posAttribute);
                if (pos && !draggedItems.current.has(pos)) {
                    onAction(pos, isDraggingRef.current === 2, false);
                    draggedItems.current.add(pos);
                }
            }
        },
        [onAction, posAttribute],
    );

    useEffect(() => {
        globalThis.addEventListener('mouseup', stopDragging);
        globalThis.addEventListener('touchend', stopDragging);
        globalThis.addEventListener('touchcancel', stopDragging);
        globalThis.addEventListener('keyup', handleKeyUp);
        globalThis.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });

        return () => {
            globalThis.removeEventListener('mouseup', stopDragging);
            globalThis.removeEventListener('touchend', stopDragging);
            globalThis.removeEventListener('touchcancel', stopDragging);
            globalThis.removeEventListener('keyup', handleKeyUp);
            globalThis.removeEventListener('touchmove', handleTouchMove);
        };
    }, [stopDragging, handleKeyUp, handleTouchMove]);

    const getDragProps = useCallback(
        (pos: string): DragProps => ({
            onMouseDown: (e: React.MouseEvent) => {
                if (!checkEnabledRef.current()) return;
                if (e.button !== 0 && e.button !== 2) return;
                if (Date.now() - lastTouchTime.current < touchTimeout) return;

                kbDragReverse.current = null;
                if (preventDefault) e.preventDefault();
                updateDragging(e.button);
                onAction(pos, e.button === 2, true);
                draggedItems.current.add(pos);
            },
            onMouseEnter: () => {
                if (
                    isDraggingRef.current !== null &&
                    !draggedItems.current.has(pos) &&
                    checkEnabledRef.current()
                ) {
                    onAction(pos, isDraggingRef.current === 2, false);
                    draggedItems.current.add(pos);
                }
            },
            onFocus: () => {
                if (
                    kbDragReverse.current !== null &&
                    !draggedItems.current.has(pos) &&
                    checkEnabledRef.current()
                ) {
                    onAction(pos, kbDragReverse.current, false);
                    draggedItems.current.add(pos);
                }
            },
            onTouchStart: (e: React.TouchEvent) => {
                if (!checkEnabledRef.current()) return;
                if (e.cancelable && preventDefault) e.preventDefault();
                lastTouchTime.current = Date.now();
                updateDragging(0); // Touch as left click
                onAction(pos, false, true);
                draggedItems.current.add(pos);
            },
            onKeyDown: (e: React.KeyboardEvent) => {
                if (!checkEnabledRef.current()) return;
                if (e.key === ' ' && !e.repeat) {
                    e.preventDefault();
                    updateDragging(null);
                    kbDragReverse.current = false;
                    draggedItems.current.clear();
                    onAction(pos, false, true);
                    draggedItems.current.add(pos);
                } else if (e.key === 'Enter' && !e.repeat) {
                    e.preventDefault();
                    updateDragging(null);
                    kbDragReverse.current = true;
                    draggedItems.current.clear();
                    onAction(pos, true, true);
                    draggedItems.current.add(pos);
                } else if ((e.key === ' ' || e.key === 'Enter') && e.repeat) {
                    e.preventDefault();
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
            updateDragging,
            touchTimeout,
            posAttribute,
            preventDefault,
            transition,
        ],
    );

    return {
        isDragging: isDragging !== null,
        draggingButton: isDragging,
        getDragProps,
        lastTouchTime,
    };
}
