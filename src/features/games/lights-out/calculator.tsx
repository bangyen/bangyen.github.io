import React, { useCallback } from 'react';
import { CircleRounded } from '../../../components/icons';
import { useGetters, Getters, Palette } from '../components/Board';
import { TIMING_CONSTANTS, LIGHTS_OUT_STYLES } from './constants';

export function getInput(
    getters: Getters,
    toggleTile: (col: number) => void,
    isDragging = false,
    setIsDragging: (val: boolean) => void = () => undefined,
    draggedCols: React.RefObject<Set<number>>,
    addDraggedCol: (col: number) => void = () => undefined,
    lastTouchTime: React.RefObject<number>
) {
    const { getColor, getBorder } = getters;

    return (r: number, c: number) => {
        const { front, back } = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
            onMouseDown: (e: React.MouseEvent) => {
                if (e.button !== 0) return;
                // Ignore ghost clicks on mobile
                if (
                    Date.now() - lastTouchTime.current <
                    TIMING_CONSTANTS.GHOST_CLICK_TIMEOUT
                )
                    return;
                setIsDragging(true);
                toggleTile(c);
                addDraggedCol(c);
            },
            onMouseEnter: () => {
                if (isDragging && !draggedCols.current.has(c)) {
                    toggleTile(c);
                    addDraggedCol(c);
                }
            },
            onTouchStart: (e: React.TouchEvent) => {
                // Prevent ghost mouse events and scrolling
                if (e.cancelable) e.preventDefault();
                lastTouchTime.current = Date.now();
                setIsDragging(true);
                toggleTile(c);
                addDraggedCol(c);
            },
            'data-col': c.toString(),
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
                touchAction: 'none', // Prevent scrolling while dragging
                transition: LIGHTS_OUT_STYLES.TRANSITION.DEFAULT,
            },
            color: front,
            children: <CircleRounded />,
        };
    };
}

export function getOutput({ getColor, getBorder }: Getters) {
    return (r: number, c: number) => {
        const { front } = getColor(r, c);

        return {
            backgroundColor: front,
            color: front,
            children: <CircleRounded />,
            style: getBorder(r, c),
            sx: {
                transition: LIGHTS_OUT_STYLES.TRANSITION.DEFAULT,
            },
        };
    };
}

export function useHandler(row: number[], size: number, palette: Palette) {
    const getTile = useCallback(
        (r: number, c: number) => {
            if (r !== 0 || c < 0 || c >= size) return -1;
            return row[c];
        },
        [row, size]
    );

    return useGetters(getTile, palette);
}
