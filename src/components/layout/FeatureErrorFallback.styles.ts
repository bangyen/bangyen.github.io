/**
 * Extracted style constants for the FeatureErrorFallback component.
 * Separates layout and typography styles from the component file.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS, SPACING } from '@/config/theme';

/** Full-viewport centering container. */
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

/** Reset action button. */
export const errorButtonSx: SxProps<Theme> = {
    borderRadius: SPACING.borderRadius.md,
    textTransform: 'none',
};
