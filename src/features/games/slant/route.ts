import { ROUTES } from '@/config/constants';
import type { RouteEntry } from '@/config/routes';
import { lazyNamed } from '@/utils/lazyNamed';

/**
 * Route entry for the Slant puzzle page.  Kept alongside the feature
 * so route metadata and implementation stay co-located.
 */
export const slantRoute: RouteEntry = {
    path: ROUTES.pages.Slant,
    component: lazyNamed(() => import('./pages/Slant'), 'Slant'),
};
