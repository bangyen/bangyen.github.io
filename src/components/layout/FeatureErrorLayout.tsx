import React from 'react';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from './ErrorBoundary';
import { FeatureErrorFallback } from './FeatureErrorFallback';

export interface FeatureErrorLayoutProps {
    /** Heading shown in the error fallback, e.g. "Game Error". */
    title?: string;
    /** Label for the reset button, e.g. "Reset Game". */
    resetLabel?: string;
}

/**
 * Layout-route component that wraps child routes in an ErrorBoundary
 * with `FeatureErrorFallback`.  Used in the route table so that
 * individual feature pages (games, research, etc.) no longer need to
 * include their own ErrorBoundary wrapper.
 */
export function FeatureErrorLayout({
    title = 'Error',
    resetLabel = 'Reset',
}: FeatureErrorLayoutProps) {
    return (
        <ErrorBoundary
            FallbackComponent={FeatureErrorFallback}
            fallbackProps={{ title, resetLabel }}
        >
            <Outlet />
        </ErrorBoundary>
    );
}
