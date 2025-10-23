import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorContext } from '../Interpreters/Editor';
import { TooltipButton, GlassCard, CustomGrid } from '../helpers';
import { COLORS, SPACING } from '../config/theme';

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

            expect(container.firstChild).toHaveStyle({ padding: '20px' });
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

    describe('CustomGrid', () => {
        test('renders with correct attributes', () => {
            const mockCellProps = () => ({
                onClick: jest.fn(),
                children: <div>Cell</div>,
            });

            render(
                <CustomGrid
                    size={10}
                    rows={2}
                    cols={2}
                    cellProps={mockCellProps}
                />
            );

            const grid = screen.getByRole('grid');
            expect(grid).toHaveAttribute('aria-label', 'Grid with 2 rows and 2 columns');
        });

        test('generates correct number of cells', () => {
            const mockCellProps = (row, col) => ({
                onClick: jest.fn(),
                children: <div>{`${row}-${col}`}</div>,
            });

            render(
                <CustomGrid
                    size={10}
                    rows={2}
                    cols={2}
                    cellProps={mockCellProps}
                />
            );

            // Should have 4 cells (2 rows x 2 cols)
            expect(screen.getAllByText(/-\d/)).toHaveLength(4);
        });
    });
});

