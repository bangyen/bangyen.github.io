import { ROUTES } from '@/config/constants';
import type { RouteEntry } from '@/config/routes';
import { lazyNamed } from '@/utils/lazyNamed';

/**
 * Route entries for all research pages.  Kept alongside the feature
 * so route metadata and implementation stay co-located.
 */
export const researchRoutes: RouteEntry[] = [
    {
        path: ROUTES.pages.ZSharp,
        component: lazyNamed(() => import('./pages/ZSharp'), 'ZSharp'),
    },
    {
        path: ROUTES.pages.Oligopoly,
        component: lazyNamed(() => import('./pages/Oligopoly'), 'Oligopoly'),
    },
];
