import { render, screen } from '@testing-library/react';
import React from 'react';

import { ErrorCard } from '../ErrorCard';

describe('ErrorCard', () => {
    test('renders title', () => {
        render(<ErrorCard title="Test Error" />);
        expect(screen.getByText('Test Error')).toBeInTheDocument();
    });

    test('renders message when provided', () => {
        render(<ErrorCard title="Error" message="Something broke" />);
        expect(screen.getByText('Something broke')).toBeInTheDocument();
    });

    test('omits message element when not provided', () => {
        const { container } = render(<ErrorCard title="Error" />);
        const typographies = container.querySelectorAll('.MuiTypography-root');
        expect(typographies).toHaveLength(1);
    });

    test('renders detail content', () => {
        render(
            <ErrorCard title="Error" detail={<div data-testid="detail" />} />,
        );
        expect(screen.getByTestId('detail')).toBeInTheDocument();
    });

    test('renders action buttons passed as children', () => {
        render(
            <ErrorCard title="Error">
                <button>Retry</button>
                <button>Home</button>
            </ErrorCard>,
        );
        expect(screen.getByText('Retry')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
    });

    test('has alert role for accessibility', () => {
        render(<ErrorCard title="Error" />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });
});
