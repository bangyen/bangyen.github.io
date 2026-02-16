import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@/config/constants';

/**
 * Route entries for all research pages.  Kept alongside the feature
 * so route metadata and implementation stay co-located.
 *
 * Data-fetching research pages use `loader` functions so that data
 * loads in parallel with the component code, eliminating the
 * fetch-in-effect waterfall.
 */
export const researchRoutes: RouteObject[] = [
    {
        path: ROUTES.pages.ZSharp,
        lazy: async () => {
            const { ZSharp } = await import('./pages/ZSharp');
            const { loadRealZSharpData } = await import('./pages/zsharpConfig');
            return {
                Component: ZSharp,
                loader: async () => {
                    try {
                        return await loadRealZSharpData();
                    } catch {
                        return [];
                    }
                },
            };
        },
    },
    {
        path: ROUTES.pages.Oligopoly,
        lazy: async () => {
            const { Oligopoly } = await import('./pages/Oligopoly');
            const { loadRealSimulationMatrix } =
                await import('./pages/oligopolyConfig');
            return {
                Component: Oligopoly,
                loader: async () => {
                    try {
                        return await loadRealSimulationMatrix();
                    } catch {
                        return [];
                    }
                },
            };
        },
    },
];
