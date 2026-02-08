import { createTheme } from '@mui/material/styles';
/**
 * Theme configuration for the website
 * Centralizes colors, typography, spacing, and animations for consistent design
 */

interface ColorPalette {
    main: string;
    light: string;
    dark: string;
}

interface SurfaceColors {
    background: string;
    elevated: string;
    glass: string;
    success: string;
    warning: string;
    error: string;
}

interface TextColors {
    primary: string;
    secondary: string;
}

interface BorderColors {
    subtle: string;
}

interface InteractiveColors {
    hover: string;
    focus: string;
    selected: string;
    disabled: string;
    disabledText: string;
    selection: string;
    selectionText: string;
}

interface DataColors {
    green: string;
    amber: string;
    red: string;
}

interface Colors {
    primary: ColorPalette;
    surface: SurfaceColors;
    text: TextColors;
    border: BorderColors;
    interactive: InteractiveColors;
    data: DataColors;
}

interface FontFamily {
    primary: string;
}

interface FontSizes {
    display: string;
    h1: string;
    h2: string;
    subheading: string;
    body: string;
    caption: string;
}

interface FontWeights {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
}

interface Typography {
    fontFamily: FontFamily;
    fontSize: FontSizes;
    fontWeight: FontWeights;
}

interface Padding {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

interface BorderRadius {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
}

interface Margin {
    sm: string;
    md: string;
    lg: string;
}

interface MaxWidth {
    sm: string;
    md: string;
    lg: string;
}

interface Spacing {
    padding: Padding;
    borderRadius: BorderRadius;
    margin: Margin;
    maxWidth: MaxWidth;
}

interface Shadows {
    sm: string;
    md: string;
    lg: string;
    text: string;
}

interface AnimationPresets {
    focus: {
        boxShadow: string;
    };
    glass: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
    };
    glassSoft: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
    };
}

interface Animations {
    transition: string;
    transitions: {
        standard: string;
        smooth: string;
        fast: string;
    };
    durations: {
        short: number;
        standard: number;
        long: number;
        stagger: number;
        menu: number;
    };
    presets: AnimationPresets;
}

interface ZIndex {
    base: number;
    header: number;
    navigation: number;
    modal: number;
    tooltip: number;
}

interface ComponentVariants {
    card: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
        borderRadius: string;
        height: string;
        display: string;
        flexDirection: string;
        transition: string;
    };
    badge: {
        fontSize: string;
        padding: string;
        textTransform: string;
        letterSpacing: string;
    };
    badgeSmall: {
        fontSize: string;
        padding: string;
        textTransform: string;
        letterSpacing: string;
    };
    badgeContainer: {
        borderRadius: string;
        display: string;
        padding: string;
    };
    interactiveCard: {
        backgroundColor: string;
        backdropFilter: string;
        border: string;
        borderRadius: string;
        height: string;
        display: string;
        flexDirection: string;
        transition: string;
        cursor: string;
        '&:hover': {
            backgroundColor: string;
            transform: string;
        };
        '&:focus': {
            outline: string;
            boxShadow: string;
        };
    };
    flexCenter: {
        display: string;
        alignItems: string;
        justifyContent: string;
    };
}

interface ThemeLayout extends Layout {
    zIndex: ZIndex;
}

// Palette Definitions
const DARK_COLORS = {
    background: 'hsl(0, 0%, 3%)',
    elevated: 'hsl(0, 0%, 8%)',
    glass: 'hsla(0, 0%, 8%, 0.85)',
    textPrimary: 'hsl(0, 0%, 98%)',
    textSecondary: 'hsl(0, 0%, 80%)',
    border: 'hsl(0, 0%, 18%)',
    interactiveHover: 'hsla(0, 0%, 80%, 0.08)',
    interactiveDisabled: 'hsla(0, 0%, 100%, 0.05)',
    interactiveDisabledText: 'hsla(0, 0%, 100%, 0.3)',
    selectionBackground: 'hsla(217, 91%, 60%, 0.2)',
    selectionText: 'hsl(0, 0%, 98%)',
    textShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
};

const LIGHT_COLORS = {
    background: 'hsl(0, 0%, 98%)',
    elevated: 'hsl(0, 0%, 94%)',
    glass: 'hsla(0, 0%, 94%, 0.85)',
    textPrimary: 'hsl(0, 0%, 10%)',
    textSecondary: 'hsl(0, 0%, 30%)',
    border: 'hsl(0, 0%, 85%)',
    interactiveHover: 'hsla(0, 0%, 10%, 0.08)',
    interactiveDisabled: 'hsla(0, 0%, 0%, 0.05)',
    interactiveDisabledText: 'hsla(0, 0%, 0%, 0.3)',
    selectionBackground: 'hsla(217, 91%, 60%, 0.25)',
    selectionText: 'hsl(0, 0%, 10%)',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
};

// Simplified Color System - Uses CSS variables for dynamic themes
export const COLORS: Colors = {
    primary: {
        main: 'hsl(217, 91%, 60%)',
        light: 'hsl(217, 91%, 70%)',
        dark: 'hsl(217, 91%, 45%)',
    },
    surface: {
        background: 'var(--background)',
        elevated: 'var(--elevated)',
        glass: 'var(--glass)',
        success: 'rgba(76, 175, 80, 0.05)',
        warning: 'rgba(255, 193, 7, 0.05)',
        error: 'rgba(239, 83, 80, 0.05)',
    },
    text: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
    },
    border: {
        subtle: 'var(--border)',
    },
    interactive: {
        hover: 'var(--interactive-hover)',
        focus: `hsla(217, 91%, 60%, 0.15)`,
        selected: `hsla(217, 91%, 60%, 0.1)`,
        disabled: 'var(--interactive-disabled)',
        disabledText: 'var(--interactive-disabled-text)',
        selection: 'var(--selection-background)',
        selectionText: 'var(--selection-text)',
    },
    data: {
        green: 'hsl(141, 64%, 49%)',
        amber: 'hsl(34, 95%, 58%)',
        red: 'hsl(0, 78%, 62%)',
    },
};

export const TYPOGRAPHY: Typography = {
    fontFamily: {
        primary:
            '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
        display: 'clamp(2.5rem, 6vw, 4rem)',
        h1: 'clamp(2rem, 4vw, 3rem)',
        h2: 'clamp(1.5rem, 3vw, 2rem)',
        subheading: 'clamp(1.125rem, 2vw, 1.375rem)',
        body: 'clamp(0.875rem, 1.5vw, 1rem)',
        caption: 'clamp(0.75rem, 1vw, 0.875rem)',
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

interface Layout {
    headerHeight: {
        xs: number;
        md: number;
    };
}

export const LAYOUT: ThemeLayout = {
    headerHeight: {
        xs: 56,
        md: 80,
    },
    zIndex: {
        base: 0,
        header: 1100,
        navigation: 1000,
        modal: 1300,
        tooltip: 1500,
    },
};

export const SPACING: Spacing = {
    padding: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
    },
    borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        full: '9999px',
    },
    margin: {
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
    },
    maxWidth: {
        sm: '50rem',
        md: '64rem',
        lg: '80rem',
    },
};

export const SHADOWS: Shadows = {
    sm: '0 1px 4px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.2)',
    lg: '0 8px 24px rgba(0,0,0,0.2)',
    text: 'var(--text-shadow)',
};

export const ANIMATIONS: Animations = {
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transitions: {
        standard: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    durations: {
        short: 200,
        standard: 400,
        long: 1000,
        stagger: 150,
        menu: 300,
    },
    presets: {
        focus: {
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
        glass: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(24px) saturate(180%)',
            border: `1px solid ${COLORS.border.subtle}`,
        },
        glassSoft: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(8px) saturate(140%)',
            border: `1px solid ${COLORS.border.subtle}`,
        },
    },
};

export const BASE_CARD = {
    backgroundColor: COLORS.surface.glass,
    backdropFilter: 'blur(24px) saturate(180%)',
    border: `1px solid ${COLORS.border.subtle}`,
    borderRadius: SPACING.borderRadius.lg,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: ANIMATIONS.transition,
};

export const COMPONENT_VARIANTS: ComponentVariants = {
    card: BASE_CARD,
    interactiveCard: {
        ...BASE_CARD,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: COLORS.interactive.selected,
            transform: 'translateY(-2px)',
        },
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
    },
    badge: {
        fontSize: '0.7rem',
        padding: '4px 12px',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
    },
    badgeSmall: {
        fontSize: '0.65rem',
        padding: '2px 8px',
        textTransform: 'uppercase',
        letterSpacing: '0.02em',
    },
    badgeContainer: {
        borderRadius: SPACING.borderRadius.full,
        display: 'inline-block',
        padding: '4px 12px',
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

/**
 * Creates the MUI theme for the application
 */
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
