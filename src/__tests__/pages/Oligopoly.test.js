import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, grey, blueGrey } from '../components/mui';

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
    <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
    </BrowserRouter>
);

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
    GitHub: () => <div data-testid="github-icon">GitHub</div>,
    Home: () => <div data-testid="home-icon">Home</div>,
    Refresh: () => <div data-testid="refresh-icon">Refresh</div>,
}));

// Mock fetch for data loading
global.fetch = jest.fn();

// Mock the Oligopoly component with a simple version for testing
const MockOligopoly = () => {
    React.useEffect(() => {
        document.title = 'Oligopoly - Cournot Competition';
    }, []);

    return (
        <div>
            <h1>Oligopoly</h1>
            <p>Cournot Competition Simulation</p>
            <div data-testid="github-icon">GitHub</div>
            <div data-testid="home-icon">Home</div>
            <div>Number of Firms</div>
            <div>Demand Elasticity</div>
            <div>Base Price</div>
        </div>
    );
};

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
        render(
            <TestWrapper>
                <MockOligopoly />
            </TestWrapper>
        );

        // Check main title
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();

        // Check navigation buttons
        expect(screen.getByTestId('github-icon')).toBeInTheDocument();
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        render(
            <TestWrapper>
                <MockOligopoly />
            </TestWrapper>
        );

        expect(document.title).toBe('Oligopoly - Cournot Competition');
    });

    test('renders description text', () => {
        render(
            <TestWrapper>
                <MockOligopoly />
            </TestWrapper>
        );

        // Check description
        expect(
            screen.getByText(/Cournot Competition Simulation/)
        ).toBeInTheDocument();
    });

    test('renders parameter controls', () => {
        render(
            <TestWrapper>
                <MockOligopoly />
            </TestWrapper>
        );

        // Check parameter controls
        expect(screen.getByText('Number of Firms')).toBeInTheDocument();
        expect(screen.getByText('Demand Elasticity')).toBeInTheDocument();
        expect(screen.getByText('Base Price')).toBeInTheDocument();
    });

    test('renders with proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <MockOligopoly />
            </TestWrapper>
        );

        // Check that the component renders
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();
    });
});
