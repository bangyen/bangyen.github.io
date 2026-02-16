import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@/config/constants';

/**
 * Route entry for the Home page.  Lives alongside the feature so
 * adding or removing the page is a single-directory operation.
 */
export const homeRoute: RouteObject = {
    path: ROUTES.pages.Home,
    lazy: async () => {
        const { Home } = await import('./pages/Home');
        return { Component: Home };
    },
};
