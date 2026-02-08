import React from 'react';

export interface ChartConfig {
    type: string;
    lines: {
        dataKey: string;
        name: string;
        color: string;
        yAxisId?: string;
    }[];
    xAxisKey: string;
    yAxisFormatter: (value: number) => string;
    yAxisDomain: string[];
    dualYAxis?: boolean;
    rightYAxisFormatter?: (value: number) => string;
    rightYAxisDomain?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltipLabelFormatter: (value: any) => React.ReactNode;
    tooltipFormatter: (value: number, name: string) => [string, string];
}

export interface ViewType<T> {
    key: string;
    label: string;
    icon: React.ElementType;
    chartTitle: string;
    dataProcessor: (data: T[]) => unknown[];
    chartConfig: ChartConfig;
}

export interface ControlOption {
    value: number;
    label: string;
}

export interface Control {
    label: string;
    icon?: React.ElementType;
    color?: string;
    hoverColor?: string;
    value: number;
    onChange: (value: number) => void;
    options: ControlOption[];
}

export interface ResearchDemoProps<T> {
    title: string;
    subtitle: string;
    githubUrl: string;
    chartData?: T[];
    chartConfig?: ChartConfig;
    viewTypes?: ViewType<T>[];
    currentViewType?: string;
    onViewTypeChange?: (value: string) => void;
    controls?: Control[];
    loading?: boolean;
    loadingMessage?: string;
    onReset?: () => void;
    resetLabel?: string;
    chartTitle?: string | null;
    children?: React.ReactNode;
    backUrl?: string;
}
