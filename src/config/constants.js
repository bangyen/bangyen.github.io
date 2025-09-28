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

// Color Palette
export const COLORS = {
    primary: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#1D4ED8',
    },
    secondary: {
        main: '#6B7280',
        light: '#9CA3AF',
        dark: '#374151',
    },
    background: {
        default: 'hsl(0, 0%, 0%)',
        paper: 'hsl(0, 0%, 5%)',
    },
    text: {
        primary: 'hsl(0, 0%, 90%)',
        secondary: 'hsl(0, 0%, 70%)',
    },
    gradients: {
        background:
            'linear-gradient(135deg, #0a0a0a 0%, #0e0e0e 50%, #0a0a0a 100%)',
        error: 'linear-gradient(135deg, #ffffff, #808080)',
    },
    chart: {
        blue: '#1976d2',
        orange: '#f57c00',
        green: '#2e7d32',
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
        content: '800px',
        wide: '900px',
        skills: '600px',
        error: '600px',
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
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out',
    },
    menuHover: {
        transform: 'translateX(4px)',
        transition: 'all 0.2s ease-in-out',
    },
};

// Component-specific constants
export const COMPONENTS = {
    menu: {
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
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
            xs: '6px 8px',
            sm: '12px 16px',
        },
        iconMargin: {
            left: { xs: '6px', sm: '12px' },
            right: { xs: '4px', sm: '8px' },
        },
    },
    card: {
        backgroundColor: 'rgba(128, 128, 128, 0.05)',
        border: '1px solid rgba(128, 128, 128, 0.2)',
        borderRadius: 2,
    },
    badge: {
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        color: 'primary.light',
        border: '1px solid rgba(25, 118, 210, 0.3)',
        fontSize: '0.75rem',
        height: '24px',
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
