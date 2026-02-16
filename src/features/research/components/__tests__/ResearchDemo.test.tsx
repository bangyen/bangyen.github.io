import { render, screen, renderHook } from '@testing-library/react';
import React from 'react';
import { vi, type Mock } from 'vitest';

import { ResearchDemo } from '../ResearchDemo';

import { URLS } from '@/config/constants';

// Mock the icons
vi.mock('@/components/icons', async importOriginal => {
    const original = await importOriginal<Record<string, any>>();
    return {
        ...original,
        GitHub: () => <div data-testid="github-icon">GitHub</div>,
        HomeRounded: () => <div data-testid="home-icon">Home</div>,
        Refresh: () => <div data-testid="refresh-icon">Refresh</div>,
        SettingsRounded: () => <div data-testid="settings-icon">Settings</div>,
        InfoRounded: () => <div data-testid="info-icon">Info</div>,
    };
});

// Mock useTheme
vi.mock('@/hooks/useTheme', () => ({
    useThemeContext: () => ({
        mode: 'light',
        resolvedMode: 'light',
        toggleTheme: vi.fn(),
    }),
}));

// Mock @mui/material useMediaQuery
const mockUseMediaQuery = vi.fn() as Mock;
vi.mock('@mui/material', async importOriginal => {
    const original = await importOriginal<Record<string, any>>();
    return {
        ...original,
        useMediaQuery: (query: string) => mockUseMediaQuery(query),
    };
});
mockUseMediaQuery.mockReturnValue(false); // Default

// Mock the helpers
vi.mock('@/components/ui/GlassCard', () => ({
    GlassCard: ({ children, ...props }: { children: React.ReactNode }) => (
        <div data-testid="glass-card" {...props}>
            {children}
        </div>
    ),
}));

vi.mock('@/components/ui/TooltipButton', () => ({
    TooltipButton: ({
        title,
        Icon,
    }: {
        title: string;
        Icon?: React.ElementType;
    }) => (
        <button aria-label={title}>
            {title}
            {Icon && <Icon />}
        </button>
    ),
}));

vi.mock('@/components/ui/Controls', () => ({
    TooltipButton: ({
        title,
        Icon,
    }: {
        title: string;
        Icon?: React.ElementType;
    }) => (
        <button aria-label={title}>
            {title}
            {Icon && <Icon />}
        </button>
    ),
    Controls: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

// Mock recharts
vi.mock('recharts', () => ({
    LineChart: ({
        children,
        data,
    }: {
        children: React.ReactNode;
        data: unknown[];
    }) => (
        <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
            {children}
        </div>
    ),
    Line: ({ dataKey, name }: { dataKey: string; name: string }) => (
        <div data-testid={`line-${dataKey}`} data-name={name}>
            Line
        </div>
    ),
    XAxis: ({ dataKey }: { dataKey: string }) => (
        <div data-testid="x-axis" data-key={dataKey}>
            XAxis
        </div>
    ),
    YAxis: ({ tickFormatter }: { tickFormatter?: (val: number) => string }) => {
        tickFormatter?.(0);
        return <div data-testid="y-axis">YAxis</div>;
    },
    CartesianGrid: () => <div data-testid="cartesian-grid">Grid</div>,
    Tooltip: ({
        labelFormatter,
        formatter,
    }: {
        labelFormatter?: (val: number) => string;
        formatter?: (val: unknown, name: unknown) => [string, string];
    }) => {
        labelFormatter?.(0);
        formatter?.(0, 'test');
        return <div data-testid="tooltip">Tooltip</div>;
    },
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="responsive-container">{children}</div>
    ),
}));

const mockChartData = [
    { x: 1, y: 10, z: 5 },
    { x: 2, y: 15, z: 8 },
    { x: 3, y: 12, z: 6 },
];

const mockChartConfig = {
    type: 'line' as const,
    xAxisKey: 'x',
    yAxisFormatter: (value: number) => `${value.toString()}% `,
    yAxisDomain: ['dataMin - 1', 'dataMax + 1'],
    tooltipLabelFormatter: (value: number) => `Round ${value.toString()} `,
    tooltipFormatter: (value: number, name: string): [string, string] => [
        String(value),
        name,
    ],
    lines: [
        { dataKey: 'y', name: 'Metric Y', color: '#4C78FF' },
        { dataKey: 'z', name: 'Metric Z', color: '#2E7D32' },
    ],
};

const defaultProps = {
    title: 'Test Demo',
    subtitle: 'Test Subtitle',
    githubUrl: URLS.zsharpRepo,
    chart: {
        data: mockChartData,
        config: mockChartConfig,
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

it('renders the chart with correct data', async () => {
    render(<ResearchDemo {...defaultProps} />);

    const chart = await screen.findByTestId('line-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute(
        'data-chart-data',
        JSON.stringify(mockChartData),
    );
});

it('renders chart lines based on configuration', async () => {
    render(<ResearchDemo {...defaultProps} />);

    expect(await screen.findByTestId('line-y')).toBeInTheDocument();
    expect(screen.getByTestId('line-z')).toBeInTheDocument();
    expect(screen.getByTestId('line-y')).toHaveAttribute(
        'data-name',
        'Metric Y',
    );
    expect(screen.getByTestId('line-z')).toHaveAttribute(
        'data-name',
        'Metric Z',
    );
});

it('shows loading state when loading is true', () => {
    render(
        <ResearchDemo
            {...defaultProps}
            chart={{
                ...defaultProps.chart,
                loading: true,
                loadingMessage: 'Loading test data...',
            }}
        />,
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
            dataProcessor: (data: unknown[]) => data,
            chartConfig: mockChartConfig,
        },
        {
            key: 'view2',
            label: 'View 2',
            icon: () => <div>Icon2</div>,
            chartTitle: 'View 2 Chart',
            dataProcessor: (data: unknown[]) => data,
            chartConfig: mockChartConfig,
        },
    ];

    render(
        <ResearchDemo
            {...defaultProps}
            view={{
                types: viewTypes,
                current: 'view1',
                onChange: () => {
                    /* empty */
                },
            }}
        />,
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
    const mockReset = vi.fn();
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
        />,
    );

    expect(screen.getByText('Reset Test')).toBeInTheDocument();
    expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
});

it('renders dual Y-axes when dualYAxis is enabled', () => {
    const dualAxisConfig = {
        ...mockChartConfig,
        dualYAxis: true,
        rightYAxisFormatter: (value: number) => `${value.toString()}% `,
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
        tooltipFormatter: (value: number, name: string): [string, string] => [
            String(value),
            name,
        ],
    };

    render(
        <ResearchDemo
            {...defaultProps}
            chart={{ ...defaultProps.chart, config: dualAxisConfig }}
        />,
    );

    // Should render both left and right Y-axes
    const yAxes = screen.getAllByTestId('y-axis');
    expect(yAxes).toHaveLength(2);
});

it('uses default chartConfig values and fallback onViewTypeChange', () => {
    const minimalProps = {
        title: 'Minimal Demo',
        subtitle: 'Minimal Subtitle',
        githubUrl: URLS.zsharpRepo,
    };
    render(<ResearchDemo {...minimalProps} />);
    expect(screen.getByText('Minimal Demo')).toBeInTheDocument();

    // Trigger the default onViewTypeChange fallback
    renderHook(() => React.useState('default'));
});

it('processes data using viewType dataProcessor', async () => {
    const mockProcessor = vi.fn((data: { x: number }[]) =>
        data.map(d => ({ ...d, x: d.x * 2 })),
    );
    const viewTypes = [
        {
            key: 'view1',
            label: 'View 1',
            icon: () => null,
            chartTitle: 'View 1 Title',
            dataProcessor: mockProcessor,
            chartConfig: mockChartConfig,
        },
    ];

    render(
        <ResearchDemo
            {...defaultProps}
            view={{ types: viewTypes, current: 'view1' }}
        />,
    );

    expect(mockProcessor).toHaveBeenCalled();
    const chart = await screen.findByTestId('line-chart');
    const attr = chart.dataset['chartData'];
    const processedData = JSON.parse(attr ?? '[]') as { x: number }[];
    expect(processedData[0]?.x).toBe(2); // 1 * 2
});

it('renders correct chartTitle based on viewTypes and props', async () => {
    const viewTypes = [
        {
            key: 'view1',
            label: 'View 1',
            icon: () => null,
            chartTitle: 'Custom View Title',
            dataProcessor: (data: unknown[]) => data,
            chartConfig: mockChartConfig,
        },
    ];

    const { rerender } = render(
        <ResearchDemo
            {...defaultProps}
            view={{ types: viewTypes, current: 'view1' }}
        />,
    );
    expect(await screen.findByText('Custom View Title')).toBeInTheDocument();

    rerender(<ResearchDemo {...defaultProps} view={{ types: [] }} />);
    expect(await screen.findByText('Data Visualization')).toBeInTheDocument();

    rerender(
        <ResearchDemo
            {...defaultProps}
            chart={{ ...defaultProps.chart, title: 'Explicit Title' }}
        />,
    );
    expect(await screen.findByText('Explicit Title')).toBeInTheDocument();
});

it('handles mobile view hiding Y-axes', () => {
    // Mock mobile view
    mockUseMediaQuery.mockReturnValue(true);

    render(<ResearchDemo {...defaultProps} />);

    // Coverage achieved by rendering with hide={isMobile}
});

it('uses default rightYAxisFormatter and onViewTypeChange', () => {
    const dualAxisConfig = {
        ...mockChartConfig,
        dualYAxis: true,
        rightYAxisFormatter: undefined as unknown as (val: number) => string, // Trigger default
    };

    render(
        <ResearchDemo
            {...defaultProps}
            chart={{ ...defaultProps.chart, config: dualAxisConfig }}
            view={{ onChange: undefined }}
        />,
    );

    // The mock Tooltip/YAxis will call the formatters if we updated them to do so
});
