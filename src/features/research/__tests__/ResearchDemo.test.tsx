import React from 'react';
import { render, screen } from '@testing-library/react';
import ResearchDemo from '../ResearchDemo';
import { URLS } from '../../../config/constants';

// Mock the icons
jest.mock('../../components/icons', () => ({
    GitHub: () => <div data-testid="github-icon">GitHub</div>,
    HomeRounded: () => <div data-testid="home-icon">Home</div>,
    Refresh: () => <div data-testid="refresh-icon">Refresh</div>,
    SettingsRounded: () => <div data-testid="settings-icon">Settings</div>,
}));

// Mock the helpers
jest.mock('../../components/ui/GlassCard', () => ({
    GlassCard: ({ children, ...props }: any) => (
        <div data-testid="glass-card" {...props}>
            {children}
        </div>
    ),
}));

// Mock recharts
jest.mock('recharts', () => ({
    LineChart: ({ children, data }: any) => (
        <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
            {children}
        </div>
    ),
    Line: ({ dataKey, name }: any) => (
        <div data-testid={`line - ${dataKey} `} data-name={name}>
            Line
        </div>
    ),
    XAxis: ({ dataKey }: any) => (
        <div data-testid="x-axis" data-key={dataKey}>
            XAxis
        </div>
    ),
    YAxis: () => <div data-testid="y-axis">YAxis</div>,
    CartesianGrid: () => <div data-testid="cartesian-grid">Grid</div>,
    Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
    ResponsiveContainer: ({ children }: any) => (
        <div data-testid="responsive-container">{children}</div>
    ),
}));

describe('ResearchDemo', () => {
    const mockChartData = [
        { x: 1, y: 10, z: 5 },
        { x: 2, y: 15, z: 8 },
        { x: 3, y: 12, z: 6 },
    ];

    const defaultProps = {
        title: 'Test Demo',
        subtitle: 'Test Subtitle',
        githubUrl: URLS.zsharpRepo,
        chartData: mockChartData,
        chartConfig: {
            type: 'line' as const,
            xAxisKey: 'x',
            yAxisFormatter: (value: number) => `${value}% `,
            yAxisDomain: ['dataMin - 1', 'dataMax + 1'],
            tooltipLabelFormatter: (value: number) => `Round ${value} `,
            tooltipFormatter: (
                value: number,
                name: string
            ): [string, string] => [String(value), name],
            lines: [
                { dataKey: 'y', name: 'Metric Y', color: '#4C78FF' },
                { dataKey: 'z', name: 'Metric Z', color: '#2E7D32' },
            ],
        },
    };

    it('renders the title and subtitle correctly', () => {
        render(<ResearchDemo {...defaultProps} />);

        expect(screen.getByText('Test Demo')).toBeInTheDocument();
        expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('renders GitHub and Home icons', () => {
        render(<ResearchDemo {...defaultProps} />);

        expect(screen.getByTestId('github-icon')).toBeInTheDocument();
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('renders the chart with correct data', () => {
        render(<ResearchDemo {...defaultProps} />);

        const chart = screen.getByTestId('line-chart');
        expect(chart).toBeInTheDocument();
        expect(chart).toHaveAttribute(
            'data-chart-data',
            JSON.stringify(mockChartData)
        );
    });

    it('renders chart lines based on configuration', () => {
        render(<ResearchDemo {...defaultProps} />);

        expect(screen.getByTestId('line-y')).toBeInTheDocument();
        expect(screen.getByTestId('line-z')).toBeInTheDocument();
        expect(screen.getByTestId('line-y')).toHaveAttribute(
            'data-name',
            'Metric Y'
        );
        expect(screen.getByTestId('line-z')).toHaveAttribute(
            'data-name',
            'Metric Z'
        );
    });

    it('shows loading state when loading is true', () => {
        render(
            <ResearchDemo
                {...defaultProps}
                loading={true}
                loadingMessage="Loading test data..."
            />
        );

        expect(screen.getByText('Loading test data...')).toBeInTheDocument();
    });

    it('renders view type buttons when viewTypes are provided', () => {
        const viewTypes = [
            {
                key: 'view1',
                label: 'View 1',
                icon: () => <div>Icon1</div>,
                chartTitle: 'View 1 Chart',
                dataProcessor: (data: any[]) => data,
                chartConfig: defaultProps.chartConfig,
            },
            {
                key: 'view2',
                label: 'View 2',
                icon: () => <div>Icon2</div>,
                chartTitle: 'View 2 Chart',
                dataProcessor: (data: any[]) => data,
                chartConfig: defaultProps.chartConfig,
            },
        ];

        render(
            <ResearchDemo
                {...defaultProps}
                viewTypes={viewTypes}
                currentViewType="view1"
                onViewTypeChange={() => {
                    /* empty */
                }}
            />
        );

        expect(screen.getByText('View 1')).toBeInTheDocument();
        expect(screen.getByText('View 2')).toBeInTheDocument();
    });

    it('renders controls when provided', () => {
        const controls = [
            {
                label: 'Test Control',
                icon: () => <div>ControlIcon</div>,
                color: '#4C78FF',
                value: 1,
                onChange: () => {
                    /* empty */
                },
                options: [
                    { value: 1, label: 'Option 1' },
                    { value: 2, label: 'Option 2' },
                ],
            },
        ];

        render(<ResearchDemo {...defaultProps} controls={controls} />);

        expect(screen.getByText('Test Control')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('renders reset button when onReset is provided', () => {
        const mockReset = jest.fn();
        const controls = [
            {
                label: 'Test Control',
                icon: () => <div>ControlIcon</div>,
                color: '#4C78FF',
                value: 1,
                onChange: () => {
                    /* empty */
                },
                options: [
                    { value: 1, label: 'Option 1' },
                    { value: 2, label: 'Option 2' },
                ],
            },
        ];

        render(
            <ResearchDemo
                {...defaultProps}
                controls={controls}
                onReset={mockReset}
                resetLabel="Reset Test"
            />
        );

        expect(screen.getByText('Reset Test')).toBeInTheDocument();
        expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
    });

    it('renders dual Y-axes when dualYAxis is enabled', () => {
        const dualAxisConfig = {
            ...defaultProps.chartConfig,
            dualYAxis: true,
            rightYAxisFormatter: (value: number) => `${value}% `,
            rightYAxisDomain: ['dataMin - 1', 'dataMax + 1'],
            lines: [
                {
                    dataKey: 'y',
                    name: 'Metric Y',
                    color: '#4C78FF',
                    yAxisId: 'left',
                },
                {
                    dataKey: 'z',
                    name: 'Metric Z',
                    color: '#2E7D32',
                    yAxisId: 'right',
                },
            ],
            tooltipFormatter: (
                value: number,
                name: string
            ): [string, string] => [String(value), name],
        };

        render(<ResearchDemo {...defaultProps} chartConfig={dualAxisConfig} />);

        // Should render both left and right Y-axes
        const yAxes = screen.getAllByTestId('y-axis');
        expect(yAxes).toHaveLength(2);
    });
});
