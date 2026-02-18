/**
 * Style constants for the ErrorCard component and its full-page
 * centering wrapper, shared across all card-based error surfaces.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS, SPACING } from '@/config/theme';

/** Full-viewport centering container used by full-page error screens. */
export const errorContainerSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 4,
    minHeight: '100vh',
};

/** GlassCard wrapper for error content. */
export const errorCardSx: SxProps<Theme> = {
    p: 4,
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
};

/** Error title heading. */
export const errorTitleSx: SxProps<Theme> = {
    mb: 2,
    color: COLORS.text.primary,
    fontWeight: 'bold',
};

/** Error message body text. */
export const errorMessageSx: SxProps<Theme> = {
    mb: 3,
    color: COLORS.text.secondary,
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
};

/** Shared action button styling with a fixed width for visual consistency. */
export const errorButtonSx: SxProps<Theme> = {
    borderRadius: SPACING.borderRadius.md,
    textTransform: 'none',
    width: '180px',
};
