import { ROUTES } from '@/config/constants';
import type { RouteEntry } from '@/config/routes';
import { lazyNamed } from '@/utils/lazyNamed';

/**
 * Route entry for the Home page.  Lives alongside the feature so
 * adding or removing the page is a single-directory operation.
 */
export const homeRoute: RouteEntry = {
    path: ROUTES.pages.Home,
    component: lazyNamed(() => import('./pages/Home'), 'Home'),
};
