/**
 * Configuration constants for the website
 * Centralizes all hardcoded values for easier maintenance and customization
 */

// Personal Information
export const PERSONAL_INFO = {
    name: 'Bangyen Pham',
    title: 'Backend Developer & AI/ML Engineer',
    location: 'Chicago, IL',
    greeting: "Hey, I'm Bangyen",
};

// URLs and Links
export const URLS = {
    github: 'https://github.com/bangyen',
    githubProfile: 'https://github.com/bangyen',
    zsharpRepo: 'https://github.com/bangyen/zsharp',
    oligopolyRepo: 'https://github.com/bangyen/oligopoly',
    esolangsRepo: 'https://github.com/bangyen/esolangs',
    publications: {
        cluster2023: 'https://ieeexplore.ieee.org/document/10319968',
        sc2024: 'https://ieeexplore.ieee.org/document/10793131',
    },
    fonts: {
        googleFonts: 'https://fonts.googleapis.com',
        googleFontsStatic: 'https://fonts.gstatic.com',
        interFont:
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    },
    local: {
        localhost: 'http://localhost:3000',
        liveSite: 'https://bangyen.github.io',
    },
};

// Technical Skills
export const SKILLS = [
    { name: 'Python', icon: 'Code' },
    { name: 'PyTorch', icon: 'Psychology' },
    { name: 'JavaScript', icon: 'Code' },
    { name: 'AWS/GCP', icon: 'Cloud' },
    { name: 'Docker', icon: 'Work' },
    { name: 'TensorFlow', icon: 'Psychology' },
];

// Research Publications
export const PUBLICATIONS = [
    {
        title: 'Generalized Collective Algorithms for the Exascale Era',
        conference: 'CLUSTER 2023',
        url: URLS.publications.cluster2023,
        description:
            'Introduced novel framework for exascale collective algorithms, reducing communication overhead by 30% and latency by 20%',
    },
    {
        title: 'Revisiting Computation for Research: Practices and Trends',
        conference: 'SC 2024',
        url: URLS.publications.sc2024,
        description:
            'Interviewed 138 researchers across multiple institutions using thematic analysis to uncover evolving computational research practices',
    },
];

// Featured Projects
export const PROJECTS = [
    {
        title: 'ZSharp — Sharpness-Aware Minimization',
        technology: 'PyTorch',
        url: URLS.zsharpRepo,
        description:
            'Developed PyTorch implementation with Apple Silicon optimization, delivering +5.2% accuracy over SGD and 4.4× training speedup',
    },
    {
        title: 'Oligopoly — Agent-Based Modeling',
        technology: 'FastAPI',
        url: URLS.oligopolyRepo,
        description:
            'Built simulation with 98.5% collusion detection accuracy and 72.3% strategy adaptation rate using FastAPI and SQLAlchemy',
    },
];

// Page Routes
export const ROUTES = {
    pages: {
        Oligopoly: '/Oligopoly',
        ZSharp: '/ZSharp',
        Snake: '/Snake',
        Lights_Out: '/Lights_Out',
        Interpreters: '/Interpreters',
    },
    interpreters: {
        Stun_Step: '/Stun_Step',
        Suffolk: '/Suffolk',
        WII2D: '/WII2D',
        Back: '/Back',
    },
};

// Modern Semantic Color System - Enterprise-grade with Apple/Linear inspiration
export const COLORS = {
    // Brand Colors - Professional blue palette
    primary: {
        main: 'hsl(217, 91%, 60%)', // Primary brand blue
        light: 'hsl(217, 91%, 70%)', // Light variant
        dark: 'hsl(217, 91%, 45%)', // Dark variant (improved contrast)
        softer: 'hsl(217, 45%, 65%)', // Softer variant for backgrounds
        subtle: 'hsl(217, 25%, 95%)', // Very subtle for interactive states
    },
    // Semantic Function Colors
    accent: {
        success: 'hsl(141, 64%, 49%)', // Green for success states
        warning: 'hsl(34, 95%， 58%)', // Amber for warnings
        error: 'hsl(0, 73%, 56%)', // Red for errors
        info: 'hsl(217, 91%, 60%)', // Blue for info (same as primary)
    },
    // Enhanced Neutral Palette - Sophisticated grays following Apple's design language
    neutral: {
        50: 'hsl(0, 0%, 98%)', // Lightest gray (near white)
        100: 'hsl(0, 0%, 96%)', // Very light gray
        200: 'hsl(0, 0%, 93%)', // Light gray
        300: 'hsl(0, 0%, 88%)', // Medium light gray
        400: 'hsl(0, 0%, 80%)', // Medium gray
        500: 'hsl(0, 0%, 65%)', // Medium dark gray
        600: 'hsl(0, 0%, 45%)', // Dark gray
        700: 'hsl(0, 0%, 30%)', // Very dark gray
        800: 'hsl(0, 0%, 18%)', // Almost black gray
        900: 'hsl(0, 0%, 8%)', // Near black gray
        950: 'hsl(0, 0%, 3%)', // Darkest gray
    },
    // Semantic Surface Colors
    surface: {
        // Background layers with proper elevation hierarchy
        background: 'hsl(0, 0%, 3%)', // Main background (neutral-950)
        container: 'hsl(0, 0%, 5%)', // Container background (neutral-900)
        elevated: 'hsl(0, 0%, 8%)', // Elevated surfaces
        overlay: 'hsl(0, 0%, 12%)', // Overlays and modals
        glass: 'hsla(0, 0%, 8%, 0.85)', // Glass morphism backgrounds
    },
    // Text Colors with proper semantic hierarchy
    text: {
        primary: 'hsl(0, 0%, 98%)', // High contrast text (neutral-50)
        secondary: 'hsl(0, 0%, 80%)', // Secondary text (neutral-400)
        tertiary: 'hsl(0, 0%, 65%)', // Tertiary text (neutral-500)
        muted: 'hsl(0, 0%, 45%)', // Muted text (neutral-600)
        inverse: 'hsl(0, 0%, 8%)', // Inverse text for colored backgrounds
        accent: 'hsl(217, 91%, 60%)', // Accent text color
        white: 'hsl(0, 0%, 100%)', // Pure white text for overlays and charts
    },
    // Border and Divider Colors
    border: {
        subtle: 'hsl(0, 0%, 18%)', // Subtle borders (neutral-800)
        primary: 'hsl(0, 0%, 30%)', // Primary borders (neutral-700)
        interactive: 'hsl(217, 91%, 60%)', // Interactive element borders
        focus: 'hsl(217, 91%, 70%)', // Focus ring borders
    },
    // Interactive State Colors
    interactive: {
        hover: 'hsla(0, 0%, 80%, 0.08)', // Hover states
        pressed: 'hsla(0, 0%, 80%, 0.12)', // Pressed states
        focus: 'hsla(217, 91%, 60%, 0.15)', // Focus ring
        selected: 'hsla(217, 91%, 60%, 0.1)', // Selected states
        disabled: 'hsla(0, 0%, 45%, 0.3)', // Disabled states
    },
    // Chart Colors (Enhanced)
    data: {
        blue: 'hsl(217, 91%, 60%)',
        green: 'hsl(141, 64%, 49%)',
        amber: 'hsl(34, 95%, 58%)',
        red: 'hsl(0, 73%, 56%)',
        purple: 'hsl(271, 91%, 65%)',
        cyan: 'hsl(188, 91%, 60%)',
        indigo: 'hsl(231, 91%, 60%)',
        pink: 'hsl(329, 85%, 70%)',
    },
    // Sophisticated Gradients for Modern Effects
    gradients: {
        primary:
            'linear-gradient(135deg, hsl(217, 91%, 60%), hsl(217, 91%, 45%))',
        subtle: 'linear-gradient(135deg, hsl(0, 0%, 5%), hsl(0, 0%, 8%)),',
        glass: 'linear-gradient(135deg, hsla(0, 0%, 8%, 0.9), hsla(0, 0%, 12%, 0.85))',
        shimmer:
            'linear-gradient(90deg, hsl(0, 0%, 8%), hsl(0, 0%, 12%), hsl(0, 0%, 8%))',
    },
    // Shadows for Depth and Elevation
    shadows: {
        xs: '0 1px 2px hsla(0, 0%, 0%, 0.5)',
        sm: '0 2px 8px hsla(0, 0%, 0%, 0.4)',
        md: '0 8px 32px hsla(0, 0%, 0%, 0.35)',
        lg: '0 16px 64px hsla(0, 0%, 0%, 0.3)',
        xl: '0 24px 80px hsla(0, 0%, 0%, 0.25)',
        glow: '0 0 20px hsla(217, 91%, 60%, 0.15)', // Subtle blue glow
    },
    // Chart Colors for Data Visualization (Legacy compatibility)
    chart: {
        blue: 'hsl(217, 91%, 60%)', // Primary chart color
        orange: 'hsl(34, 95%, 58%)', // Secondary chart color
        green: 'hsl(141, 64%, 49%)', // Success/tool color
        stroke: {
            light: 'hsl(0, 0%, 30%)',
            medium: 'hsl(0, 0%, 50%)',
        },
        fill: {
            medium: 'hsl(0, 0%, 50%)',
        },
        legend: {
            light: 'hsl(0, 0%, 40%)',
            lighter: 'hsl(0, 0%, 60%)',
        },
    },
    // Background colors for backward compatibility
    background: {
        default: 'hsl(0, 0%, 5%)',
        raised: 'hsl(0, 0%, 15%)',
    },
};

// Modern Spacing System - 8pt grid with responsive scaling
export const SPACING = {
    // 8pt grid system for consistent spacing
    unit: 8, // Base unit in pixels
    // Padding with semantic naming
    padding: {
        xs: 'clamp(1rem, 4vw, 1.5rem)', // Small screens
        sm: 'clamp(1.5rem, 5vw, 2rem)', // Medium screens
        md: 'clamp(2rem, 6vw, 3rem)', // Large screens
        lg: 'clamp(2.5rem, 7vw, 4rem)', // Extra large screens
    },
    // Margin with semantic naming
    margin: {
        xs: 'clamp(0.5rem, 2vw, 1rem)', // Small margins
        sm: 'clamp(1rem, 3vw, 1.5rem)', // Medium margins
        md: 'clamp(1.5rem, 4vw, 2.5rem)', // Large margins
        lg: 'clamp(2rem, 5vw, 3.5rem)', // Extra large margins
        section: 'clamp(3rem, 8vw, 6rem)', // Section spacing
    },
    // Enhanced border radius system
    borderRadius: {
        none: 0,
        xs: '4px', // Subtle rounding
        sm: '8px', // Small rounding
        small: '8px', // Migrated - use sm for new code
        md: '12px', // Medium rounding
        lg: '16px', // Large rounding
        xl: '20px', // Extra large rounding
        full: '9999px', // Fully rounded
    },
    // Container sizing with fluid typography
    maxWidth: {
        xs: 'clamp(16rem, 90vw, 24rem)', // Small containers
        sm: 'clamp(28rem, 90vw, 42rem)', // Medium containers
        md: 'clamp(48rem, 90vw, 64rem)', // Large containers
        lg: 'clamp(60rem, 90vw, 80rem)', // Extra large containers
        prose: '42rem', // Optimal reading width
        content: '48rem', // Content areas
        wide: '56rem', // Wide content areas
    },
    // Component-specific spacing
    components: {
        button: {
            padding: '12px 24px',
            minHeight: '44px', // Touch-friendly minimum
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
            display: 'clamp(1.75rem, 4vw, 2.25rem)', // Dynamic display sizing
            h1: 'clamp(1.5rem, 3vw, 2rem)', // Main headings
            h2: 'clamp(1.25rem, 2.5vw, 1.5rem)', // Section headings
            h3: 'clamp(1.125rem, 2vw, 1.25rem)', // Subsection headings
            h4: 'clamp(1rem, 1.5vw, 1.125rem)', // Card titles
            h5: 'clamp(0.875rem, 1.25vw, 1rem)', // Meta headings
            body: 'clamp(0.8rem, 1vw, 0.875rem)', // Body text
            caption: 'clamp(0.7rem, 0.8vw, 0.75rem)', // Small text
        },
        sm: {
            display: 'clamp(2.5rem, 5vw, 4rem)', // Large display text
            h1: 'clamp(2.25rem, 4vw, 3.5rem)', // Hero headings
            h2: 'clamp(1.75rem, 3vw, 2.25rem)', // Section headings
            h3: 'clamp(1.5rem, 2.5vw, 1.75rem)', // Subsection headings
            h4: 'clamp(1.25rem, 2vw, 1.5rem)', // Card titles
            h5: 'clamp(1rem, 1.5vw, 1.25rem)', // Meta headings
            body: 'clamp(0.875rem, 1vw, 1rem)', // Body text
            caption: 'clamp(0.75rem, 0.8vw, 0.875rem)', // Small text
        },
        md: {
            display: 'clamp(3rem, 6vw, 5rem)', // XXL display text
            h1: 'clamp(3rem, 5vw, 4.5rem)', // Hero headings
            h2: 'clamp(2rem, 4vw, 3rem)', // Section headings
            h3: 'clamp(1.75rem, 3vw, 2.25rem)', // Subsection headings
            h4: 'clamp(1.5rem, 2.5vw, 1.75rem)', // Card titles
            h5: 'clamp(1.25rem, 2vw, 1.5rem)', // Meta headings
            body: 'clamp(1rem, 1vw, 1.125rem)', // Body text
            caption: 'clamp(0.875rem, 0.8vw, 1rem)', // Small text
        },
        lg: {
            display: 'clamp(4rem, 8vw, 7rem)', // Ultimate display text
            h1: 'clamp(3.5rem, 6vw, 5.5rem)', // Hero headings
            h2: 'clamp(2.5rem, 5vw, 3.75rem)', // Section headings
            h3: 'clamp(2rem, 4vw, 2.75rem)', // Subsection headings
            h4: 'clamp(1.75rem, 3vw, 2.25rem)', // Card titles
            h5: 'clamp(1.5rem, 2.5vw, 1.875rem)', // Meta headings
            body: 'clamp(1.125rem, 1vw, 1.25rem)', // Body text
            caption: 'clamp(1rem, 0.8vw, 1.125rem)', // Small text
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
        normal: 1.4, // Better for body text
        relaxed: 1.5, // Comfortable for long text
        loose: 1.625, // Very comfortable reading
        prose: 1.7, // Optimal for prose content
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

// Modern Animation System - Spring physics and sophisticated interactions
export const ANIMATIONS = {
    // Modern easing curves inspired by Apple and Linear
    easing: {
        // Smooth, natural curves for modern feel
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        snappy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        linear: 'linear',
    },
    // Timing system with semantic naming
    duration: {
        fast: '150ms', // Quick interactions
        normal: '300ms', // Standard transitions
        slow: '500ms', // Deliberate animations
        slower: '750ms', // Page transitions
    },
    // Comprehensive transition library
    transitions: {
        // Base transitions with modern easing
        fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        normal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        smooth: 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        spring: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        gentle: 'all 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    // Hover states with sophisticated interactions
    hover: {
        // Subtle lift for cards and interactive elements
        lift: {
            transform: 'translateY(-2px) scale(1.01)',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 8px 32px hsla(0, 0%, 0%, 0.4)',
        },
        // Gentle slide for navigation elements
        slide: {
            transform: 'translateX(4px)',
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        // Subtle glow for interactive elements
        glow: {
            boxShadow: '0 0 20px hsla(217, 91%, 60%, 0.15)',
            transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        // Modern scale and shadow combination
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
            transition: { duration: 0.3, ease: 'easeOut' },
        },
        fadeInUp: {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4, ease: 'easeOut' },
        },
        slideInLeft: {
            initial: { opacity: 0, x: -30 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.3, ease: 'easeOut' },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.2, ease: 'easeOut' },
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
            transition: 'opacity 200ms ease-out',
        },
        fadeIn: {
            opacity: 1,
            transition: 'opacity 300ms ease-in',
        },
    },
};

// Component-specific constants

export const COMPONENTS = {
    // Glass morphism menu with modern aesthetics
    menu: {
        backdropFilter: 'blur(24px) saturate(180%)',
        backgroundColor: 'hsla(0, 0%, 3%, 0.85)',
        border: '1px solid hsla(0, 0%, 100%, 0.1)',
        borderRadius: SPACING.borderRadius.lg,
        boxShadow: COLORS.shadows.lg,
        padding: {
            vertical: '12px',
            horizontal: '16px',
        },
    },
    // Modern skill chips with sophisticated interactions
    chip: {
        height: {
            sm: '28px',
            md: '32px',
            lg: '40px',
        },
        padding: {
            sm: '6px 12px',
            md: '8px 16px',
            lg: '10px 20px',
        },
        borderRadius: SPACING.borderRadius.full,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        transition: ANIMATIONS.transitions.fast,
        backgroundColor: COLORS.interactive.selected,
        color: COLORS.text.accent,
        border: 'none',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: COLORS.interactive.pressed,
            transform: 'scale(1.05)',
        },
    },
    // Enhanced card system with multiple variants
    card: {
        elevated: {
            backgroundColor: COLORS.surface.elevated,
            border: `1px solid ${COLORS.border.subtle}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.card.padding,
            transition: ANIMATIONS.transitions.normal,
            boxShadow: COLORS.shadows.sm,
        },
        glassmorphism: {
            backgroundColor: COLORS.surface.glass,
            backdropFilter: 'blur(20px) saturate(180%)',
            border: `1px solid hsla(0, 0%, 100%, 0.1)`,
            borderRadius: SPACING.borderRadius.lg,
            padding: SPACING.components.card.padding,
            transition: ANIMATIONS.transitions.gentle,
            boxShadow: COLORS.shadows.md,
        },
        interactive: {
            backgroundColor: COLORS.surface.elevated,
            border: `1px solid ${COLORS.border.subtle}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.card.padding,
            transition: ANIMATIONS.transitions.normal,
            boxShadow: COLORS.shadows.sm,
            cursor: 'pointer',
            '&:hover': ANIMATIONS.hover.lift,
            '&:focus': ANIMATIONS.focus.ring,
        },
    },
    // Professional badge system
    badge: {
        primary: {
            backgroundColor: COLORS.interactive.selected,
            color: COLORS.text.accent,
            border: `1px solid hsla(217, 91%, 60%, 0.2)`,
            borderRadius: SPACING.borderRadius.xl,
            fontSize: TYPOGRAPHY.fontSize.xs.caption,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            padding: '4px 12px',
            minHeight: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: ANIMATIONS.transitions.fast,
        },
        // Simple border for grid editor cells
        border: `1px solid ${COLORS.border.interactive}`,
        secondary: {
            backgroundColor: COLORS.interactive.hover,
            color: COLORS.text.secondary,
            border: `1px solid ${COLORS.border.primary}`,
            borderRadius: SPACING.borderRadius.xl,
            fontSize: TYPOGRAPHY.fontSize.xs.caption,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            padding: '4px 12px',
            minHeight: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            transition: ANIMATIONS.transitions.fast,
        },
    },
    // Modern button system with multiple variants
    button: {
        primary: {
            backgroundColor: COLORS.primary.main,
            color: COLORS.text.primary,
            border: 'none',
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.button.padding,
            minHeight: SPACING.components.button.minHeight,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            transition: ANIMATIONS.transitions.normal,
            boxShadow: COLORS.shadows.xs,
            '&:hover': {
                backgroundColor: COLORS.primary.dark,
                boxShadow: COLORS.shadows.sm,
                transform: 'translateY(-1px)',
            },
            '&:focus': ANIMATIONS.focus.ring,
        },
        secondary: {
            backgroundColor: 'transparent',
            color: COLORS.text.secondary,
            border: `1px solid ${COLORS.border.primary}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.button.padding,
            minHeight: SPACING.components.button.minHeight,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            transition: ANIMATIONS.transitions.normal,
            '&:hover': {
                backgroundColor: COLORS.interactive.hover,
                borderColor: COLORS.primary.main,
                transform: 'translateY(-1px)',
            },
            '&:focus': ANIMATIONS.focus.ring,
        },
        ghost: {
            backgroundColor: 'transparent',
            color: COLORS.text.secondary,
            border: 'none',
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.button.padding,
            minHeight: SPACING.components.button.minHeight,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            transition: ANIMATIONS.transitions.fast,
            '&:hover': {
                backgroundColor: COLORS.interactive.hover,
                color: COLORS.text.primary,
            },
            '&:focus': ANIMATIONS.focus.ring,
        },
    },
    // Enhanced navigation with modern aesthetics
    navigation: {
        backgroundColor: 'hsla(0, 0%, 3%, 0.95)',
        backdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${COLORS.border.subtle}`,
        borderRadius: SPACING.borderRadius.lg,
        boxShadow: COLORS.shadows.md,
        padding: '16px 24px',
    },
    // Professional input system
    input: {
        primary: {
            backgroundColor: COLORS.surface.elevated,
            border: `1px solid ${COLORS.border.subtle}`,
            borderRadius: SPACING.borderRadius.md,
            padding: SPACING.components.input.padding,
            minHeight: SPACING.components.input.height,
            color: COLORS.text.primary,
            fontSize: TYPOGRAPHY.fontSize.md.body,
            fontWeight: TYPOGRAPHY.fontWeight.normal,
            transition: ANIMATIONS.transitions.fast,
            '&:focus': {
                outline: 'none',
                borderColor: COLORS.border.interactive,
                boxShadow: '0 0 0 3px hsla(217, 91%, 60%, 0.1)',
            },
            '&:hover': {
                borderColor: COLORS.border.primary,
            },
        },
    },
    // Sophisticated borders and dividers
    borders: {
        subtle: `1px solid ${COLORS.border.subtle}`,
        primary: `1px solid ${COLORS.border.primary}`,
        interactive: `2px solid ${COLORS.border.interactive}`,
        divider: `1px solid ${COLORS.border.subtle}`,
        light: `1px solid ${COLORS.border.subtle}`, // Migrated to semantic colors
        white: `1px solid ${COLORS.border.primary}`, // Migrated to semantic colors
    },
    // Interactive states
    interactive: {
        hover: {
            standard: COLORS.interactive.hover,
            subtle: COLORS.interactive.hover,
            strong: COLORS.interactive.pressed,
        },
        focus: {
            ring: '0 0 0 3px hsla(217, 91%, 60%, 0.15)',
            outline: 'none',
        },
        selected: COLORS.interactive.selected,
        disabled: COLORS.interactive.disabled,
    },
    // Legacy component support for Oligopoly - migrated to semantic colors
    cardLight: {
        backgroundColor: COLORS.surface.subtle,
    },
    overlays: {
        dark: 'hsla(0, 0%, 5%, 0.95)',
        lighter: 'hsla(0, 0%, 12%, 0.8)', // For text areas and input fields
        light: 'hsla(0, 0%, 15%, 0.9)', // For highlighted cells
        medium: 'hsla(0, 0%, 18%, 0.9)', // For info cells
        hover: 'hsla(0, 0%, 20%, 0.95)', // For hover states
        hoverLight: 'hsla(0, 0%, 16%, 0.9)', // For light hover states
    },
    // Migrated to semantic border colors
    borderColors: {
        light: COLORS.border.subtle,
        medium: COLORS.border.primary,
    },
    // Legacy button support for ZSharp - migrated to semantic colors
    legacyButton: {
        outlined: {
            color: COLORS.text.secondary,
            borderColor: COLORS.border.primary,
            '&:hover': {
                borderColor: COLORS.border.interactive,
                backgroundColor: COLORS.interactive.hover,
            },
        },
    },
};

// Meta Information
export const META = {
    title: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    description: `${PERSONAL_INFO.name} - Backend Developer and AI/ML Engineer specializing in cloud architecture, HPC systems, and machine learning research. Northwestern MS Computer Science graduate with experience at Volta Health and Center for Nuclear Femtography.`,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
};

// Development Constants
export const DEV = {
    localhost: 'http://localhost:3000',
    nodeVersion: 'v14 or higher',
};
