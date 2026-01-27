import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../components/layout/ErrorBoundary';

describe('ErrorBoundary', () => {
    const originalError = console.error;

    beforeEach(() => {
        console.error = jest.fn();
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
});
