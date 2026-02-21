import { Refresh, ArrowBackRounded, HomeRounded } from '@/components/icons';

/**
 * Type definitions for application configuration
 */

export interface PersonalInfo {
    name: string;
    title: string;
    location: string;
    greeting: string;
    email: string;
}

export interface Urls {
    githubProfile: string;
    zsharpRepo: string;
    oligopolyRepo: string;
    esolangsRepo: string;
    publications: {
        cluster2023: string;
        sc2024: string;
    };
    local: {
        localhost: string;
        liveSite: string;
    };
}

export interface Skill {
    name: string;
    icon: string;
}

export interface Publication {
    title: string;
    conference: string;
    url: string;
    description: string;
}

export interface Project {
    title: string;
    technology: string;
    url: string;
    description: string;
}

export interface PageTitles {
    home: string;
    lightsOut: string;
    zsharp: string;
    oligopoly: string;
    error: string;
    slant: string;
}

export interface Routes {
    pages: {
        Home: string;
        Error: string;
        Oligopoly: string;
        ZSharp: string;
        LightsOut: string;
        Slant: string;
    };
}

export interface Meta {
    title: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
}

// --- ACTUAL CONSTANTS ---

export const PERSONAL_INFO: PersonalInfo = {
    name: 'Bangyen Pham',
    title: 'Backend Developer & AI/ML Engineer',
    location: 'Chicago, IL',
    greeting: "Hey, I'm Bangyen",
    email: 'bangyenp@gmail.com',
};

export const URLS: Urls = {
    githubProfile: 'https://github.com/bangyen',
    zsharpRepo: 'https://github.com/bangyen/zsharp',
    oligopolyRepo: 'https://github.com/bangyen/oligopoly',
    esolangsRepo: 'https://github.com/bangyen/esolangs',
    publications: {
        cluster2023: 'https://ieeexplore.ieee.org/document/10319968',
        sc2024: 'https://ieeexplore.ieee.org/document/10793131',
    },
    local: {
        localhost: 'http://localhost:3000',
        liveSite: 'https://bangyen.github.io',
    },
};

export const SKILLS: Skill[] = [
    { name: 'Python', icon: 'Code' },
    { name: 'PyTorch', icon: 'Psychology' },
    { name: 'JavaScript', icon: 'Code' },
    { name: 'AWS/GCP', icon: 'Cloud' },
    { name: 'Docker', icon: 'Work' },
    { name: 'TensorFlow', icon: 'Psychology' },
];

export const META: Meta = {
    title: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    description: `${PERSONAL_INFO.name} - Backend Developer and AI/ML Engineer specializing in cloud architecture, HPC systems, and machine learning research. Northwestern MS Computer Science graduate with experience at Volta Health and Center for Nuclear Femtography.`,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
};

export const PUBLICATIONS: Publication[] = [
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

export const PROJECTS: Project[] = [
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

export const PAGE_TITLES: PageTitles = {
    home: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    lightsOut: 'Lights Out | Bangyen',
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    error: 'Page Not Found | Bangyen',
    slant: 'Slant | Bangyen',
};

export const ROUTES: Routes = {
    pages: {
        Home: '/',
        Error: '/error',
        Oligopoly: '/oligopoly',
        ZSharp: '/zsharp',
        LightsOut: '/lights-out',
        Slant: '/slant',
    },
};

/**
 * Standardised user-facing text for error components.
 * Centralises copy across 404, crash screens, and feature boundaries.
 */
export const ERROR_TEXT = {
    title: {
        default: 'Something went wrong',
        notFound: 'Page Not Found',
        failedToLoad: 'Failed to Load',
    },
    message: {
        default: 'An unexpected error occurred.',
        notFound: "This page doesn't exist or has been moved.",
        failedToLoad: 'Please check your connection and try again.',
        appCrash: 'An unexpected error occurred while rendering this page.',
    },
    labels: {
        tryAgain: 'Try Again',
        reloadPage: 'Reload Page',
        goBack: 'Go Back',
        returnToHome: 'Return to Home',
        returnToGame: 'Return to Game',
    },
} as const;

/**
 * Standardised icons for error actions.
 */
export const ERROR_ICONS = {
    recovery: Refresh,
    back: ArrowBackRounded,
    home: HomeRounded,
} as const;
