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
}

interface DataColors {
    green: string;
    amber: string;
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
    md: string;
    lg: string;
}

interface Spacing {
    padding: Padding;
    borderRadius: BorderRadius;
    margin: Margin;
    maxWidth: MaxWidth;
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
    },
    data: {
        green: 'hsl(141, 64%, 49%)',
        amber: 'hsl(34, 95%, 58%)',
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
        md: '64rem',
        lg: '80rem',
    },
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

