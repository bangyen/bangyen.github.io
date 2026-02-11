import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { ErrorFallback } from '../components/layout/ErrorFallback';

describe('ErrorFallback', () => {
    const defaultProps = {
        error: new Error('Test Error'),
        errorInfo: { componentStack: 'at Component' } as React.ErrorInfo,
        onReload: vi.fn(),
        onReset: vi.fn(),
    };

    it('renders error message', () => {
        render(
            <BrowserRouter>
                <ErrorFallback {...defaultProps} />
            </BrowserRouter>
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('calls onReload when reload button is clicked', () => {
        render(
            <BrowserRouter>
                <ErrorFallback {...defaultProps} />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Reload Page'));
        expect(defaultProps.onReload).toHaveBeenCalled();
    });

    it('calls onReset when reset button is clicked', () => {
        render(
            <BrowserRouter>
                <ErrorFallback {...defaultProps} />
            </BrowserRouter>
        );
        fireEvent.click(screen.getByText('Try Again'));
        expect(defaultProps.onReset).toHaveBeenCalled();
    });

    it('shows error stack in development mode', () => {
        // Mock process.env
        const originalEnv = process.env['NODE_ENV'];
        process.env['NODE_ENV'] = 'development';

        render(
            <BrowserRouter>
                <ErrorFallback {...defaultProps} />
            </BrowserRouter>
        );

        expect(screen.getByText(/Test Error/)).toBeInTheDocument();
        expect(screen.getByText(/at Component/)).toBeInTheDocument();

        process.env['NODE_ENV'] = originalEnv;
    });
});
