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
    // Semantic Color Aliases - Common patterns for consistency
    semantic: {
        cardHover: `hsla(217, 91%, 60%, 0.1)`,
        buttonPrimary: `hsl(217, 91%, 60%)`,
        buttonHover: `hsl(217, 91%, 45%)`,
        glassBackground: `hsla(0, 0%, 8%, 0.85)`,
        borderSubtle: `hsl(0, 0%, 18%)`,
    },
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
    // Shadows for Depth and Elevation
    shadow: {
        xs: '0 1px 2px hsla(0, 0%, 0%, 0.5)',
        sm: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
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
    }, // Essential font weights - only the ones actually used
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    // Improved line heights for optical balance
    lineHeight: {
        normal: 1.4,
    },
    // Professional letter spacing for enhanced readability
    letterSpacing: {
        normal: '0',
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
    // Border radius - systematic scale based on 4px unit
    // Border radius - systematic scale based on 4px unit
    borderRadius: {
        xs: '4px', // 4px - small radius
        sm: '8px', // 8px - small-medium radius
        md: '12px', // 12px - medium radius
        lg: '16px', // 16px - large radius
        xl: '24px', // 24px - extra large radius
        full: '9999px', // full - circular
    },
    // Container widths - simplified to 2 essential sizes
    // Container widths - simplified to 2 essential sizes
    // Margins - systematic scale for consistent spacing
    margin: {
        xs: '0.25rem', // 4px - tiny margin
        sm: '0.5rem', // 8px - small margin
        md: '1rem', // 16px - medium margin
        lg: '1.5rem', // 24px - large margin
        xl: '2rem', // 32px - extra large margin
    },
    maxWidth: {
        md: '64rem',
        lg: '80rem',
    },
    // Responsive Breakpoint Patterns - Standardized responsive values
    responsive: {
        padding: { xs: '0.5rem', md: '1.5rem' },
        fontSize: { xs: '1.25rem', md: '2.125rem' },
        gap: { xs: 2, md: 3 },
        margin: { xs: '0.5rem 0', md: '1.5rem 0' },
        iconSize: { xs: '1.5rem', md: '2rem' },
        borderRadius: { xs: '12px', md: '16px' },
    },
};
// Simplified Animation System - Consolidated for consistency
export const ANIMATIONS = {
    // Standard transition used throughout the app
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Animation Presets - Reusable animation patterns
    presets: {
        // Card hover effect - lift with shadow
        cardHover: {
            transform: 'translateY(-2px)',
            boxShadow: COLORS.shadow.medium,
        },

        // Interactive hover - background change
        interactiveHover: {
            backgroundColor: COLORS.interactive.hover,
        },
        // Scale hover - grow slightly
        // Button hover - consistent button interaction
        buttonHover: {
            backgroundColor: COLORS.semantic.buttonHover,
            transform: `translateY(-1px)`,
            boxShadow: COLORS.shadow.sm,
        },
        // Card interaction - consistent card behavior
        cardInteraction: {
            backgroundColor: COLORS.semantic.cardHover,
            transform: `translateY(-2px)`,
            boxShadow: COLORS.shadow.sm,
        },
        scaleHover: {
            transform: 'scale(1.02) translateY(-1px)',
            boxShadow: '0 4px 20px hsla(0, 0%, 0%, 0.25)',
        },
        // Glass effect with backdrop blur
        // Focus effect - consistent focus ring
        focus: {
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
        glass: {
            backgroundColor: COLORS.semantic.glassBackground,
            backdropFilter: 'blur(24px) saturate(180%)',
            border: `1px solid ${COLORS.semantic.borderSubtle}`,
        },
    },
};

// Layout Constants

// Component Variants - Streamlined patterns used in multiple places
export const COMPONENT_VARIANTS = {
    // Unified card variant - combines glass and interactive functionality
    card: {
        backgroundColor: COLORS.semantic.glassBackground,
        backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${COLORS.semantic.borderSubtle}`,
        borderRadius: SPACING.borderRadius.lg,
        boxShadow: COLORS.shadow.medium,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: ANIMATIONS.transition,
        '&:hover': {
            ...ANIMATIONS.presets.cardInteraction,
            transform: 'translateY(-2px)',
            boxShadow: COLORS.shadow.medium,
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
