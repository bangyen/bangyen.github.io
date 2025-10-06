/**
 * Theme configuration for the website
 * Centralizes colors, typography, spacing, and animations for consistent design
 */

// Alpha Values - Consolidated opacity constants for consistent transparency
export const ALPHA = {
    subtle: 0.1,
    hover: 0.08,
    pressed: 0.12,
    focus: 0.15,
    disabled: 0.3,
    glass: 0.85,
};

// Simplified Color System - Consolidated from BASE_COLORS and COLORS
export const COLORS = {
    // Brand Colors - Professional blue palette
    primary: {
        main: 'hsl(217, 91%, 60%)',
        light: 'hsl(217, 91%, 70%)',
        dark: 'hsl(217, 91%, 45%)',
    },
    // Semantic Surface Colors
    surface: {
        background: 'hsl(0, 0%, 3%)',
        elevated: 'hsl(0, 0%, 8%)',
        glass: `hsla(0, 0%, 8%, ${ALPHA.glass})`,
        subtle: 'hsl(0, 0%, 8%)',
    },
    // Text Colors - Simplified to 4 essential variants
    text: {
        primary: 'hsl(0, 0%, 98%)', // Main text
        secondary: 'hsl(0, 0%, 80%)', // Secondary text
        muted: 'hsl(0, 0%, 45%)', // Muted/disabled text
        accent: 'hsl(217, 91%, 60%)', // Accent/highlight text
    },
    // Border and Divider Colors
    border: {
        subtle: 'hsl(0, 0%, 18%)',
        primary: 'hsl(0, 0%, 30%)',
        interactive: 'hsl(217, 91%, 60%)',
    },
    // Interactive State Colors
    interactive: {
        hover: `hsla(0, 0%, 80%, ${ALPHA.hover})`,
        focus: `hsla(217, 91%, 60%, ${ALPHA.focus})`,
        selected: `hsla(217, 91%, 60%, ${ALPHA.subtle})`,
    },
    // Chart Colors
    data: {
        blue: 'hsl(217, 91%, 60%)',
        green: 'hsl(141, 64%, 49%)',
        amber: 'hsl(34, 95%, 58%)',
        red: 'hsl(0, 73%, 56%)',
    },
    // Game-specific colors
    game: {
        snakeBody: 'hsl(217, 91%, 45%)',
        snakeFood: 'hsl(217, 91%, 25%)',
    },
    // Shadows for Depth and Elevation
    shadows: {
        xs: '0 1px 2px hsla(0, 0%, 0%, 0.5)',
        sm: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
        md: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
        lg: '0 16px 64px hsla(0, 0%, 0%, 0.3)',
    },
};

// Modern Typography System - Enterprise-grade with professional hierarchy
export const TYPOGRAPHY = {
    // Main font stack: Inter (primary) + SF Pro Display (fallback)
    fontFamily: {
        primary:
            '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
        display:
            '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter", sans-serif',
    },
    // Simplified typography scale - 2 breakpoints, 7 size variants
    fontSize: {
        sm: {
            display: 'clamp(2.5rem, 5vw, 4rem)',
            h1: 'clamp(2.25rem, 4vw, 3.5rem)',
            h2: 'clamp(1.75rem, 3vw, 2.25rem)',
            h3: 'clamp(1.5rem, 2.5vw, 1.75rem)',
            subheading: 'clamp(1.125rem, 1.75vw, 1.375rem)',
            body: 'clamp(0.875rem, 1vw, 1rem)',
            caption: 'clamp(0.75rem, 0.8vw, 0.875rem)',
        },
        md: {
            display: 'clamp(3rem, 6vw, 5rem)',
            h1: 'clamp(3rem, 5vw, 4.5rem)',
            h2: 'clamp(2rem, 4vw, 3rem)',
            h3: 'clamp(1.75rem, 3vw, 2.25rem)',
            subheading: 'clamp(1.25rem, 2vw, 1.5rem)',
            body: 'clamp(1rem, 1vw, 1.125rem)',
            caption: 'clamp(0.875rem, 0.8vw, 1rem)',
        },
    },
    // Essential font weights - only the ones actually used
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
    },
    // Improved line heights for optical balance
    lineHeight: {
        tight: 1.1,
        snug: 1.2,
        normal: 1.4,
        relaxed: 1.5,
        loose: 1.625,
        prose: 1.7,
    },
    // Professional letter spacing for enhanced readability
    letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
    },
};

// Simplified Spacing System - 8pt grid with essential values only
export const SPACING = {
    // 8pt grid system for consistent spacing
    unit: 8,
    // Responsive padding - only the most commonly used sizes
    padding: {
        xs: 'clamp(1rem, 4vw, 1.5rem)',
        sm: 'clamp(1.5rem, 5vw, 2rem)',
        md: 'clamp(2rem, 6vw, 3rem)',
    },
    // Responsive margin - only the most commonly used sizes
    margin: {
        xs: 'clamp(0.5rem, 2vw, 1rem)',
        sm: 'clamp(1rem, 3vw, 1.5rem)',
        md: 'clamp(1.5rem, 4vw, 2.5rem)',
        section: 'clamp(3rem, 8vw, 6rem)',
    },
    // Essential border radius values
    borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        full: '9999px',
    },
    // Essential container widths
    maxWidth: {
        xs: 'clamp(16rem, 90vw, 24rem)',
        md: 'clamp(48rem, 90vw, 64rem)',
        lg: 'clamp(60rem, 90vw, 80rem)',
        wide: '56rem',
    },
    // Component heights
    height: {
        scrollable: '60px',
        scrollbar: '8px',
    },
    // Essential component spacing - consolidated from multiple similar values
    components: {
        card: {
            padding: '24px',
        },
        page: {
            padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            paddingVertical: { xs: '1rem 0', sm: '1.5rem 0', md: '2rem 0' },
        },
        section: {
            marginBottom: 3,
        },
    },
    // Essential grid patterns
    grid: {
        full: { xs: 12, sm: 12 },
        half: { xs: 12, sm: 6 },
    },
    // Essential layout patterns
    layout: {
        standardSpacing: 3,
        containerSpacing: { xs: 4, md: 8 },
    },
};

// Simplified Animation System - Only the animations actually being used
export const ANIMATIONS = {
    // Essential transitions
    transitions: {
        fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    // Hover states
    hover: {
        modern: {
            transform: 'scale(1.02) translateY(-1px)',
            transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: '0 4px 20px hsla(0, 0%, 0%, 0.25)',
        },
    },
    // Focus states
    focus: {
        ring: {
            outline: 'none',
            boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
            transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
};

// Layout Constants
export const LAYOUT = {
    zIndex: {
        background: -2,
        content: 1,
        navigation: 1000,
        modal: 1300,
        tooltip: 1500,
    },
};
