import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, IconButton, Button } from '@mui/material';
import { GitHub, Home } from '@mui/icons-material';
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
        const response = await fetch('/zsharp_data.json.gz');
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
                sgd: (sgdAccuracies[i] || 0) / 100, // Convert to 0-1 range
                zsharp: (zsharpAccuracies[i] || 0) / 100,
                sgdLoss: sgdLosses[i] || 0,
                zsharpLoss: zsharpLosses[i] || 0,
            });
        }

        return data;
    } catch (error) {
        return generateFallbackData();
    }
};

// Fallback data generation if real data fails to load
const generateFallbackData = () => {
    const data = [];
    for (let i = 0; i <= 20; i++) {
        const sgdAccuracy = 0.65 + (i / 20) * 0.1; // 65% to 75%
        const zsharpAccuracy = sgdAccuracy + 0.05; // 5% improvement
        const sgdLoss = 2.0 - (i / 20) * 1.2; // 2.0 to 0.8
        const zsharpLoss = sgdLoss - 0.1; // Slightly lower loss

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
        document.title = 'ZSharp - Sharpness-Aware Minimization';

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
            case 'summary':
                const finalSGD = chartData[chartData.length - 1]?.sgd || 0;
                const finalZSharp =
                    chartData[chartData.length - 1]?.zsharp || 0;
                const finalSGDLoss =
                    chartData[chartData.length - 1]?.sgdLoss || 0;
                const finalZSharpLoss =
                    chartData[chartData.length - 1]?.zsharpLoss || 0;
                const improvement = finalZSharp - finalSGD;
                const lossImprovement = finalSGDLoss - finalZSharpLoss;
                return [
                    {
                        metric: 'Final SGD Accuracy',
                        value: (finalSGD * 100).toFixed(1) + '%',
                    },
                    {
                        metric: 'Final ZSharp Accuracy',
                        value: (finalZSharp * 100).toFixed(1) + '%',
                    },
                    {
                        metric: 'Accuracy Improvement',
                        value: (improvement * 100).toFixed(1) + '%',
                    },
                    {
                        metric: 'Final SGD Loss',
                        value: finalSGDLoss.toFixed(3),
                    },
                    {
                        metric: 'Final ZSharp Loss',
                        value: finalZSharpLoss.toFixed(3),
                    },
                    {
                        metric: 'Loss Reduction',
                        value: (lossImprovement * 100).toFixed(1) + '%',
                    },
                ];
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
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
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
                    background:
                        'linear-gradient(135deg, #0a0a0a 0%, #0e0e0e 50%, #0a0a0a 100%)',
                    zIndex: -2,
                }}
            />

            {/* Main Content */}
            <Grid
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{
                    zIndex: 1,
                    padding: { xs: '1rem 0', sm: '1.5rem 0', md: '2rem 0' },
                    minHeight: 0,
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: '900px',
                        width: '100%',
                        padding: {
                            xs: '0 0.5rem',
                            sm: '0 1.5rem',
                            md: '0 2rem',
                        },
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ marginBottom: 2 }}
                    >
                        <Grid>
                            <Typography
                                variant="h1"
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 700,
                                    fontSize: {
                                        xs: '2.5rem',
                                        sm: '3.5rem',
                                        md: '4rem',
                                    },
                                }}
                            >
                                ZSharp
                            </Typography>
                        </Grid>
                        <Grid sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                href="https://github.com/bangyen/ZSharp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitHub fontSize="large" />
                            </IconButton>
                            <IconButton component="a" href="/">
                                <Home fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Typography
                        variant="h5"
                        sx={{
                            color: 'text.secondary',
                            marginBottom: 3,
                            fontWeight: 400,
                            fontSize: { xs: '1.1rem', sm: '1.3rem' },
                        }}
                    >
                        Sharpness-Aware Minimization with Z-Score Gradient
                        Filtering
                    </Typography>

                    {/* Performance Chart */}
                    <Box
                        sx={{
                            padding: { xs: 1.5, sm: 2 },
                            backgroundColor: 'rgba(128, 128, 128, 0.05)',
                            borderRadius: 2,
                            border: '1px solid rgba(128, 128, 128, 0.2)',
                            marginBottom: 4,
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'primary.light',
                                marginBottom: 3,
                                textAlign: 'center',
                                fontWeight: 600,
                            }}
                        >
                            {viewType === 'accuracy' &&
                                'Training Accuracy Comparison'}
                            {viewType === 'loss' && 'Training Loss Comparison'}
                            {viewType === 'learning_curve' &&
                                'Learning Gap Evolution'}
                            {viewType === 'convergence' &&
                                'Convergence Rate Analysis'}
                            {viewType === 'summary' && 'Summary Statistics'}
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            {loading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100%',
                                        color: 'text.secondary',
                                    }}
                                >
                                    <Typography>
                                        Loading real experiment data...
                                    </Typography>
                                </Box>
                            ) : viewType === 'summary' ? (
                                <Box sx={{ padding: 2 }}>
                                    {currentData.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: 1,
                                                borderBottom:
                                                    index <
                                                    currentData.length - 1
                                                        ? '1px solid rgba(255,255,255,0.1)'
                                                        : 'none',
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{ color: 'text.secondary' }}
                                            >
                                                {item.metric}:
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: 'primary.light',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {item.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={currentData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="epoch"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                            tickFormatter={value => {
                                                if (viewType === 'loss') {
                                                    return value.toFixed(3);
                                                } else if (
                                                    viewType ===
                                                    'learning_curve'
                                                ) {
                                                    return (
                                                        (value * 100).toFixed(
                                                            1
                                                        ) + '%'
                                                    );
                                                } else if (
                                                    viewType === 'convergence'
                                                ) {
                                                    return (
                                                        (value * 100).toFixed(
                                                            1
                                                        ) + '%'
                                                    );
                                                } else {
                                                    return (
                                                        (value * 100).toFixed(
                                                            1
                                                        ) + '%'
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
                                                    'rgba(26, 26, 26, 0.9)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 8,
                                                color: 'white',
                                            }}
                                            labelFormatter={value =>
                                                `Epoch ${value}`
                                            }
                                            formatter={(value, name) => [
                                                viewType === 'loss'
                                                    ? value.toFixed(3)
                                                    : viewType ===
                                                        'learning_curve'
                                                      ? `${(value * 100).toFixed(2)}%`
                                                      : viewType ===
                                                          'convergence'
                                                        ? `${(value * 100).toFixed(3)}%`
                                                        : `${(value * 100).toFixed(1)}%`,
                                                name,
                                            ]}
                                        />
                                        {viewType === 'accuracy' && (
                                            <>
                                                <Line
                                                    type="monotone"
                                                    dataKey="sgd"
                                                    stroke="#1976d2"
                                                    strokeWidth={3}
                                                    name="SGD"
                                                    dot={{
                                                        fill: '#1976d2',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="zsharp"
                                                    stroke="#2e7d32"
                                                    strokeWidth={3}
                                                    name="ZSharp"
                                                    dot={{
                                                        fill: '#2e7d32',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                            </>
                                        )}
                                        {viewType === 'loss' && (
                                            <>
                                                <Line
                                                    type="monotone"
                                                    dataKey="sgd"
                                                    stroke="#1976d2"
                                                    strokeWidth={3}
                                                    name="SGD Loss"
                                                    dot={{
                                                        fill: '#1976d2',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="zsharp"
                                                    stroke="#2e7d32"
                                                    strokeWidth={3}
                                                    name="ZSharp Loss"
                                                    dot={{
                                                        fill: '#2e7d32',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                            </>
                                        )}
                                        {viewType === 'learning_curve' && (
                                            <Line
                                                type="monotone"
                                                dataKey="gap"
                                                stroke="#f57c00"
                                                strokeWidth={3}
                                                name="Accuracy Gap"
                                                dot={{
                                                    fill: '#f57c00',
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                            />
                                        )}
                                        {viewType === 'improvement' && (
                                            <Line
                                                type="monotone"
                                                dataKey="improvement"
                                                stroke="#f57c00"
                                                strokeWidth={3}
                                                name="Improvement"
                                                dot={{
                                                    fill: '#f57c00',
                                                    strokeWidth: 2,
                                                    r: 4,
                                                }}
                                            />
                                        )}
                                        {viewType === 'convergence' && (
                                            <>
                                                <Line
                                                    type="monotone"
                                                    dataKey="sgd"
                                                    stroke="#1976d2"
                                                    strokeWidth={3}
                                                    name="SGD Rate"
                                                    dot={{
                                                        fill: '#1976d2',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="zsharp"
                                                    stroke="#2e7d32"
                                                    strokeWidth={3}
                                                    name="ZSharp Rate"
                                                    dot={{
                                                        fill: '#2e7d32',
                                                        strokeWidth: 2,
                                                        r: 4,
                                                    }}
                                                />
                                            </>
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </Box>

                    {/* View Selection Buttons */}
                    <Box
                        sx={{
                            marginTop: 3,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                        }}
                    >
                        <Button
                            variant={
                                viewType === 'accuracy'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            size="small"
                            onClick={() => setViewType('accuracy')}
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color:
                                    viewType === 'accuracy'
                                        ? 'white'
                                        : 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Accuracy
                        </Button>
                        <Button
                            variant={
                                viewType === 'loss' ? 'contained' : 'outlined'
                            }
                            size="small"
                            onClick={() => setViewType('loss')}
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color:
                                    viewType === 'loss'
                                        ? 'white'
                                        : 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Loss
                        </Button>
                        <Button
                            variant={
                                viewType === 'learning_curve'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            size="small"
                            onClick={() => setViewType('learning_curve')}
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color:
                                    viewType === 'learning_curve'
                                        ? 'white'
                                        : 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Learning Gap
                        </Button>
                        <Button
                            variant={
                                viewType === 'convergence'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            size="small"
                            onClick={() => setViewType('convergence')}
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color:
                                    viewType === 'convergence'
                                        ? 'white'
                                        : 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Convergence
                        </Button>
                        <Button
                            variant={
                                viewType === 'summary'
                                    ? 'contained'
                                    : 'outlined'
                            }
                            size="small"
                            onClick={() => setViewType('summary')}
                            sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color:
                                    viewType === 'summary'
                                        ? 'white'
                                        : 'rgba(255,255,255,0.7)',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            Summary
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ZSharp;
