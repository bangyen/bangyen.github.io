import React, { useCallback } from 'react';

import type { DragProps } from '../../hooks/useDrag';
import { LIGHTS_OUT_STYLES } from '../config';
import { useGetters } from '../hooks/boardUtils';
import type { Getters, Palette } from '../types';
import { FOCUS_VISIBLE_SX } from '../utils/renderers';

import { CircleRounded } from '@/components/icons';

export function getInput(
    getters: Getters,
    getDragProps: (pos: string) => DragProps,
) {
    const { getColor, getBorder } = getters;

    return (r: number, c: number) => {
        const { front, back } = getColor(r, c);
        const dragProps = getDragProps(`${r.toString()},${c.toString()}`);

        return {
            ...dragProps,
            backgroundColor: front,
            style: getBorder(r, c),
            sx: {
                position: 'relative',
                ...dragProps.sx,
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
                '&:focus-visible': FOCUS_VISIBLE_SX,
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
        [row, size],
    );

    return useGetters(getTile, palette);
}
