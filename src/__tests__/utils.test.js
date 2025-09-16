import { screen } from '@testing-library/react';
import {
    createTestTheme,
    renderWithProviders,
    mockData,
    mockFetchResponses,
    testUtils,
    testDataGenerators,
} from '../utils';

describe('Test Utilities', () => {
    /**
     * Tests the test utility functions to ensure they work correctly
     * for providing consistent testing infrastructure across all test files.
     */

    test('createTestTheme returns a valid theme object', () => {
        const theme = createTestTheme();
        expect(theme).toBeDefined();
        expect(theme.palette).toBeDefined();
        expect(theme.palette.mode).toBe('dark');
        expect(theme.typography.fontFamily).toBe('monospace');
    });

    test('TestWrapper renders children correctly', () => {
        renderWithProviders(<div data-testid="test-child">Test Content</div>);
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    test('mockData contains expected structure', () => {
        expect(mockData.zsharp).toBeDefined();
        expect(mockData.zsharp.train_accuracies).toBeDefined();
        expect(mockData.oligopoly).toBeDefined();
        expect(Array.isArray(mockData.oligopoly)).toBe(true);
    });

    test('mockFetchResponses provides correct response objects', () => {
        const successResponse = mockFetchResponses.success({ test: 'data' });
        expect(successResponse.ok).toBe(true);
        expect(typeof successResponse.arrayBuffer).toBe('function');

        const errorResponse = mockFetchResponses.error();
        return expect(errorResponse).rejects.toThrow('Network error');
    });

    test('testUtils.createMockFunction returns a jest mock', () => {
        const mockFn = testUtils.createMockFunction();
        expect(jest.isMockFunction(mockFn)).toBe(true);
    });

    test('testDataGenerators.generateChartData creates correct data', () => {
        const chartData = testDataGenerators.generateChartData(5);
        expect(chartData).toHaveLength(5);
        expect(chartData[0]).toHaveProperty('x');
        expect(chartData[0]).toHaveProperty('y');
    });

    test('testDataGenerators.generateUserData creates user object', () => {
        const userData = testDataGenerators.generateUserData({
            name: 'Custom User',
        });
        expect(userData.id).toBe(1);
        expect(userData.name).toBe('Custom User');
        expect(userData.email).toBe('test@example.com');
    });
});
