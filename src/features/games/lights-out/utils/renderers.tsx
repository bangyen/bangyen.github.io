import { Box, styled } from '@mui/material';

import type { DragProps } from '../../hooks/useDrag';
import { LIGHTS_OUT_STYLES } from '../config';
import type { Getters } from '../types';

import { COLORS } from '@/config/theme';
import { getPosKey } from '@/utils/gameUtils';

const IconBox = styled(Box)({
    width: '35%',
    height: '35%',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
});

const ICON = <IconBox />;

export const FOCUS_VISIBLE_SX = {
    outline: 'none',
    zIndex: 1,
    '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: 'var(--cell-radius)',
        boxShadow: `inset 0 0 0 3px ${COLORS.text.secondary}`,
        pointerEvents: 'none',
    },
};

/**
 * Visual-only cell factory for the front layer.
 *
 * Returns appearance props (color, border, icon, aria-label) without any
 * drag interaction, so the same factory can drive both the interactive
 * board (via `getFrontProps`) and non-interactive contexts like the
 * info-modal example animation.
 */
export function getCellVisualProps(getters: Getters, skipTransition?: boolean) {
    const { getColor, getBorder } = getters;

    return (row: number, col: number) => {
        const style = getBorder(row, col);
        const { front, isLit } = getColor(row, col);

        return {
            children: ICON,
            backgroundColor: front,
            color: front,
            style,
            ...(skipTransition ? { transition: 'none' } : {}),
            'aria-label': `Light at row ${String(row + 1)}, column ${String(col + 1)}, currently ${isLit ? 'lit' : 'unlit'}`,
        };
    };
}

/**
 * Drag-enhanced cell factory for the interactive front layer.
 *
 * Merges drag interaction props on top of the visual props from
 * `getCellVisualProps`, adding hover behavior and pointer event handlers.
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
    const visualFactory = getCellVisualProps(getters, skipTransition);
    const { getColor } = getters;

    return (row: number, col: number) => {
        const visual = visualFactory(row, col);
        const { back } = getColor(row, col);
        const pos = getPosKey(row, col);
        const dragProps = getDragProps(pos);

        return {
            ...dragProps,
            ...visual,
            sx: {
                position: 'relative',
                ...dragProps.sx,
                '&:hover': {
                    cursor: 'pointer',
                    color: back,
                },
                '&:focus-visible': FOCUS_VISIBLE_SX,
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
