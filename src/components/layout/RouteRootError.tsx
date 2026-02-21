import { useRouteError } from 'react-router-dom';

import { ErrorFallback } from './ErrorFallback';

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

    // eslint-disable-next-line no-console
    console.error('[RouteRootError]', error);

    return (
        <ErrorFallback
            error={error}
            errorInfo={null}
            onReload={() => {
                globalThis.location.reload();
            }}
        />
    );
}
