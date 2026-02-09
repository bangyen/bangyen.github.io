/**
 * Material-UI theme factory
 * Creates the MUI theme configuration for the application
 */

import { createTheme } from '@mui/material/styles';
import { COLORS, DARK_COLORS, LIGHT_COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { SPACING } from './spacing';
import { ANIMATIONS } from './animations';

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
            borderRadius: parseInt(SPACING.borderRadius.md),
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
                        // Research-specific glass variables
                        '--glass-very-subtle':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.01)'
                                : 'rgba(0, 0, 0, 0.02)',
                        '--glass-subtle':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.02)'
                                : 'rgba(0, 0, 0, 0.04)',
                        '--glass-transparent':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.03)'
                                : 'rgba(0, 0, 0, 0.06)',
                        '--glass-slight':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.08)',
                        '--glass-medium':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.12)',
                        '--glass-strong':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'rgba(0, 0, 0, 0.16)',
                        '--glass-dark':
                            mode === 'dark'
                                ? 'rgba(0, 0, 0, 0.2)'
                                : 'rgba(0, 0, 0, 0.05)',
                        '--research-border-subtle':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.08)',
                        '--research-border-very-subtle':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.03)'
                                : 'rgba(0, 0, 0, 0.04)',
                        // Data-specific mode-aware highlights
                        '--research-cyan-bg':
                            mode === 'dark'
                                ? 'rgba(0, 184, 212, 0.1)'
                                : 'rgba(0, 184, 212, 0.08)',
                        '--research-cyan-border':
                            mode === 'dark'
                                ? 'rgba(0, 184, 212, 0.2)'
                                : 'rgba(0, 184, 212, 0.15)',
                        '--research-green-bg':
                            mode === 'dark'
                                ? 'rgba(0, 200, 83, 0.1)'
                                : 'rgba(0, 200, 83, 0.08)',
                        '--research-green-border':
                            mode === 'dark'
                                ? 'rgba(0, 200, 83, 0.2)'
                                : 'rgba(0, 200, 83, 0.15)',
                        '--research-amber-bg':
                            mode === 'dark'
                                ? 'rgba(255, 193, 7, 0.1)'
                                : 'rgba(255, 193, 7, 0.08)',
                        '--research-amber-border':
                            mode === 'dark'
                                ? 'rgba(255, 193, 7, 0.2)'
                                : 'rgba(255, 193, 7, 0.15)',
                        // Slant Ghost Mode (Calculator) variables
                        '--slant-ghost-border':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.1)',
                        '--slant-ghost-bg-subtle':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.02)'
                                : 'rgba(0, 0, 0, 0.02)',
                        '--slant-ghost-bg-hover':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'rgba(0, 0, 0, 0.05)',
                        '--slant-ghost-dashed-border':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'rgba(0, 0, 0, 0.15)',
                        '--slant-ghost-hint-bg':
                            mode === 'dark'
                                ? 'hsl(217, 50%, 8%)'
                                : 'hsl(217, 30%, 94%)',
                        '--slant-ghost-hint-border':
                            mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.3)'
                                : 'rgba(0, 0, 0, 0.1)',
                        '--slant-ghost-hint-text':
                            mode === 'dark' ? '#fff' : 'hsl(217, 91%, 30%)',
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
