import React from 'react';

export interface ViewType<T> {
    key: string;
    label: string;
    icon: React.ElementType;
    chartTitle: string;
    dataProcessor: (data: T[]) => unknown[];
    chartConfig: any; // Keeping any here as ChartConfig is complex and defined elsewhere, or could import it
}

export interface ResearchDemoProps<T> {
    title: string;
    subtitle: string;
    githubUrl: string;
    chartData?: T[];
    chartConfig?: any;
    viewTypes?: ViewType<T>[];
    currentViewType?: string;
    onViewTypeChange?: (viewType: string) => void;
    controls?: any[];
    loading?: boolean;
    loadingMessage?: string;
    onReset?: () => void;
    resetLabel?: string;
    chartTitle?: string | null;
}

declare const ResearchDemo: <T>(
    props: ResearchDemoProps<T>
) => React.JSX.Element;

export default ResearchDemo;
