import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, grey, blueGrey } from '../components/mui';
import type { Theme } from '@mui/material/styles';

/**
 * Creates a test theme for consistent testing across all components
 */
export const createTestTheme = (): Theme =>
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

interface TestWrapperProps {
    children: React.ReactNode;
    theme?: Theme;
}

/**
 * Test wrapper component that provides necessary providers
 */
export const TestWrapper: React.FC<TestWrapperProps> = ({
    children,
    theme = createTestTheme(),
}) => (
    <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </BrowserRouter>
);

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
    theme?: Theme;
}

/**
 * Renders a component with all necessary providers
 */
export const renderWithProviders = (
    ui: React.ReactElement,
    options: RenderWithProvidersOptions = {}
) => {
    const { theme = createTestTheme(), ...renderOptions } = options;

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
    success: (data: unknown) => ({
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
     */
    createMockFunction: () => jest.fn(),

    /**
     * Mocks console methods to suppress expected warnings in tests
     */
    suppressConsoleWarnings: () => {
        const warnSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => undefined);
        const errorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        return () => {
            warnSpy.mockRestore();
            errorSpy.mockRestore();
        };
    },
};

interface ChartDataPoint {
    x: number;
    y: number;
}

interface UserData {
    id: number;
    name: string;
    email: string;
    [key: string]: unknown;
}

/**
 * Common test data generators
 */
export const testDataGenerators = {
    /**
     * Generates mock chart data for testing
     */
    generateChartData: (length = 10): ChartDataPoint[] =>
        Array.from({ length }, (_, i) => ({
            x: i + 1,
            y: Math.random() * 100,
        })),

    /**
     * Generates mock user data for testing
     */
    generateUserData: (overrides: Partial<UserData> = {}): UserData => ({
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
