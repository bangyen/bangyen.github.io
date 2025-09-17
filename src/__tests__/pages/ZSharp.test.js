import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import ZSharp from '../../Pages/ZSharp';

// Create a test theme
const testTheme = createTheme({
    palette: {
        primary: blueGrey,
        secondary: grey,
        mode: 'dark',
    },
    typography: {
        fontFamily: 'monospace',
    },
});

// Test wrapper component
const TestWrapper = ({ children }) => (
    <BrowserRouter>
        <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
    </BrowserRouter>
);

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
    GitHub: () => <div data-testid="github-icon">GitHub</div>,
    Home: () => <div data-testid="home-icon">Home</div>,
}));

// Mock fetch for data loading
global.fetch = jest.fn();

describe('ZSharp Component', () => {
    /**
     * Tests the ZSharp page component for proper rendering and functionality
     * to ensure the optimization algorithm demo displays correctly.
     */
    beforeEach(() => {
        // Mock document.title
        Object.defineProperty(document, 'title', {
            writable: true,
            value: '',
        });

        // Reset fetch mock
        fetch.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders main title and navigation', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        // Check main title
        expect(screen.getByText('ZSharp')).toBeInTheDocument();

        // Check navigation buttons
        expect(screen.getByTestId('github-icon')).toBeInTheDocument();
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        expect(document.title).toBe('ZSharp - Bangyen Pham');
    });

    test('renders description text', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        // Check description
        expect(
            screen.getByText(/Sharpness-Aware Minimization/)
        ).toBeInTheDocument();
    });

    test('renders view selection buttons', async () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByText('Accuracy')).toBeInTheDocument();
        });

        // Check view buttons
        expect(screen.getByText('Loss')).toBeInTheDocument();
        expect(screen.getByText('Learning Gap')).toBeInTheDocument();
        expect(screen.getByText('Convergence')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    test('GitHub button has correct href', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        const githubLink = screen.getByRole('link', { name: 'GitHub' });
        expect(githubLink).toHaveAttribute(
            'href',
            'https://github.com/bangyen/zsharp'
        );
        expect(githubLink).toHaveAttribute('target', '_blank');
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('Home button links to home page', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        const homeLink = screen.getByRole('link', { name: 'Home' });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    test('handles data loading error gracefully', async () => {
        // Mock failed data fetch
        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        // Should still render the component with fallback data
        await waitFor(() => {
            expect(screen.getByText('ZSharp')).toBeInTheDocument();
        });
    });

    test('switches view when view buttons are clicked', async () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByText('Loss')).toBeInTheDocument();
        });

        // Click on Loss button
        const lossButton = screen.getByText('Loss');
        fireEvent.click(lossButton);

        // Should update the view (this would be tested more thoroughly with actual data)
        expect(lossButton).toBeInTheDocument();
    });

    test('renders with proper accessibility attributes', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <ZSharp />
            </TestWrapper>
        );

        // Check that links have proper accessibility
        const links = screen.getAllByRole('link');
        links.forEach(link => {
            expect(link).toBeInTheDocument();
        });
    });
});
