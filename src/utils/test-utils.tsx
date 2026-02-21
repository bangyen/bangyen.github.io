import { grey, blueGrey } from '@mui/material/colors';
import type { Theme } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    render,
    type RenderOptions,
    type RenderResult,
} from '@testing-library/react';
import React from 'react';
import {
    createMemoryRouter,
    RouterProvider,
    type RouteObject,
} from 'react-router-dom';
import { vi } from 'vitest';

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

export interface TestWrapperProps {
    children: React.ReactNode;
    theme?: Theme;
}

/**
 * Test wrapper component that provides necessary providers.
 * Uses a data router (createMemoryRouter) so components calling
 * `useLoaderData`, `useRouteError`, etc. work correctly in tests.
 */
export const TestWrapper: React.FC<TestWrapperProps> = ({
    children,
    theme = createTestTheme(),
}) => {
    const router = React.useMemo(
        () =>
            createMemoryRouter([{ path: '/', element: children }], {
                initialEntries: ['/'],
            }),
        [children],
    );

    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
    theme?: Theme;
}

/**
 * Renders a component with all necessary providers
 */
export const renderWithProviders = (
    ui: React.ReactElement,
    options: RenderWithProvidersOptions = {},
): RenderResult => {
    const { theme = createTestTheme(), ...renderOptions } = options;

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <TestWrapper theme={theme}>{children}</TestWrapper>
    );

    return render(ui, { wrapper: Wrapper, ...renderOptions });
};

interface RenderWithDataRouterOptions extends Omit<RenderOptions, 'wrapper'> {
    theme?: Theme;
    /** Loader data returned by `useLoaderData()` inside the component. */
    loaderData?: unknown;
    /** Initial URL entries for the memory router. */
    initialEntries?: string[];
    /** Additional route objects (e.g. siblings, layout routes). */
    routes?: RouteObject[];
}

/**
 * Renders a component inside a `createMemoryRouter` so hooks like
 * `useLoaderData`, `useRouteError`, `useNavigate`, etc. work.
 */
export const renderWithDataRouter = (
    ui: React.ReactElement,
    {
        theme = createTestTheme(),
        loaderData,
        initialEntries = ['/'],
        routes: extraRoutes = [],
        ...renderOptions
    }: RenderWithDataRouterOptions = {},
): RenderResult => {
    const mainRoute: RouteObject = {
        path: '/',
        element: ui,
        ...(loaderData === undefined ? {} : { loader: () => loaderData }),
    };

    const router = createMemoryRouter([mainRoute, ...extraRoutes], {
        initialEntries,
    });

    return render(
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>,
        renderOptions,
    );
};

/**
 * Mock data for testing
 */
export const mockData = {
    zsharp: {
        train_accuracies: [0.1, 0.2, 0.3, 0.4, 0.5],
        train_losses: [2, 1.5, 1, 0.8, 0.6],
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
                [...JSON.stringify(data)].map(c => c.charCodeAt(0)),
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
     * Mocks console methods to suppress expected warnings in tests
     */
    suppressConsoleWarnings: (): (() => void) => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
            // Noop for testing
        });
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
            // Noop for testing
        });

        return () => {
            warnSpy.mockRestore();
            errorSpy.mockRestore();
        };
    },
};

const testUtilsExport = {
    createTestTheme,
    TestWrapper,
    renderWithProviders,
    mockData,
    mockFetchResponses,
    testUtils,
};

export default testUtilsExport;
