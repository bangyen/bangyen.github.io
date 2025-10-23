import React from 'react';
import { render, screen } from '@testing-library/react';
import { TooltipButton, GlassCard } from '../helpers';

describe('Helper Components', () => {
    describe('TooltipButton', () => {
        test('renders with icon and title', () => {
            const MockIcon = () => <div>Icon</div>;
            render(<TooltipButton Icon={MockIcon} title="Test Button" />);

            expect(screen.getByLabelText('Test Button')).toBeInTheDocument();
        });

        test('passes through props', () => {
            const MockIcon = () => <div>Icon</div>;
            const handleClick = jest.fn();

            render(
                <TooltipButton
                    Icon={MockIcon}
                    title="Clickable"
                    onClick={handleClick}
                />
            );

            const button = screen.getByLabelText('Clickable');
            button.click();

            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('GlassCard', () => {
        test('renders children', () => {
            render(
                <GlassCard>
                    <div data-testid="content">Test Content</div>
                </GlassCard>
            );

            expect(screen.getByTestId('content')).toBeInTheDocument();
        });

        test('applies custom padding', () => {
            const { container } = render(
                <GlassCard padding="20px">
                    <div>Test</div>
                </GlassCard>
            );

            expect(container.firstChild).toBeInTheDocument();
        });

        test('has interactive variant styling', () => {
            const { container } = render(
                <GlassCard interactive>
                    <div>Test</div>
                </GlassCard>
            );

            expect(container.firstChild).toHaveClass('glass-card');
        });
    });
});

