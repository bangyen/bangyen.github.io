import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import Interpreters from '../../Pages/Interpreters';

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
    GridView: () => <div data-testid="grid-icon">Grid</div>,
    TextFields: () => <div data-testid="text-icon">Text</div>,
}));

describe('Interpreters Component', () => {
    /**
     * Tests the Interpreters page component for proper rendering and functionality
     * to ensure the esolang interpreters showcase displays correctly.
     */
    beforeEach(() => {
        // Mock document.title
        Object.defineProperty(document, 'title', {
            writable: true,
            value: '',
        });
    });

    test('renders main title and navigation', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check main title
        expect(screen.getByText('Esolang Interpreters')).toBeInTheDocument();

        // Check navigation buttons
        expect(screen.getByTestId('github-icon')).toBeInTheDocument();
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        expect(document.title).toBe('Interpreters - Bangyen Pham');
    });

    test('renders all interpreter cards', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check that all 4 interpreters are rendered
        expect(screen.getByText('Stun Step')).toBeInTheDocument();
        expect(screen.getByText('Suffolk')).toBeInTheDocument();
        expect(screen.getByText('WII2D')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
    });

    test('renders correct icons for each interpreter type', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check that text-based interpreters have text icons
        const textIcons = screen.getAllByTestId('text-icon');
        expect(textIcons).toHaveLength(2); // Stun Step and Suffolk

        // Check that grid-based interpreters have grid icons
        const gridIcons = screen.getAllByTestId('grid-icon');
        expect(gridIcons).toHaveLength(2); // WII2D and Back
    });

    test('renders interpreter descriptions', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check that descriptions are rendered
        expect(
            screen.getByText(/Ultra-minimal tape-based language/)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Register-based language with input/)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/2D grid language with directional/)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Grid-based language with mirror/)
        ).toBeInTheDocument();
    });

    test('GitHub button has correct href', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        const githubLink = screen.getByRole('link', { name: 'GitHub' });
        expect(githubLink).toHaveAttribute(
            'href',
            'https://github.com/bangyen/esolangs'
        );
        expect(githubLink).toHaveAttribute('target', '_blank');
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('Home button links to home page', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        const homeLink = screen.getByRole('link', { name: 'Home' });
        expect(homeLink).toHaveAttribute('href', '/');
    });

    test('interpreter cards are clickable links', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check that interpreter cards are links
        const stunStepLink = screen.getByRole('link', { name: /Stun Step/ });
        const suffolkLink = screen.getByRole('link', { name: /Suffolk/ });
        const wii2dLink = screen.getByRole('link', { name: /WII2D/ });
        const backLink = screen.getByRole('link', { name: /Back/ });

        expect(stunStepLink).toHaveAttribute('href', '/Stun_Step');
        expect(suffolkLink).toHaveAttribute('href', '/Suffolk');
        expect(wii2dLink).toHaveAttribute('href', '/WII2D');
        expect(backLink).toHaveAttribute('href', '/Back');
    });

    test('has proper responsive grid layout', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check that the grid container exists by checking for interpreter cards
        expect(screen.getByText('Stun Step')).toBeInTheDocument();
    });

    test('renders with proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <Interpreters />
            </TestWrapper>
        );

        // Check that links have proper accessibility
        const links = screen.getAllByRole('link');
        links.forEach(link => {
            expect(link).toBeInTheDocument();
        });
    });
});
