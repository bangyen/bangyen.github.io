import React from 'react';
import { SvgIcon } from '@mui/material';

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
    }>;
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
    viewTypes?: ViewType[];
    currentViewType?: string;
    onViewTypeChange?: (value: string) => void;
    loading?: boolean;
    loadingMessage?: string;
}

declare const ResearchDemo: React.FC<ResearchDemoProps>;

export default ResearchDemo;

