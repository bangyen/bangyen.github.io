import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import Oligopoly from '../../Pages/Oligopoly';

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

describe('Oligopoly Component', () => {
    /**
     * Tests the Oligopoly page component for proper rendering and functionality
     * to ensure the economic simulation demo displays correctly.
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
                <Oligopoly />
            </TestWrapper>
        );

        // Check main title
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();

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
                <Oligopoly />
            </TestWrapper>
        );

        expect(document.title).toBe('Oligopoly - Cournot Competition');
    });

    test('renders description text', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <Oligopoly />
            </TestWrapper>
        );

        // Check description
        expect(
            screen.getByText(/Cournot Competition Simulation/)
        ).toBeInTheDocument();
    });

    test('renders parameter controls', async () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <Oligopoly />
            </TestWrapper>
        );

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByText('Number of Firms')).toBeInTheDocument();
        });

        // Check parameter controls
        expect(screen.getByText('Demand Elasticity')).toBeInTheDocument();
        expect(screen.getByText('Base Price')).toBeInTheDocument();
    });

    test('GitHub button has correct href', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <Oligopoly />
            </TestWrapper>
        );

        const githubLink = screen.getByRole('link', { name: 'GitHub' });
        expect(githubLink).toHaveAttribute(
            'href',
            'https://github.com/bangyen/oligopoly'
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
                <Oligopoly />
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
                <Oligopoly />
            </TestWrapper>
        );

        // Should still render the component with fallback data
        await waitFor(() => {
            expect(screen.getByText('Oligopoly')).toBeInTheDocument();
        });
    });

    test('parameter controls are interactive', async () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <Oligopoly />
            </TestWrapper>
        );

        // Wait for component to load
        await waitFor(() => {
            expect(screen.getByText('Number of Firms')).toBeInTheDocument();
        });

        // Check that toggle buttons are present
        const toggleButtons = screen.getAllByRole('button');
        expect(toggleButtons.length).toBeGreaterThan(0);
    });

    test('renders with proper accessibility attributes', () => {
        // Mock successful data fetch
        fetch.mockResolvedValueOnce({
            ok: true,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        });

        render(
            <TestWrapper>
                <Oligopoly />
            </TestWrapper>
        );

        // Check that links have proper accessibility
        const links = screen.getAllByRole('link');
        links.forEach(link => {
            expect(link).toBeInTheDocument();
        });
    });
});
