import React from 'react';
import { Box } from '../../../components/mui';
import { Getters } from '../components/Board';
import { DragProps } from '../hooks/useDrag';
import { getPosKey } from '../utils/gameUtils';
import { LIGHTS_OUT_STYLES } from './constants';

const ICON = (
    <Box
        sx={{
            width: '45%',
            height: '45%',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        }}
    />
);

export function getFrontProps(
    getDragProps: (pos: string) => DragProps,
    getters: Getters
) {
    const { getColor, getBorder } = getters;

    return (row: number, col: number) => {
        const style = getBorder(row, col);
        const { front, back } = getColor(row, col);
        const pos = getPosKey(row, col);
        const dragProps = getDragProps(pos);

        return {
            ...dragProps,
            children: ICON,
            backgroundColor: front,
            color: front,
            style,
            sx: {
                ...dragProps.sx,
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
            },
        };
    };
}

export function getBackProps(getters: Getters) {
    return (row: number, col: number) => {
        return {
            backgroundColor: getters.getFiller(row, col),
            transition: LIGHTS_OUT_STYLES.TRANSITION.FAST,
        };
    };
}

export function getExampleProps(getters: Getters) {
    const frontProps = getFrontProps(
        (pos: string) => ({
            onMouseDown: () => undefined,
            onMouseEnter: () => undefined,
            onTouchStart: () => undefined,
            'data-pos': pos,
            sx: { touchAction: 'none' as const, transition: 'none' },
        }),
        getters
    );

    return (row: number, col: number) => {
        const props = frontProps(row, col);
        return {
            ...props,
            onMouseDown: undefined,
            onMouseEnter: undefined,
            onTouchStart: undefined,
            sx: {},
        };
    };
}
