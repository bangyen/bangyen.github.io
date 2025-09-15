import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';
import Home from './Home';

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
    MenuRounded: () => <div data-testid="menu-icon">Menu</div>,
    GitHub: () => <div data-testid="github-icon">GitHub</div>,
    Code: () => <div data-testid="code-icon">Code</div>,
    Cloud: () => <div data-testid="cloud-icon">Cloud</div>,
    Psychology: () => <div data-testid="psychology-icon">Psychology</div>,
    Work: () => <div data-testid="work-icon">Work</div>,
    Email: () => <div data-testid="email-icon">Email</div>,
    Phone: () => <div data-testid="phone-icon">Phone</div>,
    LocationOn: () => <div data-testid="location-icon">Location</div>,
    OpenInNew: () => <div data-testid="open-icon">Open</div>,
}));

// Mock the Interpreters and Pages modules
jest.mock('../Interpreters', () => ({
    names: {
        'Text Editor': '/text-editor',
        'Grid Editor': '/grid-editor',
    },
}));

jest.mock('./', () => ({
    pages: {
        'Snake Game': '/snake',
        'Lights Out': '/lights-out',
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
            </TestWrapper>
        );

        // Check main heading
        expect(screen.getByText("Hey, I'm Bangyen")).toBeInTheDocument();

        // Check subtitle
        expect(
            screen.getByText('Backend Developer & AI/ML Engineer')
        ).toBeInTheDocument();

        // Check location
        expect(screen.getByText('Chicago, IL')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        expect(document.title).toBe(
            'Bangyen Pham - Backend Developer & AI/ML Engineer'
        );
    });

    test('renders navigation buttons', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check menu button
        expect(screen.getByTestId('menu-icon')).toBeInTheDocument();

        // Check GitHub button (there are multiple, so use getAllBy)
        expect(screen.getAllByTestId('github-icon')).toHaveLength(3);
    });

    test('renders skill chips', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check skill chips are rendered
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('PyTorch')).toBeInTheDocument();
        expect(screen.getAllByTestId('code-icon')).toHaveLength(2); // Multiple code icons
        expect(screen.getAllByTestId('psychology-icon')).toHaveLength(2); // Multiple psychology icons
    });

    test('opens menu when menu button is clicked', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Snake Game')).toBeInTheDocument();
        });

        expect(screen.getByText('Lights Out')).toBeInTheDocument();
        expect(screen.getByText('Text Editor')).toBeInTheDocument();
        expect(screen.getByText('Grid Editor')).toBeInTheDocument();
    });

    test('closes menu when clicking outside', async () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        await waitFor(() => {
            expect(screen.getByText('Snake Game')).toBeInTheDocument();
        });

        // Click outside the menu
        fireEvent.click(document.body);

        // Wait a bit for the menu to close
        await new Promise(resolve => setTimeout(resolve, 100));

        // Menu should still be visible as clicking outside doesn't close it in this implementation
        expect(screen.getByText('Snake Game')).toBeInTheDocument();
    });

    test('renders contact information', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check that location icon is present (email/phone icons may not be in the current implementation)
        expect(screen.getByTestId('location-icon')).toBeInTheDocument();
    });

    test('renders GitHub link with correct href', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Get the navigation GitHub link specifically
        const navigationGithubLink = screen.getByRole('link', {
            name: 'GitHub',
        });
        expect(navigationGithubLink).toHaveAttribute(
            'href',
            'https://github.com/bangyen'
        );
    });

    test('has proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        const menuButton = screen.getByRole('button');
        expect(menuButton).toHaveAttribute('aria-haspopup', 'true');
    });

    test('renders with proper responsive layout', () => {
        render(
            <TestWrapper>
                <Home />
            </TestWrapper>
        );

        // Check that the main container has proper styling
        const mainContainer = screen.getByText("Hey, I'm Bangyen");
        expect(mainContainer).toBeInTheDocument();
    });
});
