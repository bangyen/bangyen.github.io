/**
 * Extracted style constants for the `ResearchViewSelector` component.
 * Separates visual styling from component logic so each can evolve
 * independently.
 */

import type { SxProps, Theme } from '@mui/material';

import { RESEARCH_STYLES } from '../config/constants';

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    ANIMATIONS,
} from '@/config/theme';

/** Outer wrapper that adds bottom margin and constrains width. */
export const selectorContainerSx: SxProps<Theme> = {
    marginBottom: 3,
    width: '100%',
    boxSizing: 'border-box',
};

/**
 * Returns the grid container styles.
 *
 * @param columnCount - Number of view types to display (capped at 4).
 */
export const getGridSx = (columnCount: number): SxProps<Theme> => ({
    display: 'grid',
    gridTemplateColumns: {
        xs: 'repeat(2, minmax(0, 1fr))',
        md: `repeat(${Math.min(columnCount, 4).toString()}, 1fr)`,
    },
    gap: 1.5,
    width: '100%',
    margin: 0,
});

/**
 * Returns the toggle-button styles, varying colour and background
 * depending on whether the button represents the active view.
 */
export const getButtonSx = (isActive: boolean): SxProps<Theme> => ({
    width: '100%',
    color: isActive ? 'inherit' : COLORS.text.secondary,
    backgroundColor: isActive ? COLORS.primary.main : COLORS.surface.elevated,
    '&.MuiButton-root': {
        color: isActive ? COLORS.text.primary : COLORS.text.secondary,
    },
    borderColor: COLORS.border.subtle,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: SPACING.borderRadius.lg,
    minHeight: RESEARCH_STYLES.LAYOUT.BUTTON_HEIGHT,
    padding: RESEARCH_STYLES.LAYOUT.INNER_PADDING_SM,
    fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_SM,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: ANIMATIONS.transitions.standard,
    '&:hover': {
        backgroundColor: isActive
            ? COLORS.primary.dark
            : COLORS.interactive.hover,
        transform: 'translateY(-1px)',
        boxShadow: SHADOWS.sm,
    },
});
