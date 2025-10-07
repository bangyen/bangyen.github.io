/**
 * Theme configuration for the website
 * Centralizes colors, typography, spacing, and animations for consistent design
 */

// Alpha Values - Consolidated opacity constants for consistent transparency

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
        glass: 'hsla(0, 0%, 8%, 0.85)',
    },
    // Text Colors - Simplified to 2 essential variants
    text: {
        primary: 'hsl(0, 0%, 98%)', // Main text
        secondary: 'hsl(0, 0%, 80%)', // Secondary text
    },
    // Border and Divider Colors
    border: {
        subtle: 'hsl(0, 0%, 18%)',
    },
    // Interactive State Colors
    interactive: {
        hover: `hsla(0, 0%, 80%, 0.08)`,
        focus: `hsla(217, 91%, 60%, 0.15)`,
        selected: `hsla(217, 91%, 60%, 0.1)`,
    },
    // Chart Colors - Essential data visualization colors
    data: {
        green: 'hsl(141, 64%, 49%)',
        amber: 'hsl(34, 95%, 58%)',
    },
};

// Modern Typography System - Enterprise-grade with professional hierarchy
export const TYPOGRAPHY = {
    // Main font stack: Inter (primary) + SF Pro Display (fallback)
    fontFamily: {
        primary:
            '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    },
    // Simplified typography scale - 6 essential sizes with responsive scaling
    fontSize: {
        display: 'clamp(2.5rem, 6vw, 4rem)', // Hero text
        h1: 'clamp(2rem, 4vw, 3rem)', // Page titles
        h2: 'clamp(1.5rem, 3vw, 2rem)', // Section headers
        subheading: 'clamp(1.125rem, 2vw, 1.375rem)', // Subsection headers
        body: 'clamp(0.875rem, 1.5vw, 1rem)', // Body text
        caption: 'clamp(0.75rem, 1vw, 0.875rem)', // Small text
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
};

// Simplified Spacing System - Only essential values actually used
export const SPACING = {
    // Systematic Spacing Scale - 4px base unit for consistency
    padding: {
        xs: '0.5rem', // 8px - mobile padding
        sm: '1rem', // 16px - small padding
        md: '1.5rem', // 24px - medium padding
        lg: '2rem', // 32px - large padding
        xl: '3rem', // 48px - extra large padding
    },
    borderRadius: {
        sm: '8px', // 8px - small-medium radius
        md: '12px', // 12px - medium radius
        lg: '16px', // 16px - large radius
        full: '9999px', // full - circular
    },
    // Margins - systematic scale for consistent spacing
    margin: {
        sm: '0.5rem', // 8px - small margin
        md: '1rem', // 16px - medium margin
        lg: '1.5rem', // 24px - large margin
    },
    maxWidth: {
        md: '64rem',
        lg: '80rem',
    },
};

// Simplified Animation System - Consolidated for consistency
export const ANIMATIONS = {
    // Standard transition used throughout the app
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Animation Presets - Reusable animation patterns
    presets: {
        // Focus effect - consistent focus ring
        focus: {
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
        // Glass effect with backdrop blur
        glass: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(24px) saturate(180%)',
            border: `1px solid ${COLORS.border.subtle}`,
        },
    },
};

// Layout Constants
// Base Card Styles - Shared properties for all card variants
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

// Component Variants - Streamlined patterns used in multiple places
export const COMPONENT_VARIANTS = {
    // Base card variant - shared properties for all cards
    card: BASE_CARD,

    // Interactive card variant - extends base card with interaction
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

    // Flex center utility - used 35+ times across components
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};
