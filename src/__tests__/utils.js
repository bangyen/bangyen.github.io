import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, blueGrey } from '@mui/material/colors';

/**
 * Creates a test theme that matches the application's theme configuration
 * for consistent testing across all components.
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
 * Test wrapper component that provides necessary context providers
 * for testing React components with routing and theming.
 */
export const TestWrapper = ({ children, theme = createTestTheme() }) => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </BrowserRouter>
);

/**
 * Custom render function that wraps components with necessary providers
 * for consistent testing setup across all test files.
 */
export const renderWithProviders = (ui, options = {}) => {
    const { theme = createTestTheme(), ...renderOptions } = options;

    const Wrapper = ({ children }) => (
        <TestWrapper theme={theme}>{children}</TestWrapper>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Mock data for testing components that require data
 */
export const mockData = {
    zsharp: {
        train_accuracies: [0.1, 0.2, 0.3, 0.4, 0.5],
        train_losses: [2.0, 1.5, 1.0, 0.8, 0.6],
        test_accuracies: [0.15, 0.25, 0.35, 0.45, 0.55],
        test_losses: [1.8, 1.3, 0.9, 0.7, 0.5],
    },
    oligopoly: [
        {
            num_firms: 2,
            demand_elasticity: 1.5,
            base_price: 30,
            model_type: 'cournot',
            collusion_enabled: false,
            rounds_data: [
                { round: 1, price: 25, hhi: 0.5 },
                { round: 2, price: 26, hhi: 0.52 },
            ],
        },
    ],
};

/**
 * Mock fetch responses for testing data loading
 */
export const mockFetchResponses = {
    success: data => ({
        ok: true,
        arrayBuffer: () =>
            Promise.resolve(new TextEncoder().encode(JSON.stringify(data))),
    }),
    error: () => Promise.reject(new Error('Network error')),
    notFound: () => ({
        ok: false,
        status: 404,
        statusText: 'Not Found',
    }),
};

/**
 * Common test utilities for DOM manipulation and assertions
 */
export const testUtils = {
    /**
     * Waits for an element to appear in the DOM
     */
    waitForElement: async (getter, timeout = 1000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try {
                const element = getter();
                if (element) return element;
            } catch (e) {
                // Element not found, continue waiting
            }
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        throw new Error('Element not found within timeout');
    },

    /**
     * Creates a mock function with common Jest matchers
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
            value: Math.random() * 100,
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

// Re-export everything for convenience
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
