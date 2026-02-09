/**
 * Typography definitions for fonts, sizes, and weights
 */

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

export interface Typography {
    fontFamily: FontFamily;
    fontSize: FontSizes;
    fontWeight: FontWeights;
}

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
