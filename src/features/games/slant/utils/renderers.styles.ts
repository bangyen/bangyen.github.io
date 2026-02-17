/**
 * Extracted style constants and builders for the Slant cell renderers.
 * Keeps the renderer functions focused on prop assembly rather than
 * style definition.
 */

import type { SxProps, Theme } from '@mui/material';

import { SLANT_STYLES } from '../config/constants';

import { COLORS, ANIMATIONS } from '@/config/theme';

/** Sx for a diagonal slash line inside a Slant cell. */
export function getSlashLineSx(
    angle: string,
    size: number,
    isError: boolean,
): SxProps<Theme> {
    return {
        position: 'absolute',
        width: '115%',
        height: `${String(Math.max(2, size))}px`,
        backgroundColor: isError ? COLORS.data.red : COLORS.text.primary,
        borderRadius: '99px',
        top: '50%',
        left: '50%',
        '--slant-base-transform': `translate(-50%, -50%) rotate(${angle})`,
        transform: 'var(--slant-base-transform)',
        boxShadow: SLANT_STYLES.SHADOWS.LINE,
        transition: ANIMATIONS.transition,
        animation: SLANT_STYLES.ANIMATIONS.POP_IN_STYLE,
        pointerEvents: 'none',
    };
}

/** Base sx for the back (slash) cell visual layer. */
export const backCellVisualSx: SxProps<Theme> = {
    border: `2px solid ${COLORS.border.subtle}`,
    position: 'relative',
};

/** Container for the slash line(s) within a cell. */
export const slashContainerSx: SxProps<Theme> = {
    width: '100%',
    height: '100%',
    position: 'relative',
};

/** Front overlay sx — transparent to pointer events. */
export const frontOverlaySx: SxProps<Theme> = {
    pointerEvents: 'none',
};

/** Interactive additions for drag-enhanced back cells. */
export const INTERACTIVE_BACK_CELL_SX = {
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: COLORS.interactive.hover,
    },
} as const;

/**
 * Sx for the number hint bubble in the front layer.
 *
 * Dynamic properties (border color, text color, shadow) depend on
 * per-cell error/satisfied state, so this is a builder function.
 */
export function getNumberBubbleSx(params: {
    numberSize: number;
    hasError: boolean;
    isSatisfied: boolean;
    isVisible: boolean;
}): SxProps<Theme> {
    const { numberSize, hasError, isSatisfied, isVisible } = params;

    return {
        borderRadius: '50%',
        backgroundColor: hasError ? COLORS.data.red : COLORS.surface.background,
        border: isVisible
            ? `2px solid ${
                  hasError
                      ? COLORS.data.red
                      : isSatisfied
                        ? 'transparent'
                        : COLORS.border.subtle
              }`
            : 'none',
        fontSize: `${String(numberSize * 0.5)}rem`,
        fontWeight: '800',
        color: hasError
            ? SLANT_STYLES.COLORS.WHITE
            : isSatisfied
              ? COLORS.interactive.disabledText
              : COLORS.text.primary,
        boxShadow:
            isSatisfied && !hasError ? 'none' : SLANT_STYLES.SHADOWS.HINT,
        zIndex: 5,
        opacity: isVisible ? 1 : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        transform: hasError
            ? 'scale(1.15)'
            : isSatisfied
              ? 'scale(0.95)'
              : 'scale(1)',
        width: `${String(numberSize)}rem`,
        height: `${String(numberSize)}rem`,
    };
}
