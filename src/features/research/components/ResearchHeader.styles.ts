/**
 * Extracted style constants for the `ResearchHeader` component.
 * Keeps the component file focused on structure while allowing
 * independent style adjustments.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

const backButtonBase: SxProps<Theme> = {
    color: COLORS.text.secondary,
    padding: 0,
    minWidth: 0,
    '&:hover': {
        backgroundColor: 'transparent',
        color: COLORS.primary.main,
    },
    alignSelf: { xs: 'center', sm: 'flex-end' },
    textTransform: 'none',
    fontSize: '0.8rem',
};

/** Back button with no bottom margin (used in mobile back-button mode). */
export const backButtonFlushSx: SxProps<Theme> = {
    ...backButtonBase,
    marginBottom: 0,
};

/** Back button pulled up slightly (used alongside the title row). */
export const backButtonPulledSx: SxProps<Theme> = {
    ...backButtonBase,
    marginBottom: -2,
};

/** Subtitle typography shown when not in mobile back-button mode. */
export const subtitleSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.subheading,
    textAlign: {
        xs: 'center',
        md: 'right',
    },
    whiteSpace: {
        xs: 'normal',
        md: 'nowrap',
    },
    display: { xs: 'none', sm: 'block' },
};

/** Outermost column container for the header area. */
export const headerContainerSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', md: 'flex-start' },
    gap: 2,
    marginBottom: { xs: 3, md: 4 },
    width: '100%',
};

/** Row that holds the title and subtitle side by side. */
export const headerRowSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: {
        xs: 'center',
        md: 'baseline',
    },
    width: '100%',
};

/** Main h1 title text. */
export const headerTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.h2,
    textAlign: { xs: 'center', md: 'left' },
};
