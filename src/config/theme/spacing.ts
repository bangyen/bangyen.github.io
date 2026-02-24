/**
 * Spacing, layout, and structural definitions
 */

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

export interface Spacing {
    padding: Padding;
    borderRadius: BorderRadius;
    margin: Margin;
    maxWidth: MaxWidth;
}

interface ZIndex {
    base: number;
    header: number;
    navigation: number;
    modal: number;
    tooltip: number;
}

interface Layout {
    headerHeight: {
        xs: number;
        md: number;
    };
}

export interface ThemeLayout extends Layout {
    zIndex: ZIndex;
}

export interface Shadows {
    sm: string;
    md: string;
    lg: string;
    text: string;
}

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

export const SHADOWS: Shadows = {
    sm: '0 1px 4px rgba(0,0,0,0.2)',
    md: '0 4px 12px rgba(0,0,0,0.2)',
    lg: '0 8px 24px rgba(0,0,0,0.2)',
    text: 'var(--text-shadow)',
};
