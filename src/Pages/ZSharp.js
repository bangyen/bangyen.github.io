import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { TrendingUp, Speed, Psychology } from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

// Static data for demonstration
const trainingData = [
    { epoch: 0, sgd: 0.65, zsharp: 0.65 },
    { epoch: 2, sgd: 0.68, zsharp: 0.71 },
    { epoch: 4, sgd: 0.72, zsharp: 0.78 },
    { epoch: 6, sgd: 0.75, zsharp: 0.82 },
    { epoch: 8, sgd: 0.77, zsharp: 0.85 },
    { epoch: 10, sgd: 0.79, zsharp: 0.87 },
    { epoch: 12, sgd: 0.81, zsharp: 0.89 },
    { epoch: 14, sgd: 0.82, zsharp: 0.91 },
    { epoch: 16, sgd: 0.83, zsharp: 0.92 },
    { epoch: 18, sgd: 0.84, zsharp: 0.93 },
    { epoch: 20, sgd: 0.85, zsharp: 0.94 },
];

const ZSharp = () => {
    useEffect(() => {
        document.title = 'ZSharp - Sharpness-Aware Minimization';
    }, []);

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
                    padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
                    boxSizing: 'border-box',
                    width: '100%',
                    maxWidth: '100vw',
                    overflowX: 'hidden',
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
                        An advanced optimization algorithm that combines SAM
                        with intelligent gradient filtering to achieve better
                        generalization and faster convergence in deep learning.
                    </Typography>
                </Box>

                {/* Performance Comparison */}
                <Card
                    sx={{
                        marginBottom: 4,
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h5"
                            sx={{
                                marginBottom: 3,
                                color: 'primary.light',
                                textAlign: 'center',
                            }}
                        >
                            Training Accuracy Comparison
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trainingData}>
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
                                        domain={[0.6, 1.0]}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor:
                                                'rgba(26, 26, 26, 0.9)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: 8,
                                            color: 'white',
                                        }}
                                        formatter={(value, name) => [
                                            `${(value * 100).toFixed(1)}%`,
                                            name === 'sgd' ? 'SGD' : 'ZSharp',
                                        ]}
                                    />
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
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<TrendingUp />}
                                    label="+5.22% Accuracy"
                                    color="success"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'success.main', mb: 1 }}
                                >
                                    Better Generalization
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    ZSharp consistently outperforms standard
                                    optimizers by finding flatter minima.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<Speed />}
                                    label="4.4× Speedup"
                                    color="info"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'info.main', mb: 1 }}
                                >
                                    Faster Training
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Optimized for Apple Silicon with MPS
                                    acceleration for significant speedup.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<Psychology />}
                                    label="Smart Filtering"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'warning.main', mb: 1 }}
                                >
                                    Intelligent Gradients
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Uses Z-score normalization to focus
                                    optimization on critical parameters.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ZSharp;
