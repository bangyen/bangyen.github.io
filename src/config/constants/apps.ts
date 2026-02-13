import { PERSONAL_INFO } from './identity';
import type { PageTitles, Routes } from './types';

export const PAGE_TITLES: PageTitles = {
    home: `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`,
    lightsOut: 'Lights Out | Bangyen',
    zsharp: 'ZSharp - Sharpness-Aware Minimization',
    oligopoly: 'Oligopoly - Cournot Competition',
    error: 'Page Not Found | Bangyen',
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
        LightsOutResearch: '/research/lights-out',
        Slant: '/slant',
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
