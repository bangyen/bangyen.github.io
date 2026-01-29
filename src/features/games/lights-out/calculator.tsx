import React, { useCallback } from 'react';
import { CircleRounded } from '../../../components/icons';
import { useGetters, Getters, Palette } from '../components/Board';

export function getInput(
    getters: Getters,
    toggleTile: (col: number) => (event: React.MouseEvent) => void
) {
    const { getColor, getBorder } = getters;

    return (r: number, c: number) => {
        const { front, back } = getColor(r, c);

        return {
            backgroundColor: front,
            style: getBorder(r, c),
            onClick: toggleTile(c),
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
