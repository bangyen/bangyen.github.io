import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { FeatureErrorFallback } from '../FeatureErrorFallback';

describe('FeatureErrorFallback', () => {
    const defaultProps = {
        error: new Error('test failure'),
        resetErrorBoundary: vi.fn(),
    };

    const renderWithRouter = (ui: React.ReactElement) =>
        render(<BrowserRouter>{ui}</BrowserRouter>);

    test('renders default title and error message', () => {
        renderWithRouter(<FeatureErrorFallback {...defaultProps} />);
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(
            screen.getByText('An unexpected error occurred.'),
        ).toBeInTheDocument();
    });

    test('renders custom title and reset label', () => {
        renderWithRouter(
            <FeatureErrorFallback
                {...defaultProps}
                title="Game Error"
                resetLabel="Reset Game"
            />,
        );
        expect(screen.getByText('Game Error')).toBeInTheDocument();
        expect(screen.getByText('Reset Game')).toBeInTheDocument();
    });

    test('calls resetErrorBoundary on reset button click', () => {
        renderWithRouter(<FeatureErrorFallback {...defaultProps} />);
        fireEvent.click(screen.getByText('Reset'));
        expect(defaultProps.resetErrorBoundary).toHaveBeenCalled();
    });

    test('renders Back to Home link', () => {
        renderWithRouter(<FeatureErrorFallback {...defaultProps} />);
        const homeLink = screen.getByRole('link', { name: /Back to Home/i });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    test('shows fallback message when error is null', () => {
        renderWithRouter(
            <FeatureErrorFallback error={null} resetErrorBoundary={vi.fn()} />,
        );
        expect(
            screen.getByText('An unexpected error occurred.'),
        ).toBeInTheDocument();
    });
});
