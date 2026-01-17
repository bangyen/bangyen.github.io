import React from 'react';

export interface ChartConfig {
    type: string;
    xAxisKey: string;
    yAxisFormatter: (value: number) => string;
    yAxisDomain: string[];
    tooltipLabelFormatter: (value: number) => string;
    tooltipFormatter: (value: number, name: string) => [string, string];
    lines: Array<{
        dataKey: string;
        name: string;
        color: string;
        yAxisId?: string;
    }>;
    dualYAxis?: boolean;
    rightYAxisFormatter?: (value: number) => string;
    rightYAxisDomain?: string[];
}

export interface ViewType {
    key: string;
    label: string;
    icon: React.ElementType;
    chartTitle: string;
    dataProcessor: (data: any[]) => any[];
    chartConfig: ChartConfig;
}

export interface ResearchDemoProps {
    title: string;
    subtitle: string;
    githubUrl: string;
    chartData?: any[];
    chartConfig?: ChartConfig;
    viewTypes?: ViewType[];
    currentViewType?: string;
    onViewTypeChange?: (value: string) => void;
    controls?: any[];
    loading?: boolean;
    loadingMessage?: string;
    onReset?: () => void;
    resetLabel?: string;
    chartTitle?: string | null;
}

declare const ResearchDemo: React.FC<ResearchDemoProps>;

export default ResearchDemo;
