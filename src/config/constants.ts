/**
 * Application configuration constants
 * Centralizes personal information, URLs, meta data, app-level settings, and game configuration
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PersonalInfo {
    name: string;
    title: string;
    location: string;
    greeting: string;
}

interface Urls {
    githubProfile: string;
    zsharpRepo: string;
    oligopolyRepo: string;
    esolangsRepo: string;
    publications: {
        cluster2023: string;
        sc2024: string;
    };
    fonts: {
        googleFonts: string;
        googleFontsStatic: string;
        interFont: string;
    };
    local: {
        localhost: string;
        liveSite: string;
    };
}

interface Skill {
    name: string;
    icon: string;
}

interface Publication {
    title: string;
    conference: string;
    url: string;
    description: string;
}

interface Project {
    title: string;
    technology: string;
    url: string;
    description: string;
}

interface GameConstants {
    snake: {
        initialLength: number;
        segmentSize: number;
        initialVelocity: number;
    };
    oligopoly: {
        defaultFirms: number;
        defaultElasticity: number;
        defaultBasePrice: number;
        maxRounds: number;
        simulation: {
            fallbackPrice: number;
            fallbackHHI: number;
            collusionStart: number;
            collusionEnd: number;
            priceAmplitude: number;
            hhiAmplitude: number;
            priceFrequency: number;
            hhiFrequency: number;
        };
    };
    lightsOut: {
        defaultSize: number;
    };
    gridSizes: {
        mobile: number;
        desktop: number;
    };
    modelTypes: {
        cournot: string;
    };
    controls: {
        arrowPrefix: string;
    };
}

interface Routes {
    pages: {
        Oligopoly: string;
        ZSharp: string;
        Snake: string;
        Lights_Out: string;
        Interpreters: string;
    };
    interpreters: {
        Stun_Step: string;
        Suffolk: string;
        WII2D: string;
        Back: string;
    };
}

interface ChartDimensions {
    height: number;
    dotRadius: number;
    strokeWidth: number;
}

interface ChartFormatting {
    price: {
        format: string;
        prefix: string;
        decimals: number;
    };
    axis: {
        padding: number;
        strokeWidth: number;
    };
    tooltip: {
        strokeWidth: number;
    };
    lines: {
        strokeDashArray: string;
        defaultStrokeWidth: number;
    };
}

interface Percentage {
    multiplier: number;
    divisor: number;
}

interface Calculation {
    spaceDivisor: number;
    pixelMultiplier: number;
}

interface ZSharpDefaults {
    baseAccuracy: number;
    maxAccuracy: number;
    baseLoss: number;
    minLoss: number;
    improvement: number;
    lossReduction: number;
    maxEpochs: number;
}

interface Timer {
    defaultSpeed: number;
    resetDelay: number;
}

interface CellSize {
    divisor: number;
    fontSizeMultiplier: number;
}

interface Processing {
    doubleProcessingPrevention: boolean;
    resetDelay: number;
}

interface Meta {
    title: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
}

interface PageTitles {
    home: string;
    snake: string;
    lightsOut: string;
    zsharp: string;
    oligopoly: string;
    error: string;
    interpreters: string;
    interpreter: (name: string) => string;
}

// ============================================================================
// PERSONAL INFORMATION & CONTENT
// ============================================================================

export const PERSONAL_INFO: PersonalInfo = {
    name: 'Bangyen Pham',
    title: 'Backend Developer & AI/ML Engineer',
    location: 'Chicago, IL',
    greeting: "Hey, I'm Bangyen",
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

export const SKILLS: Skill[] = [
    { name: 'Python', icon: 'Code' },
    { name: 'PyTorch', icon: 'Psychology' },
    { name: 'JavaScript', icon: 'Code' },
    { name: 'AWS/GCP', icon: 'Cloud' },
    { name: 'Docker', icon: 'Work' },
    { name: 'TensorFlow', icon: 'Psychology' },
];

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

export const META: Meta = {
    title: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    description: `${PERSONAL_INFO.name} - Backend Developer and AI/ML Engineer specializing in cloud architecture, HPC systems, and machine learning research. Northwestern MS Computer Science graduate with experience at Volta Health and Center for Nuclear Femtography.`,
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
};

export const PAGE_TITLES: PageTitles = {
    home: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    snake: 'Snake | Bangyen',
    lightsOut: 'Lights Out | Bangyen',
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    error: 'Page Not Found | Bangyen',
    interpreters: `Interpreters - ${PERSONAL_INFO.name}`,
    interpreter: (name: string) => `${name} Interpreter | Bangyen`,
};

// ============================================================================
// GAME CONFIGURATION
// ============================================================================

export const GAME_CONSTANTS: GameConstants = {
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
    gridSizes: {
        mobile: 3,
        desktop: 5,
    },
    modelTypes: {
        cournot: 'cournot',
    },
    controls: {
        arrowPrefix: 'arrow',
    },
};

export const ROUTES: Routes = {
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

export const CHART_DIMENSIONS: ChartDimensions = {
    height: 300,
    dotRadius: 4,
    strokeWidth: 3,
};

export const CHART_FORMATTING: ChartFormatting = {
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

export const PERCENTAGE: Percentage = {
    multiplier: 100,
    divisor: 100,
};

export const CALCULATION: Calculation = {
    spaceDivisor: 20,
    pixelMultiplier: 16,
};

export const ZSHARP_DEFAULTS: ZSharpDefaults = {
    baseAccuracy: 0.65,
    maxAccuracy: 0.75,
    baseLoss: 2.0,
    minLoss: 0.8,
    improvement: 0.05,
    lossReduction: 0.1,
    maxEpochs: 20,
};

export const TIMER: Timer = {
    defaultSpeed: 200,
    resetDelay: 0,
};

export const CELL_SIZE: CellSize = {
    divisor: 4,
    fontSizeMultiplier: 0.25,
};

export const PROCESSING: Processing = {
    doubleProcessingPrevention: true,
    resetDelay: 0,
};

