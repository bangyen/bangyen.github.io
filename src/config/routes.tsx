import { createHashRouter, Outlet } from 'react-router-dom';

import { ROUTES } from './constants';

import { RouteFeatureError } from '@/components/layout/RouteFeatureError';
import { RouteRootError } from '@/components/layout/RouteRootError';
import { lightsOutRoute } from '@/features/games/lights-out/route';
import { slantRoute } from '@/features/games/slant/route';
import { homeRoute } from '@/features/home/route';
import { researchRoutes } from '@/features/research/route';

/**
 * Centralised route table using React Router's data API.
 *
 * Uses `createHashRouter` for GitHub Pages compatibility.  Error
 * boundaries are handled via `errorElement` at each layout level,
 * and lazy loading uses the native `lazy` property instead of
 * `React.lazy` + `lazyNamed`.
 */
export const router = createHashRouter(
    [
        {
            errorElement: <RouteRootError />,
            element: <Outlet />,
            children: [
                {
                    errorElement: (
                        <RouteFeatureError
                            title="Home Error"
                            resetLabel="Reset Page"
                        />
                    ),
                    children: [homeRoute],
                },
                {
                    path: ROUTES.pages.Error,
                    lazy: async () => {
                        const { ErrorPage } =
                            await import('@/components/layout/ErrorPage');
                        return { Component: ErrorPage };
                    },
                },
                {
                    errorElement: (
                        <RouteFeatureError
                            title="Game Error"
                            resetLabel="Reset Game"
                        />
                    ),
                    children: [lightsOutRoute, slantRoute],
                },
                {
                    errorElement: (
                        <RouteFeatureError
                            title="Research Tool Error"
                            resetLabel="Reset Tool"
                        />
                    ),
                    children: researchRoutes,
                },
                {
                    path: '*',
                    lazy: async () => {
                        const { ErrorPage } =
                            await import('@/components/layout/ErrorPage');
                        return { Component: ErrorPage };
                    },
                },
            ],
        },
    ],
    { basename: '/' },
);
