import React from 'react';

import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { FeatureErrorFallback } from '@/components/layout/FeatureErrorFallback';

/**
 * Game-specific error boundary that catches render errors inside a game
 * page and shows a "Game Error" card with a reset button instead of
 * crashing the entire application.
 */
export const GameErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) => (
                <FeatureErrorFallback
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                    title="Game Error"
                    resetLabel="Reset Game"
                />
            )}
        >
            {children}
        </ErrorBoundary>
    );
};
