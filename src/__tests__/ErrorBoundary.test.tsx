import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import ErrorBoundary from '@/components/layout/ErrorBoundary';

describe('ErrorBoundary', () => {
    const originalError = console.error;

    beforeEach(() => {
        console.error = vi.fn();
    });

    afterEach(() => {
        console.error = originalError;
    });

    test('renders children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child">Test</div>
            </ErrorBoundary>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    test('catches errors and renders ErrorFallback', () => {
        const ThrowError = () => {
            throw new Error('Test error');
        };

        render(
            <BrowserRouter>
                <ErrorBoundary>
                    <ThrowError />
                </ErrorBoundary>
            </BrowserRouter>
        );

        // ErrorFallback should be rendered instead of the child
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(screen.getByText('Reload Page')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('renders custom FallbackComponent on error', () => {
        const ThrowError = () => {
            throw new Error('Test error');
        };
        const CustomFallback = ({ error }: { error: Error | null }) => (
            <div data-testid="custom-fallback">{error?.message}</div>
        );

        render(
            <ErrorBoundary FallbackComponent={CustomFallback}>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    test('renders simple fallback prop on error', () => {
        const ThrowError = () => {
            throw new Error('Test error');
        };
        const SimpleFallback = <div data-testid="simple-fallback">Error!</div>;

        render(
            <ErrorBoundary fallback={SimpleFallback}>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByTestId('simple-fallback')).toBeInTheDocument();
    });
});
