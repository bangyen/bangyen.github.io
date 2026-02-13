import type { ResearchConfig } from '../types';

export const RESEARCH_CONSTANTS: ResearchConfig = {
    oligopoly: {
        defaultFirms: 3,
        defaultElasticity: 2,
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
        options: {
            firms: [
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
            ],
            elasticity: [
                { value: 1.5, label: '1.5' },
                { value: 2, label: '2.0' },
                { value: 2.5, label: '2.5' },
            ],
            price: [
                { value: 30, label: '$30' },
                { value: 40, label: '$40' },
                { value: 50, label: '$50' },
            ],
        },
    },
    zsharp: {
        baseAccuracy: 0.65,
        maxAccuracy: 0.75,
        baseLoss: 2,
        minLoss: 0.8,
        improvement: 0.05,
        lossReduction: 0.1,
        maxEpochs: 20,
        yAxisPadding: 0.05,
        lossPadding: 0.1,
        gapPadding: 0.005,
        convergencePadding: 0.005,
    },
    lightsOut: {
        yAxisMax: 70,
    },
    modelTypes: {
        cournot: 'cournot',
    },
};

export const RESEARCH_TITLES = {
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    lightsOut: 'Lights Out - Matrix Mechanics',
};

export const CHART_DIMENSIONS = {
    height: 300,
    dotRadius: 4,
    strokeWidth: 3,
};

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

export const PERCENTAGE = {
    multiplier: 100,
    divisor: 100,
};

export const CALCULATION = {
    spaceDivisor: 20,
    pixelMultiplier: 16,
};
