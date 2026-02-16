import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@/config/constants';

/**
 * Route entry for the Lights Out game page.  Kept alongside the
 * feature so route metadata and implementation stay co-located.
 */
export const lightsOutRoute: RouteObject = {
    path: ROUTES.pages.LightsOut,
    lazy: async () => {
        const { LightsOut } = await import('./pages/LightsOut');
        return { Component: LightsOut };
    },
};
