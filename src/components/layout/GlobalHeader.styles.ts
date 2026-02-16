/**
 * Extracted style constants for the `GlobalHeader` component.
 * Separates layout chrome from the component's button composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS, LAYOUT } from '@/config/theme';

/**
 * Returns the root header bar styles. The background switches between
 * transparent and the surface colour depending on the page context.
 */
export const getHeaderSx = (transparent: boolean): SxProps<Theme> => ({
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    flexShrink: 0,
    height: {
        xs: LAYOUT.headerHeight.xs,
        md: LAYOUT.headerHeight.md,
    },
    paddingX: { xs: 2, md: 4 },
    paddingY: { xs: 1, md: 1.5 },
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    background: transparent ? 'transparent' : COLORS.surface.background,
});

/** Left-hand slot that holds the project menu button. */
export const headerLeftSlotSx: SxProps<Theme> = {
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
};

/** Right-hand slot that holds theme toggle and icon buttons. */
export const headerRightSlotSx: SxProps<Theme> = {
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    minWidth: 0,
};

/** Hover style shared by all header icon buttons. */
export const iconButtonHoverSx: SxProps<Theme> = {
    '&:hover': {
        backgroundColor: COLORS.interactive.hover,
    },
};
