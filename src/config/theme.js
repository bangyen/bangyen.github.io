/**
 * Theme configuration for the website
 * Centralizes colors, typography, spacing, and animations for consistent design
 */

// Alpha Values - Consolidated opacity constants for consistent transparency
export const ALPHA = {
    hover: 0.08,
    focus: 0.15,
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
        relaxed: 1.5,
    },
    // Professional letter spacing for enhanced readability
    letterSpacing: {
        normal: '0',
        wide: '0.025em',
    },
};

// Simplified Spacing System - Only essential values actually used
export const SPACING = {
    // Responsive padding - consolidated from padding/margin
    padding: {
        xs: '1rem',
        md: '2rem',
        lg: '3rem',
    },
    // Section spacing
    section: '4rem',
    // Border radius - only the 3 values actually used
    borderRadius: {
        md: '12px',
        lg: '16px',
        full: '9999px',
    },
    // Container widths - only the 3 values actually used
    maxWidth: {
        xs: '24rem',
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
    fadeIn: 'fade-in-up 0.6s ease-out',
    slideIn: 'slide-in-left 0.4s ease-out',
    scaleIn: 'scale-in 0.3s ease-out',
    // Staggered animation delays
    stagger: {
        fast: 150,
        normal: 200,
        slow: 300,
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
