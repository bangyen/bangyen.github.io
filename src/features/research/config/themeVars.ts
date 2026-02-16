/**
 * Reusable sx constants for research page content sections.
 *
 * CSS variable definitions (glass, border, accent) now live in the
 * central theme layer at `@/config/theme/featureCssVars.ts` to avoid
 * a reverse dependency from the theme into this feature module.
 */

import { COLORS } from '@/config/theme/colors';
import { TYPOGRAPHY } from '@/config/theme/typography';

// ---------------------------------------------------------------------------
// Reusable sx constants for research page content sections.
// Centralises the Typography / Button styling that was previously
// repeated inline across every research page.
// ---------------------------------------------------------------------------

/** Section heading (`<Typography variant="h4">`). */
export const researchHeadingSx = {
    mb: 3,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
} as const;

/** Body paragraph (`<Typography variant="body1">`). */
export const researchBodySx = {
    lineHeight: 1.8,
    color: COLORS.text.secondary,
} as const;

/** Inline bold label (`<Box component="span">`). */
export const researchLabelSx = {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
} as const;

/** Outlined link button (`<Button variant="outlined">`). */
export const researchLinkButtonSx = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.primary,
    '&:hover': {
        borderColor: COLORS.primary.main,
        backgroundColor: COLORS.interactive.hover,
    },
} as const;

/** Table header cell. */
export const researchTableHeadCellSx = {
    color: COLORS.text.primary,
    fontWeight: 'bold',
} as const;

/** Table body cell. */
export const researchTableBodyCellSx = {
    color: COLORS.text.secondary,
} as const;
