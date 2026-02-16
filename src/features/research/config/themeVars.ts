/**
 * Research-specific CSS custom properties and reusable sx constants.
 *
 * These are glass / border / accent variables consumed exclusively by
 * research pages.  They live here so the core MUI theme file stays
 * focused on application-wide design tokens.
 */

import { COLORS } from '@/config/theme/colors';
import type { CssVarDefinition } from '@/config/theme/cssVars';
import { TYPOGRAPHY } from '@/config/theme/typography';

/** Declarative research CSS variable definitions (light/dark pairs). */
export const RESEARCH_CSS_VARS: readonly CssVarDefinition[] = [
    // Glass intensity scale
    {
        name: '--glass-very-subtle',
        light: 'rgba(0, 0, 0, 0.02)',
        dark: 'rgba(255, 255, 255, 0.01)',
    },
    {
        name: '--glass-subtle',
        light: 'rgba(0, 0, 0, 0.04)',
        dark: 'rgba(255, 255, 255, 0.02)',
    },
    {
        name: '--glass-transparent',
        light: 'rgba(0, 0, 0, 0.06)',
        dark: 'rgba(255, 255, 255, 0.03)',
    },
    {
        name: '--glass-slight',
        light: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(255, 255, 255, 0.05)',
    },
    {
        name: '--glass-medium',
        light: 'rgba(0, 0, 0, 0.12)',
        dark: 'rgba(255, 255, 255, 0.1)',
    },
    {
        name: '--glass-strong',
        light: 'rgba(0, 0, 0, 0.16)',
        dark: 'rgba(255, 255, 255, 0.2)',
    },
    {
        name: '--glass-dark',
        light: 'rgba(0, 0, 0, 0.05)',
        dark: 'rgba(0, 0, 0, 0.2)',
    },

    // Borders
    {
        name: '--research-border-subtle',
        light: 'rgba(0, 0, 0, 0.08)',
        dark: 'rgba(255, 255, 255, 0.05)',
    },
    {
        name: '--research-border-very-subtle',
        light: 'rgba(0, 0, 0, 0.04)',
        dark: 'rgba(255, 255, 255, 0.03)',
    },

    // Data-specific mode-aware highlights
    {
        name: '--research-cyan-bg',
        light: 'rgba(0, 184, 212, 0.08)',
        dark: 'rgba(0, 184, 212, 0.1)',
    },
    {
        name: '--research-cyan-border',
        light: 'rgba(0, 184, 212, 0.15)',
        dark: 'rgba(0, 184, 212, 0.2)',
    },
    {
        name: '--research-green-bg',
        light: 'rgba(0, 200, 83, 0.08)',
        dark: 'rgba(0, 200, 83, 0.1)',
    },
    {
        name: '--research-green-border',
        light: 'rgba(0, 200, 83, 0.15)',
        dark: 'rgba(0, 200, 83, 0.2)',
    },
    {
        name: '--research-amber-bg',
        light: 'rgba(255, 193, 7, 0.08)',
        dark: 'rgba(255, 193, 7, 0.1)',
    },
    {
        name: '--research-amber-border',
        light: 'rgba(255, 193, 7, 0.15)',
        dark: 'rgba(255, 193, 7, 0.2)',
    },
];

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
