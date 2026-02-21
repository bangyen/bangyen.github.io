import { render, screen } from '@testing-library/react';
import React from 'react';

import {
    createTestTheme,
    TestWrapper,
    renderWithProviders,
    mockData,
    mockFetchResponses,
    testUtils,
} from '../utils';

// Mock component for testing
const MockComponent: React.FC = () => (
    <div data-testid="mock-component">Test Component</div>
);

describe('Test Utilities', () => {
    /**
     * Tests the utility functions and helpers used across the test suite
     * to ensure they provide consistent and reliable testing infrastructure.
     */
    describe('createTestTheme', () => {
        test('creates a valid Material-UI theme', () => {
            const theme = createTestTheme();

            expect(theme).toBeDefined();
            expect(theme.palette).toBeDefined();
            expect(theme.palette.mode).toBe('dark');
            expect(theme.typography.fontFamily).toBe('monospace');
        });

        test('creates theme with correct color palette', () => {
            const theme = createTestTheme();

            expect(theme.palette.primary).toBeDefined();
            expect(theme.palette.secondary).toBeDefined();
        });
    });

    describe('TestWrapper', () => {
        test('renders children with theme provider', () => {
            render(
                <TestWrapper>
                    <MockComponent />
                </TestWrapper>,
            );

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });

        test('accepts custom theme', () => {
            const customTheme = createTestTheme();
            customTheme.palette.mode = 'light';

            render(
                <TestWrapper theme={customTheme}>
                    <MockComponent />
                </TestWrapper>,
            );

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });

        test('provides router context', () => {
            render(
                <TestWrapper>
                    <MockComponent />
                </TestWrapper>,
            );

            // Should render without router errors
            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });
    });

    describe('renderWithProviders', () => {
        test('renders component with providers', () => {
            renderWithProviders(<MockComponent />);

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });

        test('accepts custom theme option', () => {
            const customTheme = createTestTheme();
            customTheme.palette.mode = 'light';

            renderWithProviders(<MockComponent />, { theme: customTheme });

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });

        test('passes through render options', () => {
            renderWithProviders(<MockComponent />, {
                container: document.body,
            });

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });
    });

    describe('mockData', () => {
        test('provides valid ZSharp data structure', () => {
            expect(mockData.zsharp).toBeDefined();
            expect(mockData.zsharp.train_accuracies).toBeInstanceOf(Array);
            expect(mockData.zsharp.train_losses).toBeInstanceOf(Array);
            expect(mockData.zsharp.train_accuracies).toHaveLength(5);
            expect(mockData.zsharp.train_losses).toHaveLength(5);
        });

        test('provides valid Oligopoly data structure', () => {
            expect(mockData.oligopoly).toBeDefined();
            expect(mockData.oligopoly).toBeInstanceOf(Array);
            expect(mockData.oligopoly).toHaveLength(3);

            for (const item of mockData.oligopoly) {
                expect(item).toHaveProperty('round');
                expect(item).toHaveProperty('price');
                expect(item).toHaveProperty('hhi');
            }
        });

        test('has correct data types', () => {
            expect(typeof mockData.zsharp.train_accuracies[0]!).toBe('number');
            expect(typeof mockData.zsharp.train_losses[0]!).toBe('number');
            expect(typeof mockData.oligopoly[0]!.round).toBe('number');
            expect(typeof mockData.oligopoly[0]!.price).toBe('number');
            expect(typeof mockData.oligopoly[0]!.hhi).toBe('number');
        });
    });

    describe('mockFetchResponses', () => {
        test('success response returns valid structure', async () => {
            const testData = { test: 'data' };
            const response = mockFetchResponses.success(testData);

            expect(response.ok).toBe(true);
            expect(typeof response.arrayBuffer).toBe('function');

            const buffer = await response.arrayBuffer();
            expect(buffer).toBeInstanceOf(ArrayBuffer);
        });

        test('error response rejects with error', async () => {
            const response = mockFetchResponses.error();

            await expect(response).rejects.toThrow('Network error');
        });

        test('success response encodes data correctly', async () => {
            const testData = { message: 'hello world' };
            const response = mockFetchResponses.success(testData);

            const buffer = await response.arrayBuffer();
            const decoded = String.fromCharCode(...new Uint8Array(buffer));
            const parsed = JSON.parse(decoded) as unknown;

            expect(parsed).toEqual(testData);
        });
    });

    describe('testUtils', () => {
        test('createMockFunction returns vitest mock', () => {
            const mockFn = testUtils.createMockFunction();

            expect(vi.isMockFunction(mockFn)).toBe(true);
        });

        test('suppressConsoleWarnings suppresses console methods', () => {
            const restore = testUtils.suppressConsoleWarnings();

            // Console methods should be mocked
            expect(vi.isMockFunction(console.warn)).toBe(true);
            expect(vi.isMockFunction(console.error)).toBe(true);

            // Restore should work
            restore();

            // Console methods should be restored
            expect(vi.isMockFunction(console.warn)).toBe(false);
            expect(vi.isMockFunction(console.error)).toBe(false);
        });

        test('suppressConsoleWarnings allows calling console methods', () => {
            const restore = testUtils.suppressConsoleWarnings();

            // Should not throw errors
            expect(() => {
                console.warn('test warning');
            }).not.toThrow();
            expect(() => {
                console.error('test error');
            }).not.toThrow();

            restore();
        });
    });

    describe('Integration Tests', () => {
        test('all utilities work together', () => {
            const theme = createTestTheme();
            const mockFn = testUtils.createMockFunction();

            expect(theme).toBeDefined();
            expect(vi.isMockFunction(mockFn)).toBe(true);
        });

        test('renderWithProviders works with mock data', () => {
            const TestComponent: React.FC = () => (
                <div data-testid="data-test">
                    {mockData.zsharp.train_accuracies.length} accuracy points
                </div>
            );

            renderWithProviders(<TestComponent />);

            expect(screen.getByTestId('data-test')).toHaveTextContent(
                '5 accuracy points',
            );
        });

        test('mock fetch responses work with async operations', async () => {
            const testData = { async: 'test' };
            const response = mockFetchResponses.success(testData);

            const buffer = await response.arrayBuffer();
            const decoded = String.fromCharCode(...new Uint8Array(buffer));
            const parsed = JSON.parse(decoded) as unknown;

            expect(parsed).toEqual(testData);
        });
    });
});
