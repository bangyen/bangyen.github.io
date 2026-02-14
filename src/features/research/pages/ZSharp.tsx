import React, { useState } from 'react';

import { ResearchDemo } from '../components';
import { PERCENTAGE, RESEARCH_CONSTANTS } from '../config';
import { useResearchData } from '../hooks';
import type { ChartConfig, ViewType } from '../types';
import {
    buildAxisDomain,
    buildTooltipLabelFormatter,
    fetchGzippedJson,
} from '../utils';

import {
    BarChartRounded,
    TrendingUpRounded,
    ShowChartRounded,
    AnalyticsRounded,
} from '@/components/icons';
import { URLS, PAGE_TITLES } from '@/config/constants';
import { COLORS } from '@/config/theme';

interface DataPoint {
    epoch: number;
    sgd: number;
    zsharp: number;
    sgdLoss: number;
    zsharpLoss: number;
}

interface ProcessedDataPoint {
    epoch: number;
    sgd?: number;
    zsharp?: number;
    gap?: number;
}

interface RealData {
    'SGD Baseline'?: {
        train_accuracies?: number[];
        train_losses?: number[];
    };
    ZSharp?: {
        train_accuracies?: number[];
        train_losses?: number[];
    };
}

const loadRealZSharpData = async (): Promise<DataPoint[]> => {
    const realData = await fetchGzippedJson<RealData>('/zsharp_data.json.gz');

    const data: DataPoint[] = [];
    const sgdAccuracies = realData['SGD Baseline']?.train_accuracies ?? [];
    const zsharpAccuracies = realData.ZSharp?.train_accuracies ?? [];
    const sgdLosses = realData['SGD Baseline']?.train_losses ?? [];
    const zsharpLosses = realData.ZSharp?.train_losses ?? [];

    const maxEpochs = Math.max(sgdAccuracies.length, zsharpAccuracies.length);

    for (let i = 0; i < maxEpochs; i++) {
        data.push({
            epoch: i + 1,
            sgd: (sgdAccuracies[i] ?? 0) / PERCENTAGE.divisor,
            zsharp: (zsharpAccuracies[i] ?? 0) / PERCENTAGE.divisor,
            sgdLoss: sgdLosses[i] ?? 0,
            zsharpLoss: zsharpLosses[i] ?? 0,
        });
    }

    return data;
};

const ZSharp: React.FC = () => {
    const { data: chartData, loading } = useResearchData(
        PAGE_TITLES.zsharp,
        loadRealZSharpData,
        () => [] as DataPoint[],
    );
    const [viewType, setViewType] = useState<string>('accuracy');

    const pctFormatter = (decimals: number) => (value: number) =>
        `${(value * PERCENTAGE.multiplier).toFixed(decimals)}%`;

    const pctTooltip =
        (decimals: number) =>
        (value: number, name: string): [string, string] => [
            pctFormatter(decimals)(value),
            name,
        ];

    const baseChart: Pick<
        ChartConfig,
        'type' | 'xAxisKey' | 'tooltipLabelFormatter'
    > = {
        type: 'line',
        xAxisKey: 'epoch',
        tooltipLabelFormatter: buildTooltipLabelFormatter('Epoch'),
    };

    const sgdZsharpLines = (sgdName: string, zsharpName: string) => [
        { dataKey: 'sgd', name: sgdName, color: COLORS.primary.main },
        { dataKey: 'zsharp', name: zsharpName, color: COLORS.data.green },
    ];

    const viewTypes: ViewType<DataPoint>[] = [
        {
            key: 'accuracy',
            label: 'Accuracy',
            icon: BarChartRounded,
            chartTitle: 'Performance Comparison',
            dataProcessor: (data: DataPoint[]) => data,
            chartConfig: {
                ...baseChart,
                yAxisFormatter: pctFormatter(1),
                yAxisDomain: buildAxisDomain(
                    RESEARCH_CONSTANTS.zsharp.yAxisPadding,
                ),
                tooltipFormatter: pctTooltip(1),
                lines: sgdZsharpLines('SGD', 'ZSharp'),
            },
        },
        {
            key: 'loss',
            label: 'Loss',
            icon: TrendingUpRounded,
            chartTitle: 'Loss Evaluation',
            dataProcessor: (data: DataPoint[]) =>
                data.map(
                    (point): ProcessedDataPoint => ({
                        epoch: point.epoch,
                        sgd: point.sgdLoss,
                        zsharp: point.zsharpLoss,
                    }),
                ),
            chartConfig: {
                ...baseChart,
                yAxisFormatter: (value: number) => value.toFixed(3),
                yAxisDomain: buildAxisDomain(
                    RESEARCH_CONSTANTS.zsharp.lossPadding,
                ),
                tooltipFormatter: (value: number, name: string) => [
                    value.toFixed(3),
                    name,
                ],
                lines: sgdZsharpLines('SGD Loss', 'ZSharp Loss'),
            },
        },
        {
            key: 'learning_curve',
            label: 'Learning',
            icon: ShowChartRounded,
            chartTitle: 'Learning Progress',
            dataProcessor: (data: DataPoint[]) =>
                data.map(
                    (point): ProcessedDataPoint => ({
                        epoch: point.epoch,
                        gap: point.zsharp - point.sgd,
                    }),
                ),
            chartConfig: {
                ...baseChart,
                yAxisFormatter: pctFormatter(1),
                yAxisDomain: buildAxisDomain(
                    RESEARCH_CONSTANTS.zsharp.gapPadding,
                ),
                tooltipFormatter: pctTooltip(2),
                lines: [
                    {
                        dataKey: 'gap',
                        name: 'Accuracy Gap',
                        color: COLORS.data.amber,
                    },
                ],
            },
        },
        {
            key: 'convergence',
            label: 'Convergence',
            icon: AnalyticsRounded,
            chartTitle: 'Convergence Analysis',
            dataProcessor: (data: DataPoint[]) =>
                data.map((point, index): ProcessedDataPoint => {
                    if (index === 0)
                        return { epoch: point.epoch, sgd: 0, zsharp: 0 };
                    const prevPoint = data[index - 1];
                    if (!prevPoint) {
                        return { epoch: point.epoch, sgd: 0, zsharp: 0 };
                    }
                    return {
                        epoch: point.epoch,
                        sgd: point.sgd - prevPoint.sgd,
                        zsharp: point.zsharp - prevPoint.zsharp,
                    };
                }),
            chartConfig: {
                ...baseChart,
                yAxisFormatter: pctFormatter(1),
                yAxisDomain: buildAxisDomain(
                    RESEARCH_CONSTANTS.zsharp.convergencePadding,
                ),
                tooltipFormatter: pctTooltip(3),
                lines: sgdZsharpLines('SGD Rate', 'ZSharp Rate'),
            },
        },
    ];

    return (
        <ResearchDemo
            title="ZSharp"
            subtitle="Neural Network Optimization Research"
            githubUrl={URLS.zsharpRepo}
            chartData={chartData}
            viewTypes={viewTypes}
            currentViewType={viewType}
            onViewTypeChange={setViewType}
            loading={loading}
            loadingMessage="Loading real experiment data..."
        />
    );
};

export default ZSharp;
