import type React from 'react';

/** Supported chart types rendered by `ResearchChart`. */
export type ChartType = 'line' | 'bar';

export interface ChartConfig {
    type: ChartType;
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
    tooltipLabelFormatter: (value: number) => string;
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

export interface ControlConfig {
    key: string;
    label: string;
    icon?: React.ElementType;
    color?: string;
    hoverColor?: string;
    defaultValue: number;
    options: ControlOption[];
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

/** Chart-related props grouped for `ResearchDemo`. */
export interface ResearchDemoChartProps<T> {
    data?: T[];
    config?: ChartConfig;
    title?: string | null;
    loading?: boolean;
    loadingMessage?: string;
}

/** View-selector props grouped for `ResearchDemo`. */
export interface ResearchDemoViewProps<T> {
    types?: ViewType<T>[];
    current?: string;
    onChange?: (value: string) => void;
}

export interface ResearchDemoProps<T> {
    title: string;
    /** Document title set via PageLayout. Falls back to `title` if omitted. */
    pageTitle?: string;
    subtitle: string;
    githubUrl: string;
    /** Chart data, configuration, and loading state. */
    chart?: ResearchDemoChartProps<T>;
    /** View-type selector configuration. */
    view?: ResearchDemoViewProps<T>;
    controls?: Control[];
    onReset?: () => void;
    resetLabel?: string;
    children?: React.ReactNode;
    backUrl?: string;
}

export interface OligopolyConstants {
    defaultFirms: number;
    defaultElasticity: number;
    defaultBasePrice: number;
    maxRounds: number;
    hhiAxisPadding: number;
    options: {
        firms: { value: number; label: string }[];
        elasticity: { value: number; label: string }[];
        price: { value: number; label: string }[];
    };
}

export interface ZSharpDefaults {
    yAxisPadding: number;
    lossPadding: number;
    gapPadding: number;
    convergencePadding: number;
}

export interface ResearchConfig {
    oligopoly: OligopolyConstants;
    zsharp: ZSharpDefaults;
    modelTypes: {
        cournot: string;
    };
}
