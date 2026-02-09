/**
 * Color palette definitions for light and dark modes
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

export interface Colors {
    primary: ColorPalette;
    surface: SurfaceColors;
    text: TextColors;
    border: BorderColors;
    interactive: InteractiveColors;
    data: DataColors;
}

// Palette Definitions
export const DARK_COLORS = {
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

export const LIGHT_COLORS = {
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
