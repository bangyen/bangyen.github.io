import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@/config/constants';

/**
 * Route entry for the Slant puzzle page.  Kept alongside the feature
 * so route metadata and implementation stay co-located.
 */
export const slantRoute: RouteObject = {
    path: ROUTES.pages.Slant,
    lazy: async () => {
        const { Slant } = await import('./pages/Slant');
        return { Component: Slant };
    },
};
