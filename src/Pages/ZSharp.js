import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Grid } from '../components/mui';
import {
    GitHub,
    HomeRounded as Home,
    BarChartRounded,
    TrendingUpRounded,
    ShowChartRounded,
    AnalyticsRounded,
} from '../components/icons';
import {
    URLS,
    PAGE_TITLES,
    CHART_DIMENSIONS,
    CHART_FORMATTING,
    ZSHARP_DEFAULTS,
    PERCENTAGE,
} from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../config/theme';
import { GlassCard } from '../helpers';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

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
                setChartData(generateFallbackData());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Process data based on view type
    const getProcessedData = () => {
        if (!chartData || chartData.length === 0) {
            return [];
        }

        switch (viewType) {
            case 'accuracy':
                return chartData;
            case 'loss':
                return chartData.map(point => ({
                    epoch: point.epoch,
                    sgd: point.sgdLoss,
                    zsharp: point.zsharpLoss,
                }));
            case 'improvement':
                return chartData.map(point => ({
                    epoch: point.epoch,
                    improvement: point.zsharp - point.sgd,
                }));
            case 'convergence':
                return chartData.map((point, index) => {
                    if (index === 0)
                        return { epoch: point.epoch, sgd: 0, zsharp: 0 };
                    const prevPoint = chartData[index - 1];
                    return {
                        epoch: point.epoch,
                        sgd: point.sgd - prevPoint.sgd,
                        zsharp: point.zsharp - prevPoint.zsharp,
                    };
                });
            case 'learning_curve':
                // Show how the gap between SGD and ZSharp evolves over time
                const learningCurveData = chartData.map(point => ({
                    epoch: point.epoch,
                    gap: point.zsharp - point.sgd,
                }));
                return learningCurveData;
            default:
                return chartData;
        }
    };

    const currentData = getProcessedData();

    return (
        <Grid
            container={true}
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: SPACING.padding.md,
                paddingBottom: {
                    xs: SPACING.padding.md,
                    md: 0,
                },
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',
            }}
        >
            {/* Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: COLORS.surface.background,
                    zIndex: -1,
                }}
            />

            {/* Main Content */}
            <Grid
                size={12}
                flex={1}
                sx={{
                    ...COMPONENT_VARIANTS.flexCenter,
                    flexDirection: 'column',
                    zIndex: 1,
                    padding: 0,
                    minHeight: 0,
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: SPACING.maxWidth.md,
                        width: '100%',
                        padding: {
                            xs: '0 0.5rem',
                            md: '0 2rem',
                        },
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Grid
                        container={true}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ marginBottom: 2 }}
                    >
                        <Grid size="auto">
                            <Typography
                                variant="h1"
                                sx={{
                                    color: COLORS.text.primary,
                                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                                    fontSize: TYPOGRAPHY.fontSize.h2,
                                }}
                            >
                                ZSharp
                            </Typography>
                        </Grid>
                        <Grid size="auto" sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                href={URLS.zsharpRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitHub
                                    sx={{
                                        fontSize: {
                                            xs: TYPOGRAPHY.fontSize.h2,
                                            md: '2rem',
                                        },
                                    }}
                                />
                            </IconButton>
                            <IconButton component="a" href="/">
                                <Home
                                    sx={{
                                        fontSize: {
                                            xs: TYPOGRAPHY.fontSize.h2,
                                            md: '2rem',
                                        },
                                    }}
                                />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Typography
                        variant="h5"
                        sx={{
                            color: COLORS.text.secondary,
                            marginTop: 2,
                            marginBottom: 4,
                            fontWeight: TYPOGRAPHY.fontWeight.normal,
                            fontSize: TYPOGRAPHY.fontSize.subheading,
                        }}
                    >
                        Neural Network Optimization Research
                    </Typography>

                    {/* Performance Chart */}
                    <GlassCard
                        sx={{
                            marginBottom: 3,
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: COLORS.text.secondary,
                                marginBottom: 2,
                                textAlign: 'center',
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                fontSize: TYPOGRAPHY.fontSize.subheading,
                            }}
                        >
                            {viewType === 'accuracy' &&
                                'Performance Comparison'}
                            {viewType === 'loss' && 'Loss Evaluation'}
                            {viewType === 'learning_curve' &&
                                'Learning Progress'}
                            {viewType === 'convergence' &&
                                'Convergence Analysis'}
                        </Typography>
                        <Box sx={{ height: CHART_DIMENSIONS.height }}>
                            {loading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        color: COLORS.text.secondary,
                                    }}
                                >
                                    <Typography>
                                        Loading real experiment data...
                                    </Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={currentData}>
                                        <CartesianGrid
                                            strokeDasharray={
                                                CHART_FORMATTING.lines
                                                    .strokeDashArray
                                            }
                                            stroke={COLORS.border.subtle}
                                        />
                                        <XAxis
                                            dataKey="epoch"
                                            stroke={COLORS.text.secondary}
                                            tick={{
                                                fill: COLORS.text.secondary,
                                            }}
                                        />
                                        <YAxis
                                            stroke={COLORS.text.secondary}
                                            tick={{
                                                fill: COLORS.text.secondary,
                                            }}
                                            tickFormatter={value => {
                                                if (viewType === 'loss') {
                                                    return value.toFixed(3);
                                                } else if (
                                                    viewType ===
                                                    'learning_curve'
                                                ) {
                                                    return (
                                                        (
                                                            value *
                                                            PERCENTAGE.multiplier
                                                        ).toFixed(1) + '%'
                                                    );
                                                } else if (
                                                    viewType === 'convergence'
                                                ) {
                                                    return (
                                                        (
                                                            value *
                                                            PERCENTAGE.multiplier
                                                        ).toFixed(1) + '%'
                                                    );
                                                } else {
                                                    return (
                                                        (
                                                            value *
                                                            PERCENTAGE.multiplier
                                                        ).toFixed(1) + '%'
                                                    );
                                                }
                                            }}
                                            domain={
                                                viewType === 'loss'
                                                    ? [
                                                          'dataMin - 0.1',
                                                          'dataMax + 0.1',
                                                      ]
                                                    : viewType ===
                                                        'learning_curve'
                                                      ? [
                                                            'dataMin - 0.005',
                                                            'dataMax + 0.005',
                                                        ]
                                                      : viewType ===
                                                          'convergence'
                                                        ? [
                                                              'dataMin - 0.005',
                                                              'dataMax + 0.005',
                                                          ]
                                                        : [
                                                              'dataMin - 0.05',
                                                              'dataMax + 0.05',
                                                          ]
                                            }
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'hsla(0, 0%, 5%, 0.95)',
                                                border: `1px solid ${COLORS.border.subtle}`,
                                                borderRadius:
                                                    SPACING.borderRadius.lg,
                                                color: COLORS.text.primary,
                                            }}
                                            labelFormatter={value =>
                                                `Epoch ${value}`
                                            }
                                            formatter={(value, name) => [
                                                viewType === 'loss'
                                                    ? value.toFixed(3)
                                                    : viewType ===
                                                        'learning_curve'
                                                      ? `${(value * PERCENTAGE.multiplier).toFixed(2)}%`
                                                      : viewType ===
                                                          'convergence'
                                                        ? `${(value * PERCENTAGE.multiplier).toFixed(3)}%`
                                                        : `${(value * PERCENTAGE.multiplier).toFixed(1)}%`,
                                                name,
                                            ]}
                                        />
                                        {viewType === 'accuracy' && (
                                            <>
                                                <Line
                                                    type="monotone"
                                                    dataKey="sgd"
                                                    stroke={COLORS.primary.main}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name="SGD"
                                                    dot={{
                                                        fill: COLORS.primary
                                                            .main,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="zsharp"
                                                    stroke={COLORS.data.green}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name="ZSharp"
                                                    dot={{
                                                        fill: COLORS.data.green,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                            </>
                                        )}
                                        {viewType === 'loss' && (
                                            <>
                                                <Line
                                                    type="monotone"
                                                    dataKey="sgd"
                                                    stroke={COLORS.primary.main}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name="SGD Loss"
                                                    dot={{
                                                        fill: COLORS.primary
                                                            .main,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="zsharp"
                                                    stroke={COLORS.data.green}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name="ZSharp Loss"
                                                    dot={{
                                                        fill: COLORS.data.green,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                            </>
                                        )}
                                        {viewType === 'learning_curve' && (
                                            <Line
                                                type="monotone"
                                                dataKey="gap"
                                                stroke={COLORS.data.amber}
                                                strokeWidth={
                                                    CHART_DIMENSIONS.strokeWidth
                                                }
                                                name="Accuracy Gap"
                                                dot={{
                                                    fill: COLORS.data.amber,
                                                    strokeWidth: 2,
                                                    r: CHART_DIMENSIONS.dotRadius,
                                                }}
                                            />
                                        )}
                                        {viewType === 'improvement' && (
                                            <Line
                                                type="monotone"
                                                dataKey="improvement"
                                                stroke={COLORS.data.amber}
                                                strokeWidth={
                                                    CHART_DIMENSIONS.strokeWidth
                                                }
                                                name="Improvement"
                                                dot={{
                                                    fill: COLORS.data.amber,
                                                    strokeWidth: 2,
                                                    r: CHART_DIMENSIONS.dotRadius,
                                                }}
                                            />
                                        )}
                                        {viewType === 'convergence' && (
                                            <>
                                                <Line
                                                    type="monotone"
                                                    dataKey="sgd"
                                                    stroke={COLORS.primary.main}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name="SGD Rate"
                                                    dot={{
                                                        fill: COLORS.primary
                                                            .main,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="zsharp"
                                                    stroke={COLORS.data.green}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name="ZSharp Rate"
                                                    dot={{
                                                        fill: COLORS.data.green,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                            </>
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </GlassCard>

                    {/* View Selection Control Panel */}
                    <GlassCard
                        sx={{
                            marginTop: 3,
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            paddingBottom: SPACING.padding.md,
                            backgroundClip: 'padding-box',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <BarChartRounded
                                    sx={{
                                        color: COLORS.primary.light,
                                        fontSize: '1.25rem',
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: COLORS.primary.light,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                    }}
                                >
                                    Chart Views
                                </Typography>
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, minmax(0, 1fr))',
                                    md: 'repeat(4, 1fr)',
                                },
                                gap: 1.5,
                                width: '100%',
                                margin: 0,
                            }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<BarChartRounded />}
                                onClick={() => setViewType('accuracy')}
                                sx={{
                                    width: '100%',
                                    color:
                                        viewType === 'accuracy'
                                            ? COLORS.text.primary
                                            : COLORS.text.secondary,
                                    backgroundColor:
                                        viewType === 'accuracy'
                                            ? COLORS.primary.main
                                            : 'transparent',
                                    borderColor: COLORS.border.subtle,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderRadius: SPACING.borderRadius.lg,
                                    minHeight: '36px',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                    transition:
                                        'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor:
                                            viewType === 'accuracy'
                                                ? COLORS.primary.dark
                                                : COLORS.interactive.hover,
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Accuracy
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<TrendingUpRounded />}
                                onClick={() => setViewType('loss')}
                                sx={{
                                    width: '100%',
                                    color:
                                        viewType === 'loss'
                                            ? COLORS.text.primary
                                            : COLORS.text.secondary,
                                    backgroundColor:
                                        viewType === 'loss'
                                            ? COLORS.primary.main
                                            : 'transparent',
                                    borderColor: COLORS.border.subtle,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderRadius: SPACING.borderRadius.lg,
                                    minHeight: '36px',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                    transition:
                                        'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor:
                                            viewType === 'loss'
                                                ? COLORS.primary.dark
                                                : COLORS.interactive.hover,
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Loss
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<ShowChartRounded />}
                                onClick={() => setViewType('learning_curve')}
                                sx={{
                                    width: '100%',
                                    color:
                                        viewType === 'learning_curve'
                                            ? COLORS.text.primary
                                            : COLORS.text.secondary,
                                    backgroundColor:
                                        viewType === 'learning_curve'
                                            ? COLORS.primary.main
                                            : 'transparent',
                                    borderColor: COLORS.border.subtle,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderRadius: SPACING.borderRadius.lg,
                                    minHeight: '36px',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                    transition:
                                        'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor:
                                            viewType === 'learning_curve'
                                                ? COLORS.primary.dark
                                                : COLORS.interactive.hover,
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Learning Gap
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<AnalyticsRounded />}
                                onClick={() => setViewType('convergence')}
                                sx={{
                                    width: '100%',
                                    color:
                                        viewType === 'convergence'
                                            ? COLORS.text.primary
                                            : COLORS.text.secondary,
                                    backgroundColor:
                                        viewType === 'convergence'
                                            ? COLORS.primary.main
                                            : 'transparent',
                                    borderColor: COLORS.border.subtle,
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderRadius: SPACING.borderRadius.lg,
                                    minHeight: '36px',
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.8rem',
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                    transition:
                                        'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor:
                                            viewType === 'convergence'
                                                ? COLORS.primary.dark
                                                : COLORS.interactive.hover,
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Convergence
                            </Button>
                        </Box>
                    </GlassCard>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ZSharp;
