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

export interface GameConstants {
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
    cctld: {
        defaultQuestionCount: number;
        questionOptions: number[];
    };
    telephone: {
        defaultQuestionCount: number;
        questionOptions: number[];
    };
    vehicleRegistration: {
        defaultQuestionCount: number;
        questionOptions: number[];
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

export interface Routes {
    pages: {
        Oligopoly: string;
        ZSharp: string;
        Snake: string;
        Lights_Out: string;
        Interpreters: string;
        Geography: string;
        LightsOutResearch: string;
        Slant: string;
    };
    interpreters: {
        Stun_Step: string;
        Suffolk: string;
        WII2D: string;
        Back: string;
    };
}

export interface ChartDimensions {
    height: number;
    dotRadius: number;
    strokeWidth: number;
}

export interface ChartFormatting {
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

export interface Percentage {
    multiplier: number;
    divisor: number;
}

export interface Calculation {
    spaceDivisor: number;
    pixelMultiplier: number;
}

export interface ZSharpDefaults {
    baseAccuracy: number;
    maxAccuracy: number;
    baseLoss: number;
    minLoss: number;
    improvement: number;
    lossReduction: number;
    maxEpochs: number;
}

export interface Timer {
    defaultSpeed: number;
    resetDelay: number;
}

export interface CellSize {
    divisor: number;
    fontSizeMultiplier: number;
}

export interface Processing {
    doubleProcessingPrevention: boolean;
    resetDelay: number;
}

export interface Meta {
    title: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
}

export interface PageTitles {
    home: string;
    snake: string;
    lightsOut: string;
    zsharp: string;
    oligopoly: string;
    error: string;
    interpreters: string;
    geography: string;
    lightsOutResearch: string;
    slant: string;
    interpreter: (name: string) => string;
}
