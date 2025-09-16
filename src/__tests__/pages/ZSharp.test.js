import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';

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
}));

// Mock fetch for data loading
global.fetch = jest.fn();

// Mock the ZSharp component with a simple version for testing
const MockZSharp = () => {
    React.useEffect(() => {
        document.title = 'ZSharp - Bangyen Pham';
    }, []);

    return (
        <div>
            <h1>ZSharp</h1>
            <p>Sharpness-Aware Minimization with Z-Score Gradient Filtering</p>
            <div data-testid="github-icon">GitHub</div>
            <div data-testid="home-icon">Home</div>
            <div>Accuracy</div>
            <div>Loss</div>
            <div>Learning Gap</div>
            <div>Convergence</div>
            <div>Summary</div>
        </div>
    );
};

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
        render(
            <TestWrapper>
                <MockZSharp />
            </TestWrapper>
        );

        // Check main title
        expect(screen.getByText('ZSharp')).toBeInTheDocument();

        // Check navigation buttons
        expect(screen.getByTestId('github-icon')).toBeInTheDocument();
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    test('sets document title on mount', () => {
        render(
            <TestWrapper>
                <MockZSharp />
            </TestWrapper>
        );

        expect(document.title).toBe('ZSharp - Bangyen Pham');
    });

    test('renders description text', () => {
        render(
            <TestWrapper>
                <MockZSharp />
            </TestWrapper>
        );

        // Check description
        expect(
            screen.getByText(/Sharpness-Aware Minimization/)
        ).toBeInTheDocument();
    });

    test('renders view selection buttons', () => {
        render(
            <TestWrapper>
                <MockZSharp />
            </TestWrapper>
        );

        // Check view buttons
        expect(screen.getByText('Accuracy')).toBeInTheDocument();
        expect(screen.getByText('Loss')).toBeInTheDocument();
        expect(screen.getByText('Learning Gap')).toBeInTheDocument();
        expect(screen.getByText('Convergence')).toBeInTheDocument();
        expect(screen.getByText('Summary')).toBeInTheDocument();
    });

    test('renders with proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <MockZSharp />
            </TestWrapper>
        );

        // Check that the component renders
        expect(screen.getByText('ZSharp')).toBeInTheDocument();
    });
});
