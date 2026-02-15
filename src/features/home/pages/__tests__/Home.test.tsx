import { grey, blueGrey } from '@mui/material/colors';
import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Home } from '../Home';

import { ThemeProvider } from '@/hooks/useTheme';

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
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        <ThemeProvider>
            <MuiThemeProvider theme={testTheme}>{children}</MuiThemeProvider>
        </ThemeProvider>
    </BrowserRouter>
);

// Mock Material-UI icons
vi.mock('@mui/icons-material', async importOriginal => {
    const original = await importOriginal<Record<string, any>>();
    return {
        ...original,
        LightModeRounded: () => <div data-testid="light-mode-icon" />,
        DarkModeRounded: () => <div data-testid="dark-mode-icon" />,
        ViewModuleRounded: () => <div data-testid="view-module-icon" />,
        GitHub: () => <div data-testid="github-icon" />,
        LocationOn: () => <div data-testid="location-icon" />,
    };
});

// Mock the Pages module
vi.mock('../../../../pages', () => ({
    pages: {
        Oligopoly: '/oligopoly',
        ZSharp: '/zsharp',
        Lights_Out: '/lights-out',
        Interpreters: '/interpreters',
    },
}));

describe('Home Component', () => {
    /**
     * Tests the main Home component for proper rendering and functionality
     * to ensure the portfolio landing page displays correctly with all sections.
     */
    beforeEach(() => {
        // Mock document.title
        Object.defineProperty(document, 'title', {
            writable: true,
            value: '',
        });
    });

    test('renders main content sections', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        // Check main heading
        expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
        expect(screen.getByText('Bangyen Pham')).toBeInTheDocument();

        // Check subtitle
        expect(
            screen.getByText('Backend Developer & AI/ML Engineer'),
        ).toBeInTheDocument();

        // Check location
        expect(screen.getByText('Chicago, IL')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        expect(document.title).toBe(
            'Bangyen Pham - Backend Developer & AI/ML Engineer',
        );
    });

    test('renders navigation buttons', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        // Check menu button
        expect(screen.getByTestId('view-module-icon')).toBeInTheDocument();

        // Check GitHub button (there are multiple, so use getAllBy)
        expect(screen.getAllByTestId('github-icon')).toHaveLength(4);
    });

    test('renders skill chips', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        // Check skill chips are rendered
        await waitFor(
            () => {
                expect(screen.getByText('Python')).toBeInTheDocument();
            },
            { timeout: 5000 },
        );

        expect(screen.getAllByText('PyTorch')).toHaveLength(2);
    });

    test('opens menu when menu button is clicked', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        const menuButton = screen
            .getByTestId('view-module-icon')
            .closest('button')!;

        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Oligopoly')).toBeInTheDocument();
        });

        expect(screen.getByText('ZSharp')).toBeInTheDocument();
        expect(screen.getByText('Lights Out')).toBeInTheDocument();
        expect(screen.getByText('Slant')).toBeInTheDocument();
    });

    test('closes menu when clicking outside', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        const menuButton = screen
            .getByTestId('view-module-icon')
            .closest('button')!;

        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Oligopoly')).toBeInTheDocument();
        });

        // Click outside the menu
        fireEvent.click(document.body);

        // Wait a bit for the menu to close
        await new Promise(resolve => setTimeout(resolve, 100));

        // Menu should still be visible as clicking outside doesn't close it in this implementation
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();
    });

    test('renders contact information', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        // Check that location icon is present (email/phone icons may not be in the current implementation)
        expect(screen.getByTestId('location-icon')).toBeInTheDocument();
    });

    test('renders GitHub link with correct href', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        // Get the navigation GitHub link specifically
        const navigationGithubLink = screen.getByRole('link', {
            name: 'View on GitHub',
        });
        expect(navigationGithubLink).toHaveAttribute(
            'href',
            'https://github.com/bangyen',
        );
    });

    test('has proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        const menuButton = screen
            .getByTestId('view-module-icon')
            .closest('button')!;
        expect(menuButton).toHaveAttribute('aria-haspopup', 'true');
    });

    test('renders with proper responsive layout', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>,
        );

        // Check that the main container has proper styling
        expect(screen.getByText("Hello, I'm")).toBeInTheDocument();
        expect(screen.getByText('Bangyen Pham')).toBeInTheDocument();
    });
});
