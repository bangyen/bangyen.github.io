import {
    PageTitles,
    GameConstants,
    Routes,
    ChartDimensions,
    ChartFormatting,
    Percentage,
    Calculation,
    ZSharpDefaults,
    Timer,
    CellSize,
    Processing,
} from './types';
import { PERSONAL_INFO } from './identity';

export const PAGE_TITLES: PageTitles = {
    home: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    snake: 'Snake | Bangyen',
    lightsOut: 'Lights Out | Bangyen',
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    error: 'Page Not Found | Bangyen',
    interpreters: `Interpreters - ${PERSONAL_INFO.name}`,
    interpreter: (name: string) => `${name} Interpreter | Bangyen`,
    wikipediaQuiz: 'Wikipedia Quizzes | Bangyen',
};

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
    cctld: {
        defaultQuestionCount: 10,
        questionOptions: [5, 10, 20, 50],
    },
    telephone: {
        defaultQuestionCount: 10,
        questionOptions: [5, 10, 20, 50, 100],
    },
    vehicleRegistration: {
        defaultQuestionCount: 10,
        questionOptions: [5, 10, 20, 50, 100, 186],
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
        Oligopoly: '/oligopoly',
        ZSharp: '/zsharp',
        Snake: '/snake',
        Lights_Out: '/lights-out',
        Interpreters: '/interpreters',
        Wikipedia_Quiz: '/wikipedia',
    },
    interpreters: {
        Stun_Step: '/stun-step',
        Suffolk: '/suffolk',
        WII2D: '/wii2d',
        Back: '/back',
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

export const CCTLD_LANGUAGES = ['All', 'English', 'Non-English'];

export const CCTLD_ALIASES: Record<string, string[]> = {
    'united arab emirates': ['uae'],
    'united states': ['us', 'usa'],
    'united kingdom': ['uk'],
    'democratic republic of the congo': ['drc', 'congo dr'],
    'republic of the congo': ['congo'],
    'central african republic': ['car'],
    'british indian ocean territory': ['biot'],
    'saint vincent and the grenadines': ['st vincent'],
    'saint kitts and nevis': ['st kitts'],
    'antigua and barbuda': ['antigua'],
    'trinidad and tobago': ['trinidad'],
    'bosnia and herzegovina': ['bosnia'],
    'sao tome and principe': ['sao tome'],
    'turks and caicos islands': ['turks and caicos'],
};

export const TELEPHONE_ZONES = [
    { label: 'All', value: 'All' },
    { label: 'Zone 1: North American Numbering Plan (NANP)', value: '1' },
    { label: 'Zone 2: Mostly Africa', value: '2' },
    { label: 'Zone 3: Mostly Europe', value: '3' },
    { label: 'Zone 4: Mostly Europe', value: '4' },
    { label: 'Zone 5: South and Central Americas', value: '5' },
    { label: 'Zone 6: Southeast Asia and Oceania', value: '6' },
    { label: 'Zone 7: Russia and neighboring regions', value: '7' },
    {
        label: 'Zone 8: East Asia, Southeast Asia, and special services',
        value: '8',
    },
    { label: 'Zone 9: West, Central, and South Asia', value: '9' },
];

export const VEHICLE_CONVENTIONS = [
    { label: 'All', value: 'All' },
    { label: '1909 Paris Convention', value: '1909' },
    { label: '1924 Paris Convention', value: '1924' },
];

export const DRIVING_SIDE_FILTERS = [
    { label: 'All', value: 'All' },
    { label: 'Switched historically', value: 'Switched' },
    { label: 'Never switched', value: 'Never switched' },
];
