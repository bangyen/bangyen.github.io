import type { ComponentType } from 'react';
import type React from 'react';

import { ROUTES } from './constants';

import { lazyNamed } from '@/utils/lazyNamed';

/**
 * A single entry in the application route table.
 */
export interface RouteEntry {
    /** URL path matched by React Router. */
    path: string;
    /** Lazy-loaded page component rendered at this path. */
    component: React.LazyExoticComponent<ComponentType>;
}

/**
 * Centralised route table that pairs every URL path with its lazy-loaded
 * page component.  Adding a new page is a single-line change here rather
 * than edits in two separate files.
 */
export const appRoutes: RouteEntry[] = [
    {
        path: ROUTES.pages.Home,
        component: lazyNamed(
            () => import('@/features/home/pages/Home'),
            'Home',
        ),
    },
    {
        path: ROUTES.pages.Error,
        component: lazyNamed(() => import('@/pages/Error'), 'Error'),
    },
    {
        path: ROUTES.pages.LightsOut,
        component: lazyNamed(
            () => import('@/features/games/lights-out/pages/LightsOut'),
            'LightsOut',
        ),
    },
    {
        path: ROUTES.pages.ZSharp,
        component: lazyNamed(
            () => import('@/features/research/pages/ZSharp'),
            'ZSharp',
        ),
    },
    {
        path: ROUTES.pages.Oligopoly,
        component: lazyNamed(
            () => import('@/features/research/pages/Oligopoly'),
            'Oligopoly',
        ),
    },
    {
        path: ROUTES.pages.Slant,
        component: lazyNamed(
            () => import('@/features/games/slant/pages/Slant'),
            'Slant',
        ),
    },
];

/** Lazy-loaded fallback component shown for unmatched routes. */
export const NotFoundPage = lazyNamed(() => import('@/pages/Error'), 'Error');
