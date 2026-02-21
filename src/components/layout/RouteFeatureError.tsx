import { useCallback } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';

import { FeatureErrorFallback } from './FeatureErrorFallback';

import { ERROR_TEXT } from '@/config/constants';

export interface RouteFeatureErrorProps {
    /** Heading shown in the error fallback, e.g. "Game Error". */
    title?: string;
    /** Label for the reset button, e.g. "Reset Game". */
    resetLabel?: string;
}

/**
 * Error element for data-router layout routes.  Bridges React Router's
 * `errorElement` API with the existing `FeatureErrorFallback` UI by
 * reading the error via `useRouteError()` and resetting by navigating
 * to the current path (which clears the router error state).
 */
export function RouteFeatureError({
    title = ERROR_TEXT.title.default,
    resetLabel = ERROR_TEXT.labels.tryAgain,
}: RouteFeatureErrorProps) {
    const routeError = useRouteError();
    const navigate = useNavigate();

    const error =
        routeError instanceof Error
            ? routeError
            : new Error(String(routeError));

    // eslint-disable-next-line no-console
    console.error('[RouteFeatureError]', error);

    const handleReset = useCallback(() => {
        void navigate(0);
    }, [navigate]);

    return (
        <FeatureErrorFallback
            error={error}
            resetErrorBoundary={handleReset}
            title={title}
            resetLabel={resetLabel}
        />
    );
}
