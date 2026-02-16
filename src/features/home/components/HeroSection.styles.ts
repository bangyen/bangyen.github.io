/**
 * Extracted style constants for the HeroSection landing area.
 * Follows the same pattern as ResearchControls.styles.ts so
 * the component file focuses on structure and content.
 */

import type { SxProps, Theme } from '@mui/material';

import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
    SHADOWS,
} from '@/config/theme';

/** "Hello, I'm" greeting label. */
export const heroGreetingSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    textAlign: { xs: 'center', md: 'left' },
    marginBottom: 3,
};

/** Full name heading. */
export const heroNameSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: {
        xs: 'clamp(2rem, 8vw, 2.5rem)',
        md: 'clamp(3rem, 6vw, 5rem)',
    },
    lineHeight: 1.4,
    letterSpacing: '0',
    marginBottom: 2,
    wordBreak: 'keep-all',
    hyphens: 'none',
    textAlign: { xs: 'center', md: 'left' },
};

/** Role / title subtitle. */
export const heroTitleSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: {
        xs: 'clamp(0.875rem, 4vw, 1.125rem)',
        md: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    },
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 4,
    lineHeight: 1.4,
    wordBreak: 'keep-all',
    hyphens: 'none',
    textAlign: { xs: 'center', md: 'left' },
};

/** Row containing the location icon + text. */
export const heroLocationRowSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'flex-start' },
    marginBottom: 4,
};

/** Location icon styling. */
export const heroLocationIconSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: '1.25rem',
};

/** Location text label. */
export const heroLocationTextSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
};

/** Wrapper for the CTA buttons row (desktop only). */
export const heroCtaRowSx: SxProps<Theme> = {
    display: { xs: 'none', md: 'flex' },
    gap: 2,
    flexWrap: 'wrap',
    justifyContent: { xs: 'center', md: 'flex-start' },
};

/** "View Work" pill button. */
export const heroCtaButtonSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: `${SPACING.padding.sm} ${SPACING.padding.md}`,
    backgroundColor: COLORS.interactive.selected,
    borderRadius: SPACING.borderRadius.full,
    transition: ANIMATIONS.transition,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: COLORS.interactive.focus,
        transform: 'scale(1.02) translateY(-1px)',
        boxShadow: SHADOWS.text,
    },
    '&:focus-visible': {
        outline: `2px solid ${COLORS.primary.main}`,
        outlineOffset: '2px',
    },
};

/** Text inside the CTA pill. */
export const heroCtaTextSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.body,
};

/** Arrow icon inside the CTA pill. */
export const heroCtaArrowSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontSize: '1rem',
};

/** Right-column fade-in wrapper. */
export const heroRightColumnSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
};
