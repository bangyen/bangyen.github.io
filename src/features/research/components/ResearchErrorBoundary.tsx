import React from 'react';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';

/**
 * Research-specific error boundary that catches render errors inside a
 * research demo page and shows a "Research Tool Error" card with a reset
 * button instead of crashing the entire application.
 */
export const ResearchErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) => (
                <FeatureErrorFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    title="Research Tool Error"
                    resetLabel="Reset Component"
                />
            )}
        >
            {children}
        </ErrorBoundary>
    );
};
