/**
 * Material-UI theme factory
 * Creates the MUI theme configuration for the application
 */

import { createTheme } from '@mui/material/styles';

import { ANIMATIONS } from './animations';
import { COLORS, DARK_COLORS, LIGHT_COLORS } from './colors';
import { SPACING } from './spacing';
import { TYPOGRAPHY } from './typography';

import { getSlantGhostCssVars } from '@/features/games/slant/config/themeVars';
import { getResearchCssVars } from '@/features/research/config/themeVars';

export function createAppTheme(mode: 'light' | 'dark' = 'dark') {
    const palette = mode === 'light' ? LIGHT_COLORS : DARK_COLORS;

    return createTheme({
        palette: {
            mode,
            primary: {
                main: COLORS.primary.main,
                light: COLORS.primary.light,
                dark: COLORS.primary.dark,
            },
            secondary: {
                main: palette.textSecondary,
            },
            background: {
                default: palette.background,
                paper: palette.elevated,
            },
            text: {
                primary: palette.textPrimary,
                secondary: palette.textSecondary,
            },
        },
        typography: {
            fontFamily: TYPOGRAPHY.fontFamily.primary,
            h1: {
                fontSize: TYPOGRAPHY.fontSize.h1,
                fontWeight: TYPOGRAPHY.fontWeight.bold,
            },
            h2: {
                fontSize: TYPOGRAPHY.fontSize.h2,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
            },
            h3: {
                fontSize: TYPOGRAPHY.fontSize.subheading,
                fontWeight: TYPOGRAPHY.fontWeight.semibold,
            },
            body1: {
                fontSize: TYPOGRAPHY.fontSize.body,
                fontWeight: TYPOGRAPHY.fontWeight.normal,
            },
            body2: {
                fontSize: TYPOGRAPHY.fontSize.body,
                fontWeight: TYPOGRAPHY.fontWeight.normal,
            },
            caption: {
                fontSize: TYPOGRAPHY.fontSize.caption,
                fontWeight: TYPOGRAPHY.fontWeight.normal,
            },
        },
        shape: {
            borderRadius: Number.parseInt(SPACING.borderRadius.md),
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    ':root': {
                        '--background': palette.background,
                        '--elevated': palette.elevated,
                        '--glass': palette.glass,
                        '--text-primary': palette.textPrimary,
                        '--text-secondary': palette.textSecondary,
                        '--border': palette.border,
                        '--interactive-hover': palette.interactiveHover,
                        '--interactive-disabled': palette.interactiveDisabled,
                        '--interactive-disabled-text':
                            palette.interactiveDisabledText,
                        '--selection-background': palette.selectionBackground,
                        '--selection-text': palette.selectionText,
                        '--text-shadow': palette.textShadow,
                        '--primary-main': COLORS.primary.main,
                        '--primary-light': COLORS.primary.light,
                        '--primary-dark': COLORS.primary.dark,
                        // Feature-specific CSS variables
                        ...getResearchCssVars(mode),
                        ...getSlantGhostCssVars(mode),
                    },
                    body: {
                        transition:
                            'background-color 200ms ease, color 200ms ease',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        borderRadius: SPACING.borderRadius.md,
                        padding: `${SPACING.padding.xs} ${SPACING.padding.md}`,
                        transition: ANIMATIONS.transition,
                    },
                    contained: {
                        backgroundColor: COLORS.primary.main,
                        color: mode === 'light' ? '#fff' : COLORS.text.primary,
                        '&:hover': {
                            backgroundColor: COLORS.primary.light,
                            transform: 'translateY(-2px)',
                        },
                    },
                    outlined: {
                        borderColor: COLORS.border.subtle,
                        color: COLORS.text.primary,
                        '&:hover': {
                            borderColor: COLORS.primary.main,
                            backgroundColor: COLORS.interactive.hover,
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        color: COLORS.text.primary,
                        '&:hover': {
                            backgroundColor: COLORS.interactive.hover,
                        },
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: COLORS.surface.glass,
                        backdropFilter: 'blur(24px) saturate(180%)',
                        border: `1px solid ${COLORS.border.subtle}`,
                        borderRadius: SPACING.borderRadius.md,
                        color: COLORS.text.primary,
                        fontSize: TYPOGRAPHY.fontSize.caption,
                        padding: SPACING.padding.xs,
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: {
                        backgroundColor: COLORS.surface.glass,
                        backdropFilter: 'blur(24px) saturate(180%)',
                        border: `1px solid ${COLORS.border.subtle}`,
                        borderRadius: SPACING.borderRadius.sm,
                        color: COLORS.text.primary,
                        fontSize: TYPOGRAPHY.fontSize.caption,
                        height: 'auto',
                        padding: `0 ${SPACING.padding.sm}`,
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: COLORS.surface.glass,
                            backdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: SPACING.borderRadius.md,
                            '& fieldset': {
                                borderColor: COLORS.border.subtle,
                            },
                            '&:hover fieldset': {
                                borderColor: COLORS.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.primary.main,
                            },
                        },
                    },
                },
            },
            MuiToggleButton: {
                styleOverrides: {
                    root: {
                        color: COLORS.text.secondary,
                        borderColor: COLORS.border.subtle,
                        '&.Mui-selected': {
                            backgroundColor: COLORS.interactive.selected,
                            color: COLORS.text.primary,
                            '&:hover': {
                                backgroundColor: COLORS.interactive.selected,
                            },
                        },
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backgroundColor:
                            mode === 'dark'
                                ? 'hsla(0, 0%, 3%, 0.85)'
                                : 'hsla(0, 0%, 98%, 0.85)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                    },
                },
            },
        },
    });
}
