import { useState, useRef, useCallback, useEffect } from 'react';

export interface DragProps {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onContextMenu?: (e: React.MouseEvent) => void;
    'data-pos'?: string;
    'data-col'?: string;
    sx: {
        touchAction: 'none';
        transition: string;
        [key: string]: unknown;
    };
}

interface UseDragOptions {
    onAction: (
        pos: string,
        isRightClick: boolean,
        isInitialClick: boolean
    ) => void;
    checkEnabled?: () => boolean;
    touchTimeout?: number;
    posAttribute?: 'data-pos' | 'data-col';
    preventDefault?: boolean;
    transition?: string;
}

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
            onContextMenu: (e: React.MouseEvent) => {
                if (preventDefault) e.preventDefault();
            },
            [posAttribute]: pos,
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
