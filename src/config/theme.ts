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
}

interface Animations {
    transition: string;
    presets: AnimationPresets;
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

// Simplified Color System - Consolidated from BASE_COLORS and COLORS
export const COLORS: Colors = {
    primary: {
        main: 'hsl(217, 91%, 60%)',
        light: 'hsl(217, 91%, 70%)',
        dark: 'hsl(217, 91%, 45%)',
    },
    surface: {
        background: 'hsl(0, 0%, 3%)',
        elevated: 'hsl(0, 0%, 8%)',
        glass: 'hsla(0, 0%, 8%, 0.85)',
        success: 'rgba(76, 175, 80, 0.05)',
        warning: 'rgba(255, 193, 7, 0.05)',
        error: 'rgba(239, 83, 80, 0.05)',
    },
    text: {
        primary: 'hsl(0, 0%, 98%)',
        secondary: 'hsl(0, 0%, 80%)',
    },
    border: {
        subtle: 'hsl(0, 0%, 18%)',
    },
    interactive: {
        hover: `hsla(0, 0%, 80%, 0.08)`,
        focus: `hsla(217, 91%, 60%, 0.15)`,
        selected: `hsla(217, 91%, 60%, 0.1)`,
        disabled: `hsla(0, 0%, 100%, 0.05)`,
        disabledText: `hsla(0, 0%, 100%, 0.3)`,
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

export const SPACING: Spacing = {
    padding: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
    },
    borderRadius: {
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
    text: '0 0 20px rgba(0,0,0,0.5)',
};

export const ANIMATIONS: Animations = {
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    presets: {
        focus: {
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
        glass: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(24px) saturate(180%)',
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
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

/**
 * Creates the MUI theme for the application
 */
export function createAppTheme() {
    return createTheme({
        palette: {
            primary: {
                main: COLORS.primary.main,
                light: COLORS.primary.light,
                dark: COLORS.primary.dark,
            },
            secondary: {
                main: COLORS.text.secondary,
            },
            background: {
                default: COLORS.surface.background,
                paper: COLORS.surface.elevated,
            },
            text: {
                primary: COLORS.text.primary,
                secondary: COLORS.text.secondary,
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
                        color: COLORS.text.primary,
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
                        backgroundColor: 'hsla(0, 0%, 3%, 0.85)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                    },
                },
            },
        },
    });
}
