import React, { useState, useEffect } from 'react';
import {
    BarChartRounded,
    TrendingUpRounded,
    ShowChartRounded,
    AnalyticsRounded,
} from '../../../components/icons';
import { URLS, PAGE_TITLES } from '../../../config/constants';
import { RESEARCH_CONSTANTS, PERCENTAGE } from '../config/researchConfig';
import { COLORS } from '../../../config/theme';
import ResearchDemo, { ViewType } from '../ResearchDemo';

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
    try {
        if (typeof DecompressionStream === 'undefined') {
            throw new Error('DecompressionStream not supported');
        }

        const response = await fetch('/zsharp_data.json.gz');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const compressedData = await response.arrayBuffer();
        const decompressedData = await new Response(
            new ReadableStream({
                start(controller) {
                    const decompressionStream = new DecompressionStream('gzip');
                    const writer = decompressionStream.writable.getWriter();
                    const reader = decompressionStream.readable.getReader();

                    writer.write(compressedData).then(() => writer.close());

                    function pump(): Promise<void> {
                        return reader
                            .read()
                            .then(
                                ({
                                    done,
                                    value,
                                }: {
                                    done: boolean;
                                    value: Uint8Array | undefined;
                                }) => {
                                    if (done) {
                                        controller.close();
                                        return;
                                    }
                                    controller.enqueue(value);
                                    return pump();
                                }
                            );
                    }
                    return pump();
                },
            })
        ).text();
        const realData: RealData = JSON.parse(decompressedData);

        const data: DataPoint[] = [];
        const sgdAccuracies = realData['SGD Baseline']?.train_accuracies || [];
        const zsharpAccuracies = realData['ZSharp']?.train_accuracies || [];
        const sgdLosses = realData['SGD Baseline']?.train_losses || [];
        const zsharpLosses = realData['ZSharp']?.train_losses || [];

        const maxEpochs = Math.max(
            sgdAccuracies.length,
            zsharpAccuracies.length
        );

        for (let i = 0; i < maxEpochs; i++) {
            data.push({
                epoch: i + 1,
                sgd: (sgdAccuracies[i] || 0) / PERCENTAGE.divisor,
                zsharp: (zsharpAccuracies[i] || 0) / PERCENTAGE.divisor,
                sgdLoss: sgdLosses[i] || 0,
                zsharpLoss: zsharpLosses[i] || 0,
            });
        }

        return data;
    } catch (error) {
        return generateFallbackData();
    }
};

const generateFallbackData = (): DataPoint[] => {
    const data: DataPoint[] = [];
    for (let i = 0; i <= RESEARCH_CONSTANTS.zsharp.maxEpochs; i++) {
        const sgdAccuracy =
            RESEARCH_CONSTANTS.zsharp.baseAccuracy +
            (i / RESEARCH_CONSTANTS.zsharp.maxEpochs) *
                (RESEARCH_CONSTANTS.zsharp.maxAccuracy -
                    RESEARCH_CONSTANTS.zsharp.baseAccuracy);
        const zsharpAccuracy =
            sgdAccuracy + RESEARCH_CONSTANTS.zsharp.improvement;
        const sgdLoss =
            RESEARCH_CONSTANTS.zsharp.baseLoss -
            (i / RESEARCH_CONSTANTS.zsharp.maxEpochs) *
                (RESEARCH_CONSTANTS.zsharp.baseLoss -
                    RESEARCH_CONSTANTS.zsharp.minLoss);
        const zsharpLoss = sgdLoss - RESEARCH_CONSTANTS.zsharp.lossReduction;

        data.push({
            epoch: i + 1,
            sgd: sgdAccuracy,
            zsharp: zsharpAccuracy,
            sgdLoss: sgdLoss,
            zsharpLoss: zsharpLoss,
        });
    }
    return data;
};

const ZSharp: React.FC = () => {
    const [chartData, setChartData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState<string>('accuracy');

    useEffect(() => {
        document.title = PAGE_TITLES.zsharp;

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadRealZSharpData();
                setChartData(data);
            } catch (error) {
                // Error loading data, use fallback
                setChartData(generateFallbackData());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const viewTypes: ViewType<DataPoint>[] = [
        {
            key: 'accuracy',
            label: 'Accuracy',
            icon: BarChartRounded,
            chartTitle: 'Performance Comparison',
            dataProcessor: (data: DataPoint[]) => data,
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: (value: number) =>
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                yAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
                tooltipLabelFormatter: (value: number) => `Epoch ${value}`,
                tooltipFormatter: (value: number, name: string) => [
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                    name,
                ],
                lines: [
                    { dataKey: 'sgd', name: 'SGD', color: COLORS.primary.main },
                    {
                        dataKey: 'zsharp',
                        name: 'ZSharp',
                        color: COLORS.data.green,
                    },
                ],
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
                    })
                ),
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: (value: number) => value.toFixed(3),
                yAxisDomain: ['dataMin - 0.1', 'dataMax + 0.1'],
                tooltipLabelFormatter: (value: number) => `Epoch ${value}`,
                tooltipFormatter: (value: number, name: string) => [
                    value.toFixed(3),
                    name,
                ],
                lines: [
                    {
                        dataKey: 'sgd',
                        name: 'SGD Loss',
                        color: COLORS.primary.main,
                    },
                    {
                        dataKey: 'zsharp',
                        name: 'ZSharp Loss',
                        color: COLORS.data.green,
                    },
                ],
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
                    })
                ),
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: (value: number) =>
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                yAxisDomain: ['dataMin - 0.005', 'dataMax + 0.005'],
                tooltipLabelFormatter: (value: number) => `Epoch ${value}`,
                tooltipFormatter: (value: number, name: string) => [
                    `${(value * PERCENTAGE.multiplier).toFixed(2)}%`,
                    name,
                ],
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
                    return {
                        epoch: point.epoch,
                        sgd: point.sgd - prevPoint.sgd,
                        zsharp: point.zsharp - prevPoint.zsharp,
                    };
                }),
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: (value: number) =>
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                yAxisDomain: ['dataMin - 0.005', 'dataMax + 0.005'],
                tooltipLabelFormatter: (value: number) => `Epoch ${value}`,
                tooltipFormatter: (value: number, name: string) => [
                    `${(value * PERCENTAGE.multiplier).toFixed(3)}%`,
                    name,
                ],
                lines: [
                    {
                        dataKey: 'sgd',
                        name: 'SGD Rate',
                        color: COLORS.primary.main,
                    },
                    {
                        dataKey: 'zsharp',
                        name: 'ZSharp Rate',
                        color: COLORS.data.green,
                    },
                ],
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
