import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, grey, blueGrey } from './components/mui';

/**
 * Creates a test theme for consistent testing across all components
 * @returns {Object} Material-UI theme object
 */
export const createTestTheme = () =>
    createTheme({
        palette: {
            primary: blueGrey,
            secondary: grey,
            mode: 'dark',
        },
        typography: {
            fontFamily: 'monospace',
        },
    });

/**
 * Test wrapper component that provides necessary providers
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {Object} props.theme - Optional custom theme
 * @returns {React.ReactElement} Wrapped component
 */
export const TestWrapper = ({ children, theme = createTestTheme() }) => (
    <BrowserRouter
        future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}
    >
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </BrowserRouter>
);

/**
 * Renders a component with all necessary providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result
 */
export const renderWithProviders = (ui, options = {}) => {
    const { theme = createTestTheme(), ...renderOptions } = options;

    const Wrapper = ({ children }) => (
        <TestWrapper theme={theme}>{children}</TestWrapper>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Mock data for testing
 */
export const mockData = {
    zsharp: {
        train_accuracies: [0.1, 0.2, 0.3, 0.4, 0.5],
        train_losses: [2.0, 1.5, 1.0, 0.8, 0.6],
    },
    oligopoly: [
        { round: 1, price: 30, hhi: 0.25 },
        { round: 2, price: 32, hhi: 0.3 },
        { round: 3, price: 28, hhi: 0.2 },
    ],
};

/**
 * Mock fetch responses for testing
 */
export const mockFetchResponses = {
    success: data => ({
        ok: true,
        arrayBuffer: () => {
            const uint8Array = new Uint8Array(
                JSON.stringify(data)
                    .split('')
                    .map(c => c.charCodeAt(0))
            );
            return Promise.resolve(uint8Array.buffer);
        },
    }),
    error: () => Promise.reject(new Error('Network error')),
};

/**
 * Common test utilities
 */
export const testUtils = {
    /**
     * Creates a mock function
     * @returns {Function} Jest mock function
     */
    createMockFunction: () => jest.fn(),

    /**
     * Mocks console methods to suppress expected warnings in tests
     */
    suppressConsoleWarnings: () => {
        // eslint-disable-next-line no-console
        const originalWarn = console.warn;
        // eslint-disable-next-line no-console
        const originalError = console.error;

        // eslint-disable-next-line no-console
        console.warn = jest.fn();
        // eslint-disable-next-line no-console
        console.error = jest.fn();

        return () => {
            // eslint-disable-next-line no-console
            console.warn = originalWarn;
            // eslint-disable-next-line no-console
            console.error = originalError;
        };
    },
};

/**
 * Common test data generators
 */
export const testDataGenerators = {
    /**
     * Generates mock chart data for testing
     */
    generateChartData: (length = 10) =>
        Array.from({ length }, (_, i) => ({
            x: i + 1,
            y: Math.random() * 100,
        })),

    /**
     * Generates mock user data for testing
     */
    generateUserData: (overrides = {}) => ({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        ...overrides,
    }),
};

const testUtilsExport = {
    createTestTheme,
    TestWrapper,
    renderWithProviders,
    mockData,
    mockFetchResponses,
    testUtils,
    testDataGenerators,
};

export default testUtilsExport;
