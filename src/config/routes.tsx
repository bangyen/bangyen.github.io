/* eslint-disable react-refresh/only-export-components -- route config, not a component file */
import React from 'react';
import type { ComponentType, ReactElement } from 'react';

import { ROUTES } from './constants';

import { FeatureErrorLayout } from '@/components/layout/FeatureErrorLayout';
import { lightsOutRoute } from '@/features/games/lights-out/route';
import { slantRoute } from '@/features/games/slant/route';
import { homeRoute } from '@/features/home/route';
import { researchRoutes } from '@/features/research/route';
import { lazyNamed } from '@/utils/lazyNamed';

/**
 * A single entry in the application route table.
 *
 * Supports both leaf routes (path + component) and layout routes
 * (element + children) for nested error-boundary groups.
 */
export interface RouteEntry {
    /** URL path matched by React Router (leaf routes only). */
    path?: string;
    /** Lazy-loaded page component rendered at this path. */
    component?: React.LazyExoticComponent<ComponentType>;
    /** Static element rendered for layout routes (e.g. FeatureErrorLayout). */
    element?: ReactElement;
    /** Nested child routes rendered inside the layout's <Outlet>. */
    children?: RouteEntry[];
}

/**
 * Centralised route table that aggregates per-feature route entries
 * and groups them under shared layout routes (e.g. error boundaries).
 * Adding a new page is a single-file change inside its feature folder.
 */
export const appRoutes: RouteEntry[] = [
    homeRoute,
    {
        path: ROUTES.pages.Error,
        component: lazyNamed(() => import('@/pages/Error'), 'Error'),
    },
    {
        element: (
            <FeatureErrorLayout title="Game Error" resetLabel="Reset Game" />
        ),
        children: [lightsOutRoute, slantRoute],
    },
    {
        element: (
            <FeatureErrorLayout
                title="Research Tool Error"
                resetLabel="Reset Component"
            />
        ),
        children: researchRoutes,
    },
];

/** Lazy-loaded fallback component shown for unmatched routes. */
export const NotFoundPage = lazyNamed(() => import('@/pages/Error'), 'Error');
