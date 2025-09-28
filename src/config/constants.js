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

// Color Palette - HSL-based neutral scheme
export const COLORS = {
    primary: {
        main: 'hsl(217, 91%, 60%)', // Blue
        light: 'hsl(217, 91%, 70%)', // Lighter blue
        dark: 'hsl(217, 91%, 50%)', // Darker blue
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
            medium: 'hsla(0, 0%, 100%, 0.7)',
        },
        legend: {
            light: 'hsla(0, 0%, 100%, 0.3)',
            lighter: 'hsla(0, 0%, 100%, 0.1)',
        },
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
    },
    maxWidth: {
        content: '50rem', // 800px
        wide: '56.25rem', // 900px
        skills: '37.5rem', // 600px
        error: '37.5rem', // 600px
        info: '75rem', // 1200px
        card: '25rem', // 400px
        small: '18.75rem', // 300px
        icon: '1.5rem', // 24px
        medium: '3.75rem', // 60px
        large: '5rem', // 80px
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
export const ANIMATIONS = {
    fadeIn: {
        timeout: 1000,
    },
    hover: {
        transform: 'translateY(-0.125rem)', // -2px
        transition: 'all 0.2s ease-in-out',
    },
    menuHover: {
        transform: 'translateX(0.25rem)', // 4px
        transition: 'all 0.2s ease-in-out',
    },
};

// Component-specific constants
export const COMPONENTS = {
    menu: {
        backdropFilter: 'blur(1.25rem)', // 20px
        backgroundColor: 'hsla(0, 0%, 15%, 0.9)', // Using raised background with transparency
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        padding: {
            height: '1rem',
            width: '1.5rem',
        },
    },
    chip: {
        height: {
            xs: '2.25rem', // 36px
            sm: '3rem', // 48px
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
        border: '0.0625rem solid hsla(0, 0%, 50%, 0.2)', // 1px
        borderRadius: 2,
    },
    cardLight: {
        backgroundColor: 'hsla(0, 0%, 50%, 0.05)', // Light card background
    },
    badge: {
        backgroundColor: 'hsla(207, 79%, 46%, 0.1)',
        color: 'primary.light',
        border: '0.0625rem solid hsla(207, 79%, 46%, 0.3)', // 1px
        fontSize: '0.75rem',
        height: '1.5rem', // 24px
    },
    button: {
        outlined: {
            borderColor: 'hsla(0, 0%, 100%, 0.3)',
            color: 'hsla(0, 0%, 100%, 0.7)',
            '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
            },
        },
        contained: {
            backgroundColor: 'primary.main',
            color: 'hsl(0, 0%, 100%)',
            '&:hover': {
                backgroundColor: 'primary.dark',
            },
        },
    },
    navigation: {
        backgroundColor: 'hsla(0, 0%, 15%, 0.8)',
        border: '0.0625rem solid hsla(0, 0%, 100%, 0.1)', // 1px
        backdropFilter: 'blur(1.25rem)', // 20px
        boxShadow: '0 0.5rem 2rem hsla(0, 0%, 0%, 0.3)', // 8px 32px
    },
    borders: {
        light: '0.0625rem solid hsla(0, 0%, 50%, 0.2)', // 1px
        white: '0.0625rem solid hsla(0, 0%, 100%, 0.1)', // 1px
        medium: '0.0625rem solid hsla(0, 0%, 50%, 0.3)', // 1px
        mediumWhite: '0.0625rem solid hsla(0, 0%, 50%, 0.25)', // 1px
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
            light: 'hsla(0, 0%, 10%, 0.2)',
            medium: 'hsla(0, 0%, 10%, 0.3)',
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
    themeColor: 'hsl(0, 0%, 95%)',
    backgroundColor: 'hsl(0, 0%, 5%)',
};

// Development Constants
export const DEV = {
    localhost: 'http://localhost:3000',
    nodeVersion: 'v14 or higher',
};
