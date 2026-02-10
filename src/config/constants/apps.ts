import { PERSONAL_INFO } from './identity';
import { PageTitles, Routes } from './types';

export const PAGE_TITLES: PageTitles = {
    home: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    lightsOut: 'Lights Out | Bangyen',
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    error: 'Page Not Found | Bangyen',
    interpreters: `Interpreters - ${PERSONAL_INFO.name}`,
    interpreter: (name: string) => `${name} Interpreter | Bangyen`,
    geography: 'Geography | Bangyen',
    lightsOutResearch: 'Lights Out Mechanics | Bangyen',
    slant: 'Slant | Bangyen',
};

export const ROUTES: Routes = {
    pages: {
        Home: '/',
        Error: '/error',
        Oligopoly: '/oligopoly',
        ZSharp: '/zsharp',
        LightsOut: '/lights-out',
        Interpreters: '/interpreters',
        Geography: '/geography',
        LightsOutResearch: '/research/lights-out',
        Slant: '/slant',
    },
    interpreters: {
        StunStep: 'stun-step',
        Suffolk: 'suffolk',
        WII2D: 'wii2d',
        Back: 'back',
    },
};

export const GLOBAL_CONFIG = {
    timer: {
        defaultSpeed: 200,
        resetDelay: 0,
    },
    processing: {
        doubleProcessingPrevention: true,
        resetDelay: 0,
    },
};
