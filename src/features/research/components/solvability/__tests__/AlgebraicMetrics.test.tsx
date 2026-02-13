import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { AlgebraicMetrics } from '../AlgebraicMetrics';

import { COLORS } from '@/config/theme';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('AlgebraicMetrics', () => {
    it('renders metrics correctly', () => {
        render(
            <TestWrapper>
                <AlgebraicMetrics nullity={2} solvablePercent="25" />
            </TestWrapper>
        );

        expect(screen.getByText('Subspace Analysis')).toBeInTheDocument();
        expect(screen.getByText('25% Solvable')).toBeInTheDocument();
    });

    it('applies green color when nullity is 0', () => {
        const { getByText } = render(
            <TestWrapper>
                <AlgebraicMetrics nullity={0} solvablePercent="100" />
            </TestWrapper>
        );

        const percentText = getByText('100% Solvable');
        expect(percentText).toHaveStyle({ color: COLORS.data.green });
    });

    it('renders with different nullity', () => {
        const { getByText } = render(
            <TestWrapper>
                <AlgebraicMetrics nullity={1} solvablePercent="50" />
            </TestWrapper>
        );
        const percentText = getByText('50% Solvable');
        expect(percentText).toBeInTheDocument();
        expect(percentText).toHaveStyle({ color: COLORS.text.primary });
    });
});
