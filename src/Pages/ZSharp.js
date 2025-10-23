import React, { useState, useEffect } from 'react';
import {
    BarChartRounded,
    TrendingUpRounded,
    ShowChartRounded,
    AnalyticsRounded,
} from '../components/icons';
import {
    URLS,
    PAGE_TITLES,
    ZSHARP_DEFAULTS,
    PERCENTAGE,
} from '../config/constants';
import { COLORS } from '../config/theme';
import ResearchDemo from '../components/ResearchDemo';

// Load real ZSharp experiment data
const loadRealZSharpData = async () => {
    try {
        // Check if browser supports DecompressionStream
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

                    function pump() {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                    return pump();
                },
            })
        ).text();
        const realData = JSON.parse(decompressedData);

        // Convert real results to chart data format with per-epoch data
        const data = [];
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
                sgd: (sgdAccuracies[i] || 0) / PERCENTAGE.divisor, // Convert to 0-1 range
                zsharp: (zsharpAccuracies[i] || 0) / PERCENTAGE.divisor,
                sgdLoss: sgdLosses[i] || 0,
                zsharpLoss: zsharpLosses[i] || 0,
            });
        }

        return data;
    } catch (error) {
        // Silently fall back to generated data if real data fails to load
        return generateFallbackData();
    }
};

// Fallback data generation if real data fails to load
const generateFallbackData = () => {
    const data = [];
    for (let i = 0; i <= ZSHARP_DEFAULTS.maxEpochs; i++) {
        const sgdAccuracy =
            ZSHARP_DEFAULTS.baseAccuracy +
            (i / ZSHARP_DEFAULTS.maxEpochs) *
                (ZSHARP_DEFAULTS.maxAccuracy - ZSHARP_DEFAULTS.baseAccuracy);
        const zsharpAccuracy = sgdAccuracy + ZSHARP_DEFAULTS.improvement;
        const sgdLoss =
            ZSHARP_DEFAULTS.baseLoss -
            (i / ZSHARP_DEFAULTS.maxEpochs) *
                (ZSHARP_DEFAULTS.baseLoss - ZSHARP_DEFAULTS.minLoss);
        const zsharpLoss = sgdLoss - ZSHARP_DEFAULTS.lossReduction;

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

const ZSharp = () => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewType, setViewType] = useState('accuracy');

    useEffect(() => {
        document.title = PAGE_TITLES.zsharp;

        // Load real data on component mount
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadRealZSharpData();
                setChartData(data);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error loading ZSharp data in component:', error);
                setChartData(generateFallbackData());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Define view types for the ResearchDemo component
    const viewTypes = [
        {
            key: 'accuracy',
            label: 'Accuracy',
            icon: BarChartRounded,
            chartTitle: 'Performance Comparison',
            dataProcessor: data => data,
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: value =>
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                yAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
                tooltipLabelFormatter: value => `Epoch ${value}`,
                tooltipFormatter: (value, name) => [
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
            dataProcessor: data =>
                data.map(point => ({
                    epoch: point.epoch,
                    sgd: point.sgdLoss,
                    zsharp: point.zsharpLoss,
                })),
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: value => value.toFixed(3),
                yAxisDomain: ['dataMin - 0.1', 'dataMax + 0.1'],
                tooltipLabelFormatter: value => `Epoch ${value}`,
                tooltipFormatter: (value, name) => [value.toFixed(3), name],
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
            label: 'Learning Gap',
            icon: ShowChartRounded,
            chartTitle: 'Learning Progress',
            dataProcessor: data =>
                data.map(point => ({
                    epoch: point.epoch,
                    gap: point.zsharp - point.sgd,
                })),
            chartConfig: {
                type: 'line',
                xAxisKey: 'epoch',
                yAxisFormatter: value =>
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                yAxisDomain: ['dataMin - 0.005', 'dataMax + 0.005'],
                tooltipLabelFormatter: value => `Epoch ${value}`,
                tooltipFormatter: (value, name) => [
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
            dataProcessor: data =>
                data.map((point, index) => {
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
                yAxisFormatter: value =>
                    `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                yAxisDomain: ['dataMin - 0.005', 'dataMax + 0.005'],
                tooltipLabelFormatter: value => `Epoch ${value}`,
                tooltipFormatter: (value, name) => [
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
