/**
 * Extracted style constants for the Navigation component.
 * Separates positioning and layout styles from the component file.
 */

import type { SxProps, Theme } from '@mui/material';

import {
    SPACING,
    SHADOWS,
    COMPONENT_VARIANTS,
    LAYOUT,
    ANIMATIONS,
} from '@/config/theme';

/** Fixed bottom-center Paper container for game controls. */
export const navigationPaperSx: SxProps<Theme> = {
    transform: 'translateX(-50%)',
    position: 'absolute',
    bottom: SPACING.padding.xl,
    left: '50%',
    zIndex: LAYOUT.zIndex.navigation,
    ...ANIMATIONS.presets.glass,
    borderRadius: SPACING.borderRadius.lg,
    boxShadow: SHADOWS.lg,
    padding: `${SPACING.padding.sm} ${SPACING.padding.lg}`,
};

/** Inner grid container for navigation items. */
export const navigationGridSx: SxProps<Theme> = {
    ...COMPONENT_VARIANTS.flexCenter,
    flexWrap: 'nowrap',
    minWidth: 0,
};
