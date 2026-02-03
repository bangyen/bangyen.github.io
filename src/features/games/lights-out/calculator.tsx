import React, { useCallback } from 'react';
import { CircleRounded } from '../../../components/icons';
import { useGetters, Getters, Palette } from '../components/Board';

export function getInput(
    getters: Getters,
    toggleTile: (col: number) => void,
    isDragging = false,
    setIsDragging: (val: boolean) => void = () => undefined,
    draggedCols = new Set<number>(),
    addDraggedCol: (col: number) => void = () => undefined
) {
    const { getColor, getBorder } = getters;

    return (r: number, c: number) => {
        const { front, back } = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
            onMouseDown: (e: React.MouseEvent) => {
                if (e.button !== 0) return;
                setIsDragging(true);
                toggleTile(c);
                addDraggedCol(c);
            },
            onMouseEnter: () => {
                if (isDragging && !draggedCols.has(c)) {
                    toggleTile(c);
                    addDraggedCol(c);
                }
            },
            sx: {
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
                transition: 'all 200ms ease',
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
                transition: 'all 200ms ease',
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
