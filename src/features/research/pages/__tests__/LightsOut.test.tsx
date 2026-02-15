import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import { LightsOutResearch } from '../LightsOut';

// Mock dependencies
vi.mock('@/components/ui/Latex', () => ({
    Latex: ({ formula }: { formula: string }) => (
        <span data-testid="latex">{formula}</span>
    ),
}));

vi.mock('../components', () => ({
    ResearchDemo: ({
        children,
        title,
    }: {
        children: React.ReactNode;
        title: string;
    }) => (
        <div data-testid="research-demo">
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

vi.mock('../components/VerificationTools', () => ({
    VerificationTools: () => (
        <div data-testid="verification-tools">VerificationTools</div>
    ),
}));

vi.mock('@/hooks/useTheme', () => ({
    useThemeContext: () => ({
        mode: 'light',
        resolvedMode: 'light',
        toggleTheme: vi.fn(),
    }),
}));

describe('LightsOutResearch', () => {
    it('renders the research page content', async () => {
        render(<LightsOutResearch />);

        expect(screen.getByText('Lights Out')).toBeInTheDocument();
        expect(screen.getByText('Algorithm Overview')).toBeInTheDocument();

        // Check for lazy loaded Latex components
        // Since we mocked Latex, we check if our mock is rendered inside Suspense
        // But Suspense boundaries are hard to test with bare mocks if we don't delay the import.
        // For this test, we just want to ensure it renders without crashing.

        await waitFor(() => {
            expect(screen.getAllByTestId('latex').length).toBeGreaterThan(0);
        });
    });
});
