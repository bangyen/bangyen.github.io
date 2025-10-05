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

// Base Color Definitions - Single source of truth for all color values
export const BASE_COLORS = {
    // Primary brand colors
    primaryBlue: 'hsl(217, 91%, 60%)',
    primaryBlueLight: 'hsl(217, 91%, 70%)',
    primaryBlueDark: 'hsl(217, 91%, 45%)',

    // Semantic colors
    success: 'hsl(141, 64%, 49%)',
    warning: 'hsl(34, 95%, 58%)',
    error: 'hsl(0, 73%, 56%)',

    // Neutral grays
    neutral50: 'hsl(0, 0%, 98%)',
    neutral100: 'hsl(0, 0%, 96%)',
    neutral200: 'hsl(0, 0%, 93%)',
    neutral300: 'hsl(0, 0%, 88%)',
    neutral400: 'hsl(0, 0%, 80%)',
    neutral500: 'hsl(0, 0%, 65%)',
    neutral600: 'hsl(0, 0%, 45%)',
    neutral700: 'hsl(0, 0%, 30%)',
    neutral800: 'hsl(0, 0%, 18%)',
    neutral900: 'hsl(0, 0%, 8%)',
    neutral950: 'hsl(0, 0%, 3%)',

    // Additional colors
    purple: 'hsl(271, 91%, 65%)',
    cyan: 'hsl(188, 91%, 60%)',
    indigo: 'hsl(231, 91%, 60%)',
    pink: 'hsl(329, 85%, 70%)',
    white: 'hsl(0, 0%, 100%)',
};

// Modern Semantic Color System - Enterprise-grade with Apple/Linear inspiration
export const COLORS = {
    // Brand Colors - Professional blue palette
    primary: {
        main: BASE_COLORS.primaryBlue,
        light: BASE_COLORS.primaryBlueLight,
        dark: BASE_COLORS.primaryBlueDark,
        softer: `hsla(217, 45%, 65%, ${ALPHA.subtle})`,
        subtle: `hsla(217, 25%, 95%, ${ALPHA.subtle})`,
    },
    // Semantic Function Colors
    accent: {
        success: BASE_COLORS.success,
        warning: BASE_COLORS.warning,
        error: BASE_COLORS.error,
        info: BASE_COLORS.primaryBlue,
    },
    // Enhanced Neutral Palette - Sophisticated grays following Apple's design language
    neutral: {
        50: BASE_COLORS.neutral50,
        100: BASE_COLORS.neutral100,
        200: BASE_COLORS.neutral200,
        300: BASE_COLORS.neutral300,
        400: BASE_COLORS.neutral400,
        500: BASE_COLORS.neutral500,
        600: BASE_COLORS.neutral600,
        700: BASE_COLORS.neutral700,
        800: BASE_COLORS.neutral800,
        900: BASE_COLORS.neutral900,
        950: BASE_COLORS.neutral950,
    },
    // Semantic Surface Colors
    surface: {
        background: BASE_COLORS.neutral950,
        container: 'hsl(0, 0%, 5%)',
        elevated: BASE_COLORS.neutral900,
        overlay: 'hsl(0, 0%, 12%)',
        glass: `hsla(0, 0%, 8%, ${ALPHA.glass})`,
        subtle: BASE_COLORS.neutral900,
    },
    // Text Colors with proper semantic hierarchy
    text: {
        primary: BASE_COLORS.neutral50,
        secondary: BASE_COLORS.neutral400,
        tertiary: BASE_COLORS.neutral500,
        muted: BASE_COLORS.neutral600,
        inverse: BASE_COLORS.neutral900,
        accent: BASE_COLORS.primaryBlue,
        white: BASE_COLORS.white,
    },
    // Border and Divider Colors
    border: {
        subtle: BASE_COLORS.neutral800,
        primary: BASE_COLORS.neutral700,
        interactive: BASE_COLORS.primaryBlue,
        focus: BASE_COLORS.primaryBlueLight,
    },
    // Interactive State Colors
    interactive: {
        hover: `hsla(0, 0%, 80%, ${ALPHA.hover})`,
        pressed: `hsla(0, 0%, 80%, ${ALPHA.pressed})`,
        focus: `hsla(217, 91%, 60%, ${ALPHA.focus})`,
        selected: `hsla(217, 91%, 60%, ${ALPHA.subtle})`,
        disabled: `hsla(0, 0%, 45%, ${ALPHA.disabled})`,
    },
    // Chart Colors
    data: {
        blue: BASE_COLORS.primaryBlue,
        green: BASE_COLORS.success,
        amber: BASE_COLORS.warning,
        red: BASE_COLORS.error,
        purple: BASE_COLORS.purple,
        cyan: BASE_COLORS.cyan,
        indigo: BASE_COLORS.indigo,
        pink: BASE_COLORS.pink,
    },
    // Game-specific colors
    game: {
        snakeBody: BASE_COLORS.primaryBlueDark,
        snakeFood: 'hsl(217, 91%, 25%)',
    },
    // Sophisticated Gradients for Modern Effects
    gradients: {
        primary: `linear-gradient(135deg, ${BASE_COLORS.primaryBlue}, ${BASE_COLORS.primaryBlueDark})`,
        subtle: 'linear-gradient(135deg, hsl(0, 0%, 5%), hsl(0, 0%, 8%))',
        glass: 'linear-gradient(135deg, hsla(0, 0%, 8%, 0.9), hsla(0, 0%, 12%, 0.85))',
        shimmer: `linear-gradient(90deg, ${BASE_COLORS.neutral900}, hsl(0, 0%, 12%), ${BASE_COLORS.neutral900})`,
    },
    // Shadows for Depth and Elevation
    shadows: {
        xs: '0 1px 2px hsla(0, 0%, 0%, 0.5)',
        sm: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
        md: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
        lg: '0 16px 64px hsla(0, 0%, 0%, 0.3)',
        xl: '0 24px 80px hsla(0, 0%, 0%, 0.25)',
        glow: `0 0 20px hsla(217, 91%, 60%, ${ALPHA.focus})`,
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
    // Fluid typography using clamp() for responsive scaling
    fontSize: {
        xs: {
            display: 'clamp(1.75rem, 4vw, 2.25rem)',
            h1: 'clamp(1.5rem, 3vw, 2rem)',
            h2: 'clamp(1.25rem, 2.5vw, 1.5rem)',
            h3: 'clamp(1.125rem, 2vw, 1.25rem)',
            h4: 'clamp(1rem, 1.5vw, 1.125rem)',
            h5: 'clamp(0.875rem, 1.25vw, 1rem)',
            h6: 'clamp(0.75rem, 1vw, 0.875rem)',
            body: 'clamp(0.8rem, 1vw, 0.875rem)',
            caption: 'clamp(0.7rem, 0.8vw, 0.75rem)',
        },
        sm: {
            display: 'clamp(2.5rem, 5vw, 4rem)',
            h1: 'clamp(2.25rem, 4vw, 3.5rem)',
            h2: 'clamp(1.75rem, 3vw, 2.25rem)',
            h3: 'clamp(1.5rem, 2.5vw, 1.75rem)',
            h4: 'clamp(1.25rem, 2vw, 1.5rem)',
            h5: 'clamp(1rem, 1.5vw, 1.25rem)',
            h6: 'clamp(0.875rem, 1.25vw, 1rem)',
            body: 'clamp(0.875rem, 1vw, 1rem)',
            caption: 'clamp(0.75rem, 0.8vw, 0.875rem)',
        },
        md: {
            display: 'clamp(3rem, 6vw, 5rem)',
            h1: 'clamp(3rem, 5vw, 4.5rem)',
            h2: 'clamp(2rem, 4vw, 3rem)',
            h3: 'clamp(1.75rem, 3vw, 2.25rem)',
            h4: 'clamp(1.5rem, 2.5vw, 1.75rem)',
            h5: 'clamp(1.25rem, 2vw, 1.5rem)',
            h6: 'clamp(1rem, 1.5vw, 1.25rem)',
            body: 'clamp(1rem, 1vw, 1.125rem)',
            caption: 'clamp(0.875rem, 0.8vw, 1rem)',
        },
        lg: {
            display: 'clamp(4rem, 8vw, 7rem)',
            h1: 'clamp(3.5rem, 6vw, 5.5rem)',
            h2: 'clamp(2.5rem, 5vw, 3.75rem)',
            h3: 'clamp(2rem, 4vw, 2.75rem)',
            h4: 'clamp(1.75rem, 3vw, 2.25rem)',
            h5: 'clamp(1.5rem, 2.5vw, 1.875rem)',
            h6: 'clamp(1.25rem, 2vw, 1.5rem)',
            body: 'clamp(1.125rem, 1vw, 1.25rem)',
            caption: 'clamp(1rem, 0.8vw, 1.125rem)',
        },
    },
    // Enhanced font weights with optical sizing considerations
    fontWeight: {
        thin: 200,
        extralight: 300,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
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

// Modern Spacing System - 8pt grid with responsive scaling
export const SPACING = {
    // 8pt grid system for consistent spacing
    unit: 8,
    // Padding with semantic naming
    padding: {
        xs: 'clamp(1rem, 4vw, 1.5rem)',
        sm: 'clamp(1.5rem, 5vw, 2rem)',
        md: 'clamp(2rem, 6vw, 3rem)',
        lg: 'clamp(2.5rem, 7vw, 4rem)',
    },
    // Margin with semantic naming
    margin: {
        xs: 'clamp(0.5rem, 2vw, 1rem)',
        sm: 'clamp(1rem, 3vw, 1.5rem)',
        md: 'clamp(1.5rem, 4vw, 2.5rem)',
        lg: 'clamp(2rem, 5vw, 3.5rem)',
        section: 'clamp(3rem, 8vw, 6rem)',
    },
    // Enhanced border radius system
    borderRadius: {
        none: 0,
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px',
    },
    // Container sizing with fluid typography
    maxWidth: {
        xs: 'clamp(16rem, 90vw, 24rem)',
        sm: 'clamp(28rem, 90vw, 42rem)',
        md: 'clamp(48rem, 90vw, 64rem)',
        lg: 'clamp(60rem, 90vw, 80rem)',
        prose: '42rem',
        content: '48rem',
        wide: '56rem',
    },
    // Component heights
    height: {
        scrollable: '60px',
        scrollbar: '8px',
    },
    // Scroll margins
    scrollMargin: {
        section: '2rem',
    },
    // Component-specific spacing
    components: {
        button: {
            padding: '12px 24px',
            minHeight: '44px',
        },
        chip: {
            padding: '8px 16px',
            height: '32px',
        },
        card: {
            padding: '24px',
            gap: '16px',
        },
        input: {
            padding: '12px 16px',
            height: '48px',
        },
        small: {
            padding: '0.5rem 0.75rem',
            height: '32px',
        },
        medium: {
            padding: '12px 20px',
            height: '40px',
        },
        page: {
            padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
            paddingVertical: { xs: '1rem 0', sm: '1.5rem 0', md: '2rem 0' },
            marginBottom: 2,
        },
        section: {
            marginBottom: 3,
            padding: { xs: 1.5, sm: 2 },
        },
    },
    // Common grid sizing patterns
    grid: {
        full: { xs: 12, sm: 12 },
        half: { xs: 12, sm: 6 },
        auto: 'auto',
    },
    // Common grid layout patterns
    layout: {
        fullWidth: { size: 12, flex: 1 },
        standardSpacing: 3,
        containerSpacing: { xs: 4, md: 8 },
    },
};

// Timing Constants - Consolidated animation and interaction timings
export const TIMING = {
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 750,
    fadeIn: 1000,
    staggerDelay: 200,
    initialDelay: 1600,
    game: {
        snake: 100,
        editor: 200,
    },
    reducedMotion: 0.01,
    scrollbar: 150,
};

// Modern Animation System - Spring physics and sophisticated interactions
export const ANIMATIONS = {
    // Modern easing curves inspired by Apple and Linear
    easing: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snappy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        linear: 'linear',
    },
    // Timing system with semantic naming
    duration: {
        fast: `${TIMING.fast}ms`,
        normal: `${TIMING.normal}ms`,
        slow: `${TIMING.slow}ms`,
        slower: `${TIMING.slower}ms`,
    },
    // Comprehensive transition library
    transitions: {
        fast: `all ${TIMING.fast}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        normal: `all ${TIMING.normal}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        smooth: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        gentle: 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    // Hover states with sophisticated interactions
    hover: {
        lift: {
            transform: 'translateY(-2px) scale(1.01)',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.4)',
        },
        slide: {
            transform: 'translateX(4px)',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        glow: {
            boxShadow: '0 0 20px hsla(217, 91%, 60%, 0.15)',
            transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        modern: {
            transform: 'scale(1.02) translateY(-1px)',
            transition: 'all 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: '0 4px 20px hsla(0, 0%, 0%, 0.25)',
        },
    },
    // Focus states with accessibility in mind
    focus: {
        ring: {
            outline: 'none',
            boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
            transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
    },
    // Animation presets for common use cases
    presets: {
        fadeIn: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: TIMING.normal / 1000, ease: 'easeOut' },
        },
        fadeInUp: {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: 'easeOut' },
        },
        slideInLeft: {
            initial: { opacity: 0, x: -30 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: TIMING.normal / 1000, ease: 'easeOut' },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: TIMING.fast / 1000, ease: 'easeOut' },
        },
    },
    // CSS-specific animation values
    css: {
        translateY: '40px',
        translateX: '40px',
        glow: {
            offset: '20px',
            spread: '30px',
            blur: '40px',
        },
        backdrop: {
            blur: '20px',
            saturation: '180%',
        },
    },
    // Loading states and skeleton animations
    loading: {
        shimmer: {
            background:
                'linear-gradient(90deg, hsl(0, 0%, 8%), hsl(0, 0%, 12%), hsl(0, 0%, 8%))',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite linear',
        },
        pulse: {
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        bounce: {
            animation: 'bounce 1s infinite',
        },
    },
    // Page transitions and route changes
    pageTransition: {
        fadeOut: {
            opacity: 0,
            transition: `opacity ${TIMING.fast}ms ease-out`,
        },
        fadeIn: {
            opacity: 1,
            transition: `opacity ${TIMING.normal}ms ease-in`,
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
