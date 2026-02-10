import React from 'react';

import { Psychology, GamepadRounded, Code } from '@/components/icons';
import { ROUTES } from '@/config/constants';
import { COLORS } from '@/config/theme';

export interface ProjectInfo {
    path: string;
    description: string;
    technology: string;
}

export interface ProjectCategory {
    title: string;
    icon: React.ElementType;
    color: string;
    projects: Record<string, ProjectInfo>;
}

export const PROJECT_CATEGORIES: Record<string, ProjectCategory> = {
    research: {
        title: 'Research',
        icon: Psychology,
        color: COLORS.data.green,
        projects: {
            ZSharp: {
                path: ROUTES.pages.ZSharp,
                description: 'ML optimization method',
                technology: 'PyTorch',
            },
            Oligopoly: {
                path: ROUTES.pages.Oligopoly,
                description: 'Market simulation model',
                technology: 'FastAPI',
            },
        },
    },
    games: {
        title: 'Games',
        icon: GamepadRounded,
        color: COLORS.primary.main,
        projects: {
            Lights_Out: {
                path: ROUTES.pages.LightsOut,
                description: 'Grid-based logic puzzle',
                technology: 'JavaScript',
            },
            Slant: {
                path: ROUTES.pages.Slant,
                description: 'Diagonal line puzzle',
                technology: 'TypeScript',
            },
        },
    },
    collections: {
        title: 'Collections',
        icon: Code,
        color: COLORS.data.amber,
        projects: {
            Interpreters: {
                path: ROUTES.pages.Interpreters,
                description: 'Esoteric language demos',
                technology: 'JavaScript',
            },
            Geography: {
                path: ROUTES.pages.Geography,
                description: 'Geography and map quizzes',
                technology: 'React',
            },
        },
    },
};
