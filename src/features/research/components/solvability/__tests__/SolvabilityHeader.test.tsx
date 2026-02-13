import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { SolvabilityHeader } from '../SolvabilityHeader';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('SolvabilityHeader', () => {
    const defaultProps = {
        n: '5',
        loading: false,
        onNChange: vi.fn(),
        onAnalyze: vi.fn(),
        onCancel: vi.fn(),
    };

    it('renders basic elements', () => {
        render(
            <TestWrapper>
                <SolvabilityHeader {...defaultProps} />
            </TestWrapper>,
        );

        expect(screen.getByText('Solvability Analyzer')).toBeInTheDocument();
        expect(screen.getByLabelText('Grid Size (n)')).toBeInTheDocument();
        expect(screen.getByText('Analyze Solvability')).toBeInTheDocument();
    });

    it('calls onNChange when text field changes', () => {
        render(
            <TestWrapper>
                <SolvabilityHeader {...defaultProps} />
            </TestWrapper>,
        );

        const input = screen.getByLabelText('Grid Size (n)');
        fireEvent.change(input, { target: { value: '6' } });

        expect(defaultProps.onNChange).toHaveBeenCalledWith('6');
    });

    it('calls onAnalyze when button is clicked and not loading', () => {
        render(
            <TestWrapper>
                <SolvabilityHeader {...defaultProps} />
            </TestWrapper>,
        );

        const button = screen.getByText('Analyze Solvability');
        fireEvent.click(button);

        expect(defaultProps.onAnalyze).toHaveBeenCalled();
    });

    it('shows cancel button and calls onCancel when loading', () => {
        render(
            <TestWrapper>
                <SolvabilityHeader {...defaultProps} loading={true} />
            </TestWrapper>,
        );

        expect(
            screen.queryByText('Analyze Solvability'),
        ).not.toBeInTheDocument();
        const cancelButton = screen.getByText('Cancel Analysis');
        expect(cancelButton).toBeInTheDocument();

        fireEvent.click(cancelButton);
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('renders documentation tooltip', () => {
        render(
            <TestWrapper>
                <SolvabilityHeader {...defaultProps} />
            </TestWrapper>,
        );

        expect(
            screen.getByLabelText('Solvability analyzer documentation'),
        ).toBeInTheDocument();
    });
});
