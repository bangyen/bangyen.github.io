/**
 * Theme configuration for the website
 * Centralizes colors, typography, spacing, and animations for consistent design
 */

// Alpha Values - Consolidated opacity constants for consistent transparency
export const ALPHA = {
    hover: 0.08,
    focus: 0.15,
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
        glass: 'hsla(0, 0%, 8%, 0.85)',
    },
    // Text Colors - Simplified to 3 essential variants
    text: {
        primary: 'hsl(0, 0%, 98%)', // Main text
        secondary: 'hsl(0, 0%, 80%)', // Secondary text
        muted: 'hsl(0, 0%, 45%)', // Muted/disabled text
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
        selected: `hsla(217, 91%, 60%, 0.1)`,
    },
    // Chart Colors
    data: {
        green: 'hsl(141, 64%, 49%)',
        amber: 'hsl(34, 95%, 58%)',
        red: 'hsl(0, 73%, 56%)',
    },
    // Shadows for Depth and Elevation
    shadows: {
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
        mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
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
    // Responsive padding - consolidated from padding/margin
    padding: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
    },
    section: '2rem',
    // Border radius - only the 3 values actually used
    borderRadius: {
        md: '12px',
        lg: '16px',
        full: '9999px',
    },
    // Container widths - simplified to 3 essential sizes
    maxWidth: {
        sm: '24rem',
        md: '64rem',
        lg: '80rem',
    },
};
// Simplified Animation System - Consolidated for consistency
export const ANIMATIONS = {
    // Standard transition used throughout the app
    transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Fast transition for quick interactions
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Hover effect used consistently across components
    hover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 20px hsla(0, 0%, 0%, 0.25)',
    },
    // Focus ring for accessibility
    focus: {
        outline: 'none',
        boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
    },
    // Animation utilities for common patterns
    // Keyframe definitions for CSS animations
    keyframes: {
        fadeInUp: `@keyframes fade-in-up {
            from { opacity: 0; transform: translate3d(0, 40px, 0); }
            to { opacity: 1; transform: translate3d(0, 0, 0); }
        }`,
        slideInLeft: `@keyframes slide-in-left {
            from { opacity: 0; transform: translate3d(-40px, 0, 0); }
            to { opacity: 1; transform: translate3d(0, 0, 0); }
        }`,
        scaleIn: `@keyframes scale-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }`,
    },
    // Staggered animation delays
    // Animation utilities for common patterns
    fadeIn: 'fade-in-up 0.6s ease-out',
    slideIn: 'slide-in-left 0.4s ease-out',
    scaleIn: 'scale-in 0.3s ease-out',
    stagger: {
        fast: 150,
        normal: 200,
        slow: 300,
    },
};

// Layout Constants
export const LAYOUT = {
    zIndex: {
        background: -1,
        content: 1,
        overlay: 1000,
        modal: 2000,
    },
};

// Component Variants - Reusable styling patterns to eliminate repetitive inline styles
export const COMPONENT_VARIANTS = {
    // Glass morphism card styling
    glassCard: {
        backgroundColor: COLORS.surface.glass,
        backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${COLORS.border.subtle}`,
        borderRadius: SPACING.borderRadius.lg,
        boxShadow: COLORS.shadows.sm,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },

    // Primary button styling
    primaryButton: {
        backgroundColor: COLORS.primary.main,
        color: COLORS.text.primary,
        border: 'none',
        borderRadius: SPACING.borderRadius.md,
        padding: '12px 24px',
        minHeight: '44px',
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        transition: ANIMATIONS.transition,
        boxShadow: COLORS.shadows.xs,
        '&:hover': {
            backgroundColor: COLORS.primary.dark,
            boxShadow: COLORS.shadows.sm,
            transform: 'translateY(-1px)',
        },
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
    },

    // Secondary button styling
    secondaryButton: {
        backgroundColor: 'transparent',
        color: COLORS.primary.main,
        border: `1px solid ${COLORS.primary.main}`,
        borderRadius: SPACING.borderRadius.md,
        padding: '12px 24px',
        minHeight: '44px',
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        transition: ANIMATIONS.transition,
        '&:hover': {
            backgroundColor: COLORS.interactive.selected,
            transform: 'translateY(-1px)',
        },
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
    },

    // Ghost button styling
    ghostButton: {
        backgroundColor: 'transparent',
        color: COLORS.text.secondary,
        border: 'none',
        borderRadius: SPACING.borderRadius.md,
        padding: '12px 24px',
        minHeight: '44px',
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        transition: ANIMATIONS.transition,
        '&:hover': {
            backgroundColor: COLORS.interactive.hover,
            color: COLORS.text.primary,
        },
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
    },

    // Interactive card styling (for hover effects)
    interactiveCard: {
        cursor: 'pointer',
        transition: ANIMATIONS.transition,
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: COLORS.shadows.sm,
        },
        '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${COLORS.interactive.focus}`,
        },
    },

    // Skill badge styling
    skillBadge: {
        backgroundColor: COLORS.interactive.selected,
        border: `1px solid hsla(217, 91%, 60%, 0.2)`,
        borderRadius: SPACING.borderRadius.md,
        padding: {
            xs: '12px',
            md: '16px',
        },
        display: 'flex',
        alignItems: 'center',
        gap: {
            xs: 1,
            md: 1.5,
        },
        transition: ANIMATIONS.transition,
        cursor: 'pointer',
        minWidth: 0,
        overflow: 'hidden',
        '&:hover': {
            backgroundColor: COLORS.interactive.hover,
            transform: 'translateY(-2px) scale(1.01)',
            boxShadow: COLORS.shadows.sm,
        },
    },

    // Technology tag styling
    techTag: {
        borderRadius: '20px',
        fontSize: 'clamp(0.7rem, 0.8vw, 0.75rem)',
        fontWeight: 500,
        padding: '4px 12px',
        minHeight: '24px',
        display: 'inline-flex',
        alignItems: 'center',
        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Navigation container styling
    navigationContainer: {
        transform: 'translateX(-50%)',
        position: 'absolute',
        bottom: 50,
        left: '50%',
        zIndex: 10,
        backgroundColor: 'hsla(0, 0%, 3%, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid hsl(0, 0%, 18%)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
        padding: '16px 24px',
    },

    // Flex center utility
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Flex column utility
    flexColumn: {
        display: 'flex',
        flexDirection: 'column',
    },

    // Responsive grid utility
    responsiveGrid: {
        display: 'grid',
        gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
        },
        gap: 4,
    },

    // Hero section styling
    heroSection: {
        position: 'relative',
        background: COLORS.surface.background,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
    },

    // Page container styling
    pageContainer: {
        position: 'relative',
        padding: SPACING.padding.md,
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
    },
};
