import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { KernelBasisView } from '../KernelBasisView';

const theme = createTheme();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

describe('KernelBasisView', () => {
    it('renders nothing when there are no quiet patterns', () => {
        const { container } = render(<KernelBasisView quietPatterns={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders quiet patterns correctly', () => {
        render(
            <TestWrapper>
                <KernelBasisView quietPatterns={['0x123', '0x456']} />
            </TestWrapper>
        );

        expect(screen.getByText('Quiet Patterns (Kernel)')).toBeInTheDocument();
        expect(screen.getByText('0x123')).toBeInTheDocument();
        expect(screen.getByText('0x456')).toBeInTheDocument();
    });
});
