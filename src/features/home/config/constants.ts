import { ProjectCategory } from '../types';

import { Psychology, GamepadRounded } from '@/components/icons';
import { ROUTES } from '@/config/constants';
import { COLORS } from '@/config/theme';

export const PROJECT_CATEGORIES: Record<string, ProjectCategory> = {
    research: {
        title: 'Research',
        icon: Psychology,
        color: COLORS.data.green,
        projects: {
            ZSharp: {
                path: ROUTES.pages.ZSharp,
                description: 'ML Optimization Method',
                technology: 'PyTorch',
            },
            Oligopoly: {
                path: ROUTES.pages.Oligopoly,
                description: 'Market Simulation Model',
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
                description: 'Algebraic Logic Puzzle',
                technology: 'JavaScript',
            },
            Slant: {
                path: ROUTES.pages.Slant,
                description: 'Path-finding Logic Puzzle',
                technology: 'TypeScript',
            },
        },
    },
};
