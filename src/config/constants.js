/**
 * Application configuration constants
 * Centralizes personal information, URLs, meta data, app-level settings, and game configuration
 */

// ============================================================================
// PERSONAL INFORMATION & CONTENT
// ============================================================================

// Personal Information
export const PERSONAL_INFO = {
    name: 'Bangyen Pham',
    title: 'Backend Developer & AI/ML Engineer',
    location: 'Chicago, IL',
    greeting: "Hey, I'm Bangyen",
};

// URLs and Links
export const URLS = {
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

// Meta Information
export const META = {
    title: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    description: `${PERSONAL_INFO.name} - Backend Developer and AI/ML Engineer specializing in cloud architecture, HPC systems, and machine learning research. Northwestern MS Computer Science graduate with experience at Volta Health and Center for Nuclear Femtography.`,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
};

// Page Titles
export const PAGE_TITLES = {
    home: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    snake: 'Snake | Bangyen',
    lightsOut: 'Lights Out | Bangyen',
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    error: 'Page Not Found | Bangyen',
    interpreters: `Interpreters - ${PERSONAL_INFO.name}`,
    interpreter: name => `${name} Interpreter | Bangyen`,
};

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

// Game Constants - Consolidated with all game-related settings
export const GAME_CONSTANTS = {
    snake: {
        initialLength: 3,
        segmentSize: 3,
        initialVelocity: 1,
    },
    oligopoly: {
        defaultFirms: 3,
        defaultElasticity: 2.0,
        defaultBasePrice: 40,
        maxRounds: 15,
        // Simulation fallback constants
        simulation: {
            fallbackPrice: 20,
            fallbackHHI: 0.3,
            collusionStart: 6,
            collusionEnd: 10,
            priceAmplitude: 5,
            hhiAmplitude: 0.1,
            priceFrequency: 0.3,
            hhiFrequency: 0.1,
        },
    },
    lightsOut: {
        defaultSize: 5,
    },
    // Grid sizes for different screen sizes
    gridSizes: {
        mobile: 3,
        desktop: 5,
    },
    // Model types and game controls
    modelTypes: {
        cournot: 'cournot',
    },
    controls: {
        arrowPrefix: 'arrow',
    },
};

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

// Common Chart Dimensions
export const CHART_DIMENSIONS = {
    height: 300,
    dotRadius: 4,
    strokeWidth: 3,
};

// Chart Formatting and Styling Constants
export const CHART_FORMATTING = {
    price: {
        format: '$.2f',
        prefix: '$',
        decimals: 2,
    },
    axis: {
        padding: 5,
        strokeWidth: 2,
    },
    tooltip: {
        strokeWidth: 2,
    },
    lines: {
        strokeDashArray: '3 3',
        defaultStrokeWidth: 2,
    },
};

// Percentage Conversion Constants
export const PERCENTAGE = {
    multiplier: 100,
    divisor: 100,
};

// Calculation Constants - Extracted from calculate.js
export const CALCULATION = {
    spaceDivisor: 20,
    pixelMultiplier: 16,
};

// ZSharp Simulation Defaults
export const ZSHARP_DEFAULTS = {
    baseAccuracy: 0.65,
    maxAccuracy: 0.75,
    baseLoss: 2.0,
    minLoss: 0.8,
    improvement: 0.05,
    lossReduction: 0.1,
    maxEpochs: 20,
};
