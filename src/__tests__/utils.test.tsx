import React from 'react';
import { render, screen } from '@testing-library/react';
import {
    createTestTheme,
    TestWrapper,
    renderWithProviders,
    mockData,
    mockFetchResponses,
    testUtils,
    testDataGenerators,
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
                </TestWrapper>
            );

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });

        test('accepts custom theme', () => {
            const customTheme = createTestTheme();
            customTheme.palette.mode = 'light';

            render(
                <TestWrapper theme={customTheme}>
                    <MockComponent />
                </TestWrapper>
            );

            expect(screen.getByTestId('mock-component')).toBeInTheDocument();
        });

        test('provides router context', () => {
            render(
                <TestWrapper>
                    <MockComponent />
                </TestWrapper>
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

            mockData.oligopoly.forEach(item => {
                expect(item).toHaveProperty('round');
                expect(item).toHaveProperty('price');
                expect(item).toHaveProperty('hhi');
            });
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
            const decoded = String.fromCharCode(
                ...Array.from(new Uint8Array(buffer))
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const parsed = JSON.parse(decoded);

            expect(parsed).toEqual(testData);
        });
    });

    describe('testUtils', () => {
        test('createMockFunction returns jest mock', () => {
            const mockFn = testUtils.createMockFunction();

            expect(jest.isMockFunction(mockFn)).toBe(true);
        });

        test('suppressConsoleWarnings suppresses console methods', () => {
            const restore = testUtils.suppressConsoleWarnings();

            // Console methods should be mocked
            expect(jest.isMockFunction(console.warn)).toBe(true);
            expect(jest.isMockFunction(console.error)).toBe(true);

            // Restore should work
            restore();

            // Console methods should be restored
            expect(jest.isMockFunction(console.warn)).toBe(false);
            expect(jest.isMockFunction(console.error)).toBe(false);
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

    describe('testDataGenerators', () => {
        test('generateChartData creates array of correct length', () => {
            const data = testDataGenerators.generateChartData(5);

            expect(data).toHaveLength(5);
            expect(Array.isArray(data)).toBe(true);
        });

        test('generateChartData creates valid data structure', () => {
            const data = testDataGenerators.generateChartData(3);

            data.forEach((item, index) => {
                expect(item).toHaveProperty('x', index + 1);
                expect(item).toHaveProperty('y');
                expect(typeof item.x).toBe('number');
                expect(typeof item.y).toBe('number');
            });
        });

        test('generateChartData uses default length', () => {
            const data = testDataGenerators.generateChartData();

            expect(data).toHaveLength(10);
        });

        test('generateUserData creates valid user object', () => {
            const user = testDataGenerators.generateUserData();

            expect(user).toHaveProperty('id', 1);
            expect(user).toHaveProperty('name', 'Test User');
            expect(user).toHaveProperty('email', 'test@example.com');
        });

        test('generateUserData accepts overrides', () => {
            const overrides = { name: 'Custom User', age: 25 };
            const user = testDataGenerators.generateUserData(overrides);

            expect(user).toHaveProperty('id', 1);
            expect(user).toHaveProperty('name', 'Custom User');
            expect(user).toHaveProperty('email', 'test@example.com');
            expect(user).toHaveProperty('age', 25);
        });

        test('generateUserData handles empty overrides', () => {
            const user = testDataGenerators.generateUserData({});

            expect(user).toHaveProperty('id', 1);
            expect(user).toHaveProperty('name', 'Test User');
            expect(user).toHaveProperty('email', 'test@example.com');
        });
    });

    describe('Integration Tests', () => {
        test('all utilities work together', () => {
            const theme = createTestTheme();
            const mockFn = testUtils.createMockFunction();
            const chartData = testDataGenerators.generateChartData(3);
            const userData = testDataGenerators.generateUserData({
                name: 'Integration Test',
            });

            expect(theme).toBeDefined();
            expect(jest.isMockFunction(mockFn)).toBe(true);
            expect(chartData).toHaveLength(3);
            expect(userData.name).toBe('Integration Test');
        });

        test('renderWithProviders works with mock data', () => {
            const TestComponent: React.FC = () => (
                <div data-testid="data-test">
                    {mockData.zsharp.train_accuracies.length} accuracy points
                </div>
            );

            renderWithProviders(<TestComponent />);

            expect(screen.getByTestId('data-test')).toHaveTextContent(
                '5 accuracy points'
            );
        });

        test('mock fetch responses work with async operations', async () => {
            const testData = { async: 'test' };
            const response = mockFetchResponses.success(testData);

            const buffer = await response.arrayBuffer();
            const decoded = String.fromCharCode(
                ...Array.from(new Uint8Array(buffer))
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const parsed = JSON.parse(decoded);

            expect(parsed).toEqual(testData);
        });
    });

    describe('Error Handling', () => {
        test('handles invalid chart data length', () => {
            const data = testDataGenerators.generateChartData(0);

            expect(data).toHaveLength(0);
            expect(Array.isArray(data)).toBe(true);
        });

        test('handles negative chart data length', () => {
            const data = testDataGenerators.generateChartData(-1);

            expect(data).toHaveLength(0);
            expect(Array.isArray(data)).toBe(true);
        });

        test('handles null overrides in generateUserData', () => {
            const user = testDataGenerators.generateUserData(
                null as unknown as Partial<
                    ReturnType<typeof testDataGenerators.generateUserData>
                >
            );

            expect(user).toHaveProperty('id', 1);
            expect(user).toHaveProperty('name', 'Test User');
            expect(user).toHaveProperty('email', 'test@example.com');
        });
    });
});
