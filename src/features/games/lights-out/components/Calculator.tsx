import React, { useCallback, useMemo } from 'react';

import type { DragProps } from '../../hooks/useDrag';
import { LIGHTS_OUT_STYLES } from '../config';
import type { Palette } from '../types';
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

export interface Getters {
    getColor: (
        r: number,
        c: number,
    ) => { front: string; back: string; isLit: boolean };
    getBorder: (r: number, c: number) => React.CSSProperties;
}

export function useHandler(row: number[], size: number, palette: Palette) {
    const getTile = useCallback(
        (r: number, c: number) => {
            if (r !== 0 || c < 0 || c >= size) return -1;
            return row[c] ?? 0;
        },
        [row, size],
    );

    return useMemo(() => {
        const getColor = (r: number, c: number) => {
            const value = getTile(r, c);
            const front = value ? palette.primary : palette.secondary;
            const back = value ? palette.secondary : palette.primary;
            return { front, back, isLit: value > 0 };
        };

        const getBorder = (r: number, c: number) => {
            const self = getTile(r, c);
            const up = getTile(r - 1, c);
            const down = getTile(r + 1, c);
            const left = getTile(r, c - 1);
            const right = getTile(r, c + 1);
            const props: React.CSSProperties = {};

            if (self === up || self === left) props.borderTopLeftRadius = 0;
            if (self === up || self === right) props.borderTopRightRadius = 0;
            if (self === down || self === left)
                props.borderBottomLeftRadius = 0;
            if (self === down || self === right)
                props.borderBottomRightRadius = 0;
            return props;
        };

        return { getColor, getBorder };
    }, [getTile, palette]);
}
