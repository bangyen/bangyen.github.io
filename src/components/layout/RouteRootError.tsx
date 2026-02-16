import React from 'react';
import { useRouteError } from 'react-router-dom';

import { ErrorFallback } from './ErrorFallback';

import { logError } from '@/utils/errorReporting';

/**
 * Root-level error element for the data router.  Replaces the
 * class-based `ErrorBoundary` that previously wrapped `<HashRouter>`.
 * Uses `useRouteError()` and renders the existing `ErrorFallback` UI.
 */
export function RouteRootError() {
    const routeError = useRouteError();

    const error =
        routeError instanceof Error
            ? routeError
            : new Error(String(routeError));

    logError(error, { component: 'RouteRootError' });

    return (
        <ErrorFallback
            error={error}
            errorInfo={null}
            onReload={() => {
                globalThis.location.reload();
            }}
            onReset={() => {
                globalThis.location.hash = '#/';
                globalThis.location.reload();
            }}
        />
    );
}
