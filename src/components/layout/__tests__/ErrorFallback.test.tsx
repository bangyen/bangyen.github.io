import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ErrorFallback } from '../ErrorFallback';

// Mock HomeButton as it uses navigation
vi.mock('../../ui/Controls', () => ({
    HomeButton: () => <button data-testid="home-button">Home</button>,
}));

describe('ErrorFallback', () => {
    const mockProps = {
        error: new Error('Test error message'),
        errorInfo: {
            componentStack: 'component\nstack\ntrace',
        } as React.ErrorInfo,
        onReload: vi.fn(),
        onReset: vi.fn(),
    };

    const renderWithRouter = (ui: React.ReactElement) => {
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };

    test('renders main error message', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
        expect(
            screen.getByText(/An unexpected error occurred/)
        ).toBeInTheDocument();
    });

    test('calls onReload when Reload button is clicked', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        fireEvent.click(screen.getByText('Reload Page'));
        expect(mockProps.onReload).toHaveBeenCalled();
    });

    test('calls onReset when Try Again button is clicked', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        fireEvent.click(screen.getByText('Try Again'));
        expect(mockProps.onReset).toHaveBeenCalled();
    });

    test('renders HomeButton', () => {
        renderWithRouter(<ErrorFallback {...mockProps} />);
        expect(screen.getByTestId('home-button')).toBeInTheDocument();
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
                screen.queryByText(/Test error message/)
            ).not.toBeInTheDocument();
        });
    });
});
