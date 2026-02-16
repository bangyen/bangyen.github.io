import { ROUTES } from '@/config/constants';
import type { RouteEntry } from '@/config/routes';
import { lazyNamed } from '@/utils/lazyNamed';

/**
 * Route entry for the Lights Out game page.  Kept alongside the
 * feature so route metadata and implementation stay co-located.
 */
export const lightsOutRoute: RouteEntry = {
    path: ROUTES.pages.LightsOut,
    component: lazyNamed(() => import('./pages/LightsOut'), 'LightsOut'),
};
