import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ErrorFallback } from '../ErrorFallback';

describe('ErrorFallback', () => {
    const mockProps = {
        error: new Error('Test error message'),
        errorInfo: {
            componentStack: 'component\nstack\ntrace',
        } as React.ErrorInfo,
        onReload: vi.fn(),
    };

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    test('renders main error message', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(
            screen.getByText(/An unexpected error occurred/),
        ).toBeInTheDocument();
    });

    test('calls onReload when Reload button is clicked', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        fireEvent.click(screen.getByText('Reload Page'));
        expect(mockProps.onReload).toHaveBeenCalled();
    });

    test('renders Return to Home link', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        const homeLink = screen.getByRole('link', { name: /Return to Home/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    describe('Development mode details', () => {
        const originalEnv = process.env['NODE_ENV'];

        beforeEach(() => {
            vi.resetModules();
        });

        afterEach(() => {
            process.env['NODE_ENV'] = originalEnv;
        });

        test('shows error details in development', () => {
            process.env['NODE_ENV'] = 'development';
            renderWithRouter(<ErrorFallback {...mockProps} />);
            expect(screen.getByText(/Test error message/)).toBeInTheDocument();
            expect(screen.getByText(/component/)).toBeInTheDocument();
            expect(screen.getByText(/stack/)).toBeInTheDocument();
        });

        test('hides error details in production', () => {
            process.env['NODE_ENV'] = 'production';
            renderWithRouter(<ErrorFallback {...mockProps} />);
            expect(
                screen.queryByText(/Test error message/),
            ).not.toBeInTheDocument();
        });
    });
});
