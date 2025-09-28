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

// Color Palette - HSL-based neutral scheme following video transcript guidelines
export const COLORS = {
    primary: {
        main: 'hsl(217, 91%, 60%)', // Blue
        light: 'hsl(217, 91%, 70%)', // Lighter blue
        dark: 'hsl(217, 91%, 50%)', // Darker blue
        darker: 'hsl(217, 91%, 35%)', // Much darker blue for high contrast
    },
    secondary: {
        main: 'hsl(220, 9%, 46%)', // Gray
        light: 'hsl(220, 9%, 66%)', // Lighter gray
        dark: 'hsl(220, 9%, 26%)', // Darker gray
    },
    background: {
        default: 'hsl(0, 0%, 5%)', // Base color - 5% lightness
        paper: 'hsl(0, 0%, 10%)', // Cards and surfaces - 10% lightness
        raised: 'hsl(0, 0%, 15%)', // Most important/raised elements - 15% lightness
    },
    text: {
        primary: 'hsl(0, 0%, 90%)', // High contrast for headings and important elements
        secondary: 'hsl(0, 0%, 70%)', // Muted shade for body text - still legible
        white: 'hsl(0, 0%, 100%)', // Pure white for high contrast elements
    },
    chart: {
        blue: 'hsl(207, 79%, 46%)',
        orange: 'hsl(32, 100%, 48%)',
        green: 'hsl(122, 47%, 35%)',
        stroke: {
            light: 'hsla(0, 0%, 100%, 0.1)',
            medium: 'hsla(0, 0%, 100%, 0.7)',
        },
        fill: {
            blue: 'hsla(207, 79%, 46%, 0.1)',
            orange: 'hsla(32, 100%, 48%, 0.1)',
            green: 'hsla(122, 47%, 35%, 0.1)',
            medium: 'hsla(0, 0%, 100%, 0.7)', // Added missing medium fill
        },
        legend: {
            light: 'hsla(0, 0%, 100%, 0.3)',
            lighter: 'hsla(0, 0%, 100%, 0.1)',
        },
    },
    gradients: {
        background:
            'linear-gradient(135deg, #0a0a0a 0%, #0e0e0e 50%, #0a0a0a 100%)',
        error: 'linear-gradient(135deg, #ffffff, #808080)',
    },
};

// Spacing and Dimensions
export const SPACING = {
    padding: {
        xs: '1rem',
        sm: '1.5rem',
        md: '2rem',
    },
    margin: {
        xs: '1rem',
        sm: '1.5rem',
        md: '2rem',
    },
    borderRadius: {
        small: 2,
        medium: 3,
        extraLarge: 4, // Added missing extraLarge border radius
    },
    maxWidth: {
        content: '800px',
        wide: '900px',
        skills: '600px',
        error: '600px',
        info: '1000px', // For help page layout
        card: '500px', // For help page text content
    },
};

// Typography
export const TYPOGRAPHY = {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: {
        xs: {
            h1: '2rem',
            h5: '0.95rem',
            h6: '0.9rem',
            body: '0.8rem',
        },
        sm: {
            h1: '3.5rem',
            h5: '1.3rem',
            h6: '1rem',
            body: '1rem',
        },
        md: {
            h1: '4rem',
        },
        large: '1.2rem',
        icon: '1rem', // Same as sm.body - could be referenced but kept separate for clarity
    },
    fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
    },
};

// Animation and Transitions
const baseTransition = 'all 0.2s ease-in-out';
export const ANIMATIONS = {
    fadeIn: {
        timeout: 1000,
    },
    transition: baseTransition, // Common transition for reuse
    hover: {
        transform: 'translateY(-0.125rem)', // -2px
        transition: baseTransition,
    },
    menuHover: {
        transform: 'translateX(0.25rem)', // 4px
        transition: baseTransition,
    },
};

// Component-specific constants
const baseBorder = '1px solid';
const baseBackdropFilter = 'blur(20px)';

export const COMPONENTS = {
    menu: {
        backdropFilter: baseBackdropFilter,
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        border: `${baseBorder} rgba(255, 255, 255, 0.1)`,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: {
            height: '1rem',
            width: '1.5rem',
        },
    },
    chip: {
        height: {
            xs: '36px',
            sm: '48px',
        },
        padding: {
            xs: '0.375rem 0.5rem', // 6px 8px
            sm: '0.75rem 1rem', // 12px 16px
        },
        iconMargin: {
            left: { xs: '0.375rem', sm: '0.75rem' }, // 6px 12px
            right: { xs: '0.25rem', sm: '0.5rem' }, // 4px 8px
        },
    },
    card: {
        backgroundColor: 'hsla(0, 0%, 10%, 0.5)', // Using paper background with transparency
        border: `${baseBorder} hsla(0, 0%, 50%, 0.2)`,
        borderRadius: SPACING.borderRadius.small,
    },
    cardLight: {
        backgroundColor: 'hsla(0, 0%, 50%, 0.05)', // Light card background
    },
    badge: {
        backgroundColor: 'hsla(207, 79%, 46%, 0.1)',
        color: COLORS.primary.light, // Fixed: now references actual color value
        border: `${baseBorder} hsla(207, 79%, 46%, 0.3)`,
        fontSize: '0.75rem',
        height: '1.5rem', // 24px
    },
    button: {
        outlined: {
            borderColor: 'hsla(0, 0%, 100%, 0.3)',
            color: 'hsla(0, 0%, 100%, 0.7)',
            '&:hover': {
                borderColor: COLORS.primary.main, // Fixed: now references actual color value
                backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
            },
        },
        contained: {
            backgroundColor: COLORS.primary.main, // Fixed: now references actual color value
            color: 'hsl(0, 0%, 100%)',
            '&:hover': {
                backgroundColor: COLORS.primary.dark, // Fixed: now references actual color value
            },
        },
    },
    navigation: {
        backgroundColor: 'hsla(0, 0%, 15%, 0.8)',
        border: `${baseBorder} hsla(0, 0%, 100%, 0.1)`,
        backdropFilter: baseBackdropFilter,
        boxShadow: '0 0.5rem 2rem hsla(0, 0%, 0%, 0.3)', // 8px 32px
    },
    borders: {
        light: `${baseBorder} hsla(0, 0%, 50%, 0.2)`,
        white: `${baseBorder} hsla(0, 0%, 100%, 0.1)`,
        medium: `${baseBorder} hsla(0, 0%, 50%, 0.3)`,
        mediumWhite: `${baseBorder} hsla(0, 0%, 50%, 0.25)`,
    },
    borderColors: {
        light: 'hsla(0, 0%, 50%, 0.2)',
        medium: 'hsla(0, 0%, 50%, 0.25)',
    },
    overlays: {
        dark: 'hsla(0, 0%, 10%, 0.9)',
        light: 'hsla(0, 0%, 50%, 0.1)',
        lighter: 'hsla(0, 0%, 50%, 0.05)',
        medium: 'hsla(0, 0%, 50%, 0.08)',
        hover: 'hsla(0, 0%, 50%, 0.15)',
        hoverLight: 'hsla(0, 0%, 50%, 0.12)',
    },
    hsl: {
        hover: {
            light: 'hsla(0, 0%, 50%, 0.15)', // Improved contrast for chips
            medium: 'hsla(0, 0%, 50%, 0.25)', // Improved contrast for cards
            strong: 'hsla(0, 0%, 50%, 0.35)', // New option for important elements
        },
        text: {
            error: 'hsl(0, 0%, 93%)',
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
