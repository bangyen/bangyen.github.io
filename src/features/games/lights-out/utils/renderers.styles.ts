/**
 * Extracted style constants for the Lights Out cell renderers.
 * Keeps the renderer functions focused on prop assembly.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/** Circular indicator dot centered inside each cell. */
export const iconSx: SxProps<Theme> = {
    width: '45%',
    height: '45%',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
};

/**
 * Focus-visible styles for interactive Lights Out cells.
 *
 * Uses a ::after pseudo-element so the focus ring is always fully
 * rounded (via --cell-radius) without altering the cell's own
 * border-radius, which may be flattened to merge with neighbors.
 * The cell is elevated above siblings so the ring is never clipped.
 */
export const FOCUS_VISIBLE_SX: SxProps<Theme> = {
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
