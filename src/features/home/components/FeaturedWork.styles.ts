/**
 * Extracted style constants for the `FeaturedWork` component.
 * Keeps the component file focused on structure and card rendering.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Section heading that reads "Featured Work". */
export const sectionTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: 6,
};

/** Responsive 1/2-column grid for publication and project cards. */
export const cardGridSx: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, 1fr)',
    },
    gap: 4,
};
