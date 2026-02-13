import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { SolvabilityResults } from '../SolvabilityResults';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('SolvabilityResults', () => {
    const result = {
        rank: 23,
        nullity: 2,
        gridRank: 25,
        solvablePercent: '25',
        quietPatterns: ['Pattern 1', 'Pattern 2'],
        imageMapping: [{ state: '0x1', toggle: '0x3' }],
        isFullSubspace: false,
    };

    it('renders results with quiet patterns', () => {
        render(
            <TestWrapper>
                <SolvabilityResults result={result} />
            </TestWrapper>,
        );

        expect(screen.getByText('25% Solvable')).toBeInTheDocument();
        // Since KernelBasisView and ImageMappingView are not mocked, we check their content
        expect(screen.getByText('Pattern 1')).toBeInTheDocument();
        expect(screen.getByText('0x1')).toBeInTheDocument();
    });

    it('renders fully solvable message when nullity is 0', () => {
        const fullSolvableResult = {
            ...result,
            nullity: 0,
            quietPatterns: [],
            solvablePercent: '100',
        };

        render(
            <TestWrapper>
                <SolvabilityResults result={fullSolvableResult} />
            </TestWrapper>,
        );

        expect(
            screen.getByText('fully solvable (Nullity = 0)'),
        ).toBeInTheDocument();
        expect(screen.getByText('100% Solvable')).toBeInTheDocument();
        // Should not render quiet patterns section since list is empty
        expect(
            screen.queryByText('Quiet Patterns (Kernel)'),
        ).not.toBeInTheDocument();
    });
});
