import { Box } from '@mui/material';

import type { DragProps } from '../../hooks/useDrag';
import { LIGHTS_OUT_STYLES } from '../config';
import type { Getters } from '../types';

import { getPosKey } from '@/utils/gameUtils';

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

/**
 * Build per-cell props for the interactive front layer.
 *
 * When `skipTransition` is true the cells render with `transition: 'none'`
 * so a freshly regenerated board appears instantly — avoiding border-radius
 * and color animation artifacts caused by rapid resize / refresh clicks.
 */
export function getFrontProps(
    getDragProps: (pos: string) => DragProps,
    getters: Getters,
    skipTransition?: boolean,
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
            ...(skipTransition ? { transition: 'none' } : {}),
            'aria-label': `Cell at row ${String(row + 1)}, column ${String(col + 1)}`,
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

/**
 * Build per-cell props for the decorative back layer (gap-filler squares).
 *
 * @param skipTransition - When true, disables the CSS transition so a
 *   regenerated board paints instantly without animation artifacts.
 */
export function getBackProps(getters: Getters, skipTransition?: boolean) {
    return (row: number, col: number) => {
        return {
            backgroundColor: getters.getFiller(row, col),
            transition: skipTransition
                ? 'none'
                : LIGHTS_OUT_STYLES.TRANSITION.FAST,
        };
    };
}

export function getExampleProps(getters: Getters) {
    const frontProps = getFrontProps(
        (pos: string) => ({
            onMouseDown: () => {},
            onMouseEnter: () => {},
            onTouchStart: () => {},
            onKeyDown: () => {},
            'data-pos': pos,
            role: 'presentation',
            tabIndex: -1,
            sx: { touchAction: 'none' as const, transition: 'none' },
        }),
        getters,
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
