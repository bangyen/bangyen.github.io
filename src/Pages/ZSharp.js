import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    Slider,
    Card,
    CardContent,
    Button,
    Chip,
    Divider,
    LinearProgress,
    Alert,
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    Stop,
    Refresh,
    TrendingUp,
    Speed,
    Psychology,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

// Mock data for simulation
const generateTrainingData = (epochs, optimizerType, baseAccuracy = 0.6) => {
    const data = [];
    const improvement = optimizerType === 'zsharp' ? 0.0522 : 0;

    for (let i = 0; i <= epochs; i++) {
        const base = baseAccuracy + (i / epochs) * (0.2 + improvement);
        const noise = (Math.random() - 0.5) * 0.02;
        data.push({
            epoch: i,
            accuracy: Math.min(0.95, Math.max(0.1, base + noise)),
            loss: Math.max(0.1, 1.2 - (i / epochs) * 0.8 + Math.random() * 0.1),
        });
    }
    return data;
};

const generateGradientData = percentile => {
    const gradients = [];
    for (let i = 0; i < 100; i++) {
        gradients.push({
            layer: `Layer ${i + 1}`,
            original: Math.random() * 2 - 1,
            filtered: Math.random() * 2 - 1,
            zscore: (Math.random() - 0.5) * 4,
        });
    }
    return gradients;
};

const ZSharp = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentEpoch, setCurrentEpoch] = useState(0);
    const [rho, setRho] = useState(0.05);
    const [percentile, setPercentile] = useState(70);
    const [learningRate, setLearningRate] = useState(0.01);
    const [momentum, setMomentum] = useState(0.9);

    const intervalRef = useRef(null);
    const maxEpochs = 20;

    const sgdData = generateTrainingData(maxEpochs, 'sgd');
    const zsharpData = generateTrainingData(maxEpochs, 'zsharp');
    const gradientData = generateGradientData(percentile);

    const currentSgdAccuracy = sgdData[currentEpoch]?.accuracy || 0;
    const currentZSharpAccuracy = zsharpData[currentEpoch]?.accuracy || 0;
    const improvement =
        ((currentZSharpAccuracy - currentSgdAccuracy) / currentSgdAccuracy) *
        100;

    useEffect(() => {
        if (isRunning && currentEpoch < maxEpochs) {
            intervalRef.current = setTimeout(() => {
                setCurrentEpoch(prev => Math.min(prev + 1, maxEpochs));
            }, 500);
        } else if (currentEpoch >= maxEpochs) {
            setIsRunning(false);
        }

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [isRunning, currentEpoch, maxEpochs]);

    const handleStart = () => {
        setIsRunning(true);
        if (currentEpoch >= maxEpochs) {
            setCurrentEpoch(0);
        }
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setCurrentEpoch(0);
    };

    const handleReset = () => {
        setIsRunning(false);
        setCurrentEpoch(0);
    };

    const filteredGradients = gradientData.filter(
        g => Math.abs(g.zscore) >= (100 - percentile) / 25
    );

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background:
                    'linear-gradient(135deg, #0a0a0a 0%, #0e0e0e 50%, #0a0a0a 100%)',
            }}
        >
            <Box
                sx={{
                    color: 'white',
                    padding: { xs: 2, sm: 3, md: 4 },
                    maxWidth: '1400px',
                    margin: '0 auto',
                    width: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            marginBottom: 2,
                            background:
                                'linear-gradient(135deg, #ffffff, #808080)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        ZSharp
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', marginBottom: 1 }}
                    >
                        Sharpness-Aware Minimization with Z-Score Gradient
                        Filtering
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}
                    >
                        Interactive ZSharp optimizer showing gradient filtering,
                        training curves, and performance improvements over
                        standard SGD.
                    </Typography>
                </Box>

                {/* Control Panel */}
                <Card
                    sx={{
                        marginBottom: 4,
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <CardContent>
                        <Grid container spacing={3}>
                            {/* Training Controls */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginBottom: 2,
                                        color: 'primary.light',
                                    }}
                                >
                                    Training Controls
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        marginBottom: 2,
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrow />}
                                        onClick={handleStart}
                                        disabled={isRunning}
                                        sx={{ backgroundColor: 'success.main' }}
                                    >
                                        Start
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Pause />}
                                        onClick={handlePause}
                                        disabled={!isRunning}
                                    >
                                        Pause
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Stop />}
                                        onClick={handleStop}
                                    >
                                        Stop
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Refresh />}
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </Button>
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Epoch: {currentEpoch} / {maxEpochs}
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(currentEpoch / maxEpochs) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Box>
                            </Grid>

                            {/* Parameter Controls */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginBottom: 2,
                                        color: 'primary.light',
                                    }}
                                >
                                    Parameters
                                </Typography>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        SAM Perturbation Radius (ρ): {rho}
                                    </Typography>
                                    <Slider
                                        value={rho}
                                        onChange={(e, value) => setRho(value)}
                                        min={0.01}
                                        max={0.2}
                                        step={0.01}
                                        disabled={isRunning}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Gradient Filtering Percentile:{' '}
                                        {percentile}%
                                    </Typography>
                                    <Slider
                                        value={percentile}
                                        onChange={(e, value) =>
                                            setPercentile(value)
                                        }
                                        min={50}
                                        max={95}
                                        step={5}
                                        disabled={isRunning}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Learning Rate: {learningRate}
                                    </Typography>
                                    <Slider
                                        value={learningRate}
                                        onChange={(e, value) =>
                                            setLearningRate(value)
                                        }
                                        min={0.001}
                                        max={0.1}
                                        step={0.001}
                                        disabled={isRunning}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body2"
                                        sx={{ marginBottom: 1 }}
                                    >
                                        Momentum: {momentum}
                                    </Typography>
                                    <Slider
                                        value={momentum}
                                        onChange={(e, value) =>
                                            setMomentum(value)
                                        }
                                        min={0.5}
                                        max={0.99}
                                        step={0.01}
                                        disabled={isRunning}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'success.main',
                                        fontWeight: 700,
                                    }}
                                >
                                    {(currentZSharpAccuracy * 100).toFixed(1)}%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    ZSharp Accuracy
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'primary.light',
                                        fontWeight: 700,
                                    }}
                                >
                                    {(currentSgdAccuracy * 100).toFixed(1)}%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    SGD Accuracy
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: 'warning.main',
                                        fontWeight: 700,
                                    }}
                                >
                                    +{improvement.toFixed(1)}%
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Improvement
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h4"
                                    sx={{ color: 'info.main', fontWeight: 700 }}
                                >
                                    {filteredGradients.length}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Active Gradients
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Training Curves */}
                <Card
                    sx={{
                        marginBottom: 4,
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ marginBottom: 3, color: 'primary.light' }}
                        >
                            Training Curves Comparison
                        </Typography>

                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={sgdData.slice(0, currentEpoch + 1)}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.1)"
                                    />
                                    <XAxis
                                        dataKey="epoch"
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'rgba(26, 26, 26, 0.9)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 8,
                                            color: 'white',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="accuracy"
                                        stroke="#1976d2"
                                        strokeWidth={3}
                                        name="SGD Accuracy"
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey={data =>
                                            zsharpData[data.epoch]?.accuracy
                                        }
                                        stroke="#2e7d32"
                                        strokeWidth={3}
                                        name="ZSharp Accuracy"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>

                {/* Gradient Filtering Visualization */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginBottom: 3,
                                        color: 'primary.light',
                                    }}
                                >
                                    Gradient Filtering Process
                                </Typography>

                                <Box sx={{ height: 300 }}>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={gradientData.slice(0, 20)}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="rgba(255,255,255,0.1)"
                                            />
                                            <XAxis
                                                dataKey="layer"
                                                stroke="rgba(255,255,255,0.7)"
                                                tick={{
                                                    fill: 'rgba(255,255,255,0.7)',
                                                    fontSize: 10,
                                                }}
                                            />
                                            <YAxis
                                                stroke="rgba(255,255,255,0.7)"
                                                tick={{
                                                    fill: 'rgba(255,255,255,0.7)',
                                                }}
                                            />
                                            <RechartsTooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        'rgba(26, 26, 26, 0.9)',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    borderRadius: 8,
                                                    color: 'white',
                                                }}
                                            />
                                            <Bar
                                                dataKey="original"
                                                fill="#1976d2"
                                                name="Original Gradients"
                                            />
                                            <Bar
                                                dataKey="filtered"
                                                fill="#2e7d32"
                                                name="Filtered Gradients"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>

                                <Alert
                                    severity="info"
                                    sx={{
                                        marginTop: 2,
                                        backgroundColor:
                                            'rgba(25, 118, 210, 0.1)',
                                    }}
                                >
                                    <Typography variant="body2">
                                        ZSharp filters gradients using Z-score
                                        normalization and percentile-based
                                        selection. Only gradients above the{' '}
                                        {percentile}th percentile are used for
                                        optimization.
                                    </Typography>
                                </Alert>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginBottom: 3,
                                        color: 'primary.light',
                                    }}
                                >
                                    Algorithm Overview
                                </Typography>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'success.main',
                                            marginBottom: 1,
                                        }}
                                    >
                                        1. Layer-wise Z-score Normalization
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            marginBottom: 2,
                                        }}
                                    >
                                        Normalize gradients within each layer to
                                        identify important updates.
                                    </Typography>
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'warning.main',
                                            marginBottom: 1,
                                        }}
                                    >
                                        2. Percentile-based Filtering
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            marginBottom: 2,
                                        }}
                                    >
                                        Keep only gradients above the{' '}
                                        {percentile}th percentile threshold.
                                    </Typography>
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'info.main',
                                            marginBottom: 1,
                                        }}
                                    >
                                        3. SAM Perturbation
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            marginBottom: 2,
                                        }}
                                    >
                                        Apply Sharpness-Aware Minimization with
                                        filtered gradients.
                                    </Typography>
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            color: 'secondary.light',
                                            marginBottom: 1,
                                        }}
                                    >
                                        4. Parameter Update
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Update model parameters using the base
                                        optimizer.
                                    </Typography>
                                </Box>

                                <Divider
                                    sx={{
                                        margin: 2,
                                        borderColor: 'rgba(255,255,255,0.1)',
                                    }}
                                />

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Chip
                                        icon={<TrendingUp />}
                                        label="+5.22% Accuracy"
                                        color="success"
                                        variant="outlined"
                                    />
                                    <Chip
                                        icon={<Speed />}
                                        label="4.4× Speedup"
                                        color="info"
                                        variant="outlined"
                                    />
                                    <Chip
                                        icon={<Psychology />}
                                        label="Apple Silicon"
                                        color="warning"
                                        variant="outlined"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ZSharp;
