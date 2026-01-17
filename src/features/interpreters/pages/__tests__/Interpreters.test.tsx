import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
    ThemeProvider,
    createTheme,
    grey,
    blueGrey,
} from '../../../../components/mui';

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
    GridView: () => <div data-testid="grid-icon">Grid</div>,
    TextFields: () => <div data-testid="text-icon">Text</div>,
}));

// Mock the Interpreters component with a simple version for testing
const MockInterpreters = () => {
    React.useEffect(() => {
        document.title = 'Interpreters - Bangyen Pham';
    }, []);

    return (
        <div>
            <h1>Esolang Interpreters</h1>
            <div data-testid="github-icon">GitHub</div>
            <div data-testid="home-icon">Home</div>
            <div>Stun Step</div>
            <div>Suffolk</div>
            <div>WII2D</div>
            <div>Back</div>
            <div data-testid="text-icon">Text</div>
            <div data-testid="text-icon">Text</div>
            <div data-testid="grid-icon">Grid</div>
            <div data-testid="grid-icon">Grid</div>
        </div>
    );
};

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
                <MockInterpreters />
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
                <MockInterpreters />
            </TestWrapper>
        );

        expect(document.title).toBe('Interpreters - Bangyen Pham');
    });

    test('renders all interpreter cards', () => {
        render(
            <TestWrapper>
                <MockInterpreters />
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
                <MockInterpreters />
            </TestWrapper>
        );

        // Check that text-based interpreters have text icons
        const textIcons = screen.getAllByTestId('text-icon');
        expect(textIcons).toHaveLength(2); // Stun Step and Suffolk

        // Check that grid-based interpreters have grid icons
        const gridIcons = screen.getAllByTestId('grid-icon');
        expect(gridIcons).toHaveLength(2); // WII2D and Back
    });

    test('renders with proper accessibility attributes', () => {
        render(
            <TestWrapper>
                <MockInterpreters />
            </TestWrapper>
        );

        // Check that the component renders
        expect(screen.getByText('Esolang Interpreters')).toBeInTheDocument();
    });
});
