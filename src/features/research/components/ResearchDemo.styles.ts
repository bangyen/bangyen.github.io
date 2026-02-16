/**
 * Extracted style constants for the `ResearchDemo` layout container.
 * Kept separate so the component file focuses on composition and the
 * styles can be tweaked independently.
 */

import type { SxProps, Theme } from '@mui/material';

import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';

/** Outer Grid container that fills the page and constrains content width. */
export const demoContainerSx: SxProps<Theme> = {
    position: 'relative',
    padding: SPACING.padding.md,
    paddingTop: SPACING.padding.xl,
    paddingBottom: {
        xs: SPACING.padding.md,
        md: 0,
    },
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden',
};

/** Inner Grid item that centres content vertically. */
export const demoContentGridSx: SxProps<Theme> = {
    ...COMPONENT_VARIANTS.flexCenter,
    flexDirection: 'column',
    zIndex: 1,
    padding: 0,
    minHeight: 0,
};

/** Content wrapper that constrains child width and adds horizontal padding. */
export const demoContentBoxSx: SxProps<Theme> = {
    textAlign: 'center',
    maxWidth: SPACING.maxWidth.md,
    width: '100%',
    padding: {
        xs: '0 0.5rem',
        md: '0 2rem',
    },
    boxSizing: 'border-box',
    overflow: 'hidden',
};
