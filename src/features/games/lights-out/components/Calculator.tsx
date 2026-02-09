import React, { useCallback } from 'react';
import { CircleRounded } from '@/components/icons';
import { Getters, Palette } from '../../components/Board';
import { useGetters } from '../hooks/boardUtils';
import { LIGHTS_OUT_STYLES } from '../utils/constants';
import { DragProps } from '../../hooks/useDrag';

export function getInput(
    getters: Getters,
    getDragProps: (pos: string) => DragProps
) {
    const { getColor, getBorder } = getters;

    return (r: number, c: number) => {
        const { front, back } = getColor(r, c);
        const dragProps = getDragProps(c.toString());

        return {
            ...dragProps,
            backgroundColor: front,
            style: getBorder(r, c),
            sx: {
                ...dragProps.sx,
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
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
            return row[c] ?? 0;
        },
        [row, size]
    );

    return useGetters(getTile, palette);
}
