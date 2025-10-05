/**
 * Game configuration constants
 * Centralizes all game-related settings and parameters
 */

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
