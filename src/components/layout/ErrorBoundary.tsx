import React from 'react';

import { ErrorFallback } from './ErrorFallback';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    FallbackComponent?: React.ComponentType<{
        error: Error | null;
        resetErrorBoundary: () => void;
        [key: string]: unknown;
    }>;
    /** Extra props forwarded to FallbackComponent alongside error and resetErrorBoundary. */
    fallbackProps?: Record<string, unknown>;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents entire application from crashing when a component throws an error
 */
class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
        return { hasError: true };
    }

    override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log error details for debugging
        globalThis.console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });

        // In production, you might want to log this to an error reporting service
        if (
            typeof process === 'undefined'
                ? import.meta.env.PROD
                : process.env['NODE_ENV'] === 'production'
        ) {
            // Example: logErrorToService(error, errorInfo);
        }
    }

    handleReload = (): void => {
        globalThis.location.reload();
    };

    handleReset = (): void => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    override render() {
        const { hasError, error, errorInfo } = this.state;
        const { children, fallback, FallbackComponent, fallbackProps } =
            this.props;

        if (hasError) {
            if (FallbackComponent) {
                return (
                    <FallbackComponent
                        error={error}
                        resetErrorBoundary={this.handleReset}
                        {...fallbackProps}
                    />
                );
            }

            if (fallback) {
                return fallback;
            }

            return (
                <ErrorFallback
                    error={error}
                    errorInfo={errorInfo}
                    onReload={this.handleReload}
                    onReset={this.handleReset}
                />
            );
        }

        return children;
    }
}

export { ErrorBoundary };
export default ErrorBoundary;
