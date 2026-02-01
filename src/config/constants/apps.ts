import { PageTitles, Routes } from './types';
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
    geography: 'Geography | Bangyen',
    artQuiz: 'Art History Quiz | Bangyen',
};

export const ROUTES: Routes = {
    pages: {
        Oligopoly: '/oligopoly',
        ZSharp: '/zsharp',
        Snake: '/snake',
        Lights_Out: '/lights-out',
        Interpreters: '/interpreters',
        Geography: '/geography',
        ArtQuiz: '/art-quiz',
    },
    interpreters: {
        Stun_Step: '/stun-step',
        Suffolk: '/suffolk',
        WII2D: '/wii2d',
        Back: '/back',
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
