import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Slider,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { GitHub, Refresh } from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

// Generate data based on parameters
const generateData = (samRadius, learningRate, momentum, gradientFiltering) => {
    const data = [];
    const baseImprovement = gradientFiltering ? 0.0522 : 0.03;

    // Learning rate affects convergence speed and final accuracy
    const lrEffect = learningRate * 0.3; // More significant impact
    const momentumEffect = momentum * 0.15; // Momentum affects stability and convergence

    for (let i = 0; i <= 20; i++) {
        // SGD baseline with momentum effect
        const sgdAccuracy = 0.65 + (i / 20) * 0.2 + (momentum - 0.9) * 0.1;

        // ZSharp with all parameter effects
        const zsharpAccuracy =
            sgdAccuracy +
            baseImprovement +
            samRadius * 0.1 +
            lrEffect +
            momentumEffect;

        data.push({
            epoch: i,
            sgd: Math.min(0.95, sgdAccuracy),
            zsharp: Math.min(0.95, zsharpAccuracy),
        });
    }
    return data;
};

const ZSharp = () => {
    const [samRadius, setSamRadius] = useState(0.05);
    const [learningRate, setLearningRate] = useState(0.01);
    const [momentum, setMomentum] = useState(0.9);
    const [gradientFiltering, setGradientFiltering] = useState(true);

    useEffect(() => {
        document.title = 'ZSharp - Sharpness-Aware Minimization';
    }, []);

    const currentData = generateData(
        samRadius,
        learningRate,
        momentum,
        gradientFiltering
    );
    const chartTitle = 'Performance Comparison';
    const yAxisLabel = 'Accuracy';
    const tooltipFormatter = (value, name) => [
        `${(value * 100).toFixed(1)}%`,
        name === 'sgd' ? 'SGD' : 'ZSharp',
    ];

    const resetToDefaults = () => {
        setSamRadius(0.05);
        setLearningRate(0.01);
        setMomentum(0.9);
        setGradientFiltering(true);
    };

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
                    maxWidth: '900px',
                    margin: '0 auto',
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
                        sx={{ color: 'text.secondary', marginBottom: 2 }}
                    >
                        Sharpness-Aware Minimization with Z-Score Gradient
                        Filtering
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<GitHub />}
                        href="https://github.com/bangyen/ZSharp"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            borderColor: 'primary.light',
                            color: 'primary.light',
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            },
                        }}
                    >
                        View Repository
                    </Button>
                </Box>

                {/* Performance Chart */}
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
                                color: 'primary.light',
                                marginBottom: 3,
                                textAlign: 'center',
                            }}
                        >
                            {chartTitle}
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={currentData}>
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
                                        label={{
                                            value: yAxisLabel,
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: {
                                                fill: 'rgba(255,255,255,0.7)',
                                            },
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
                                        formatter={tooltipFormatter}
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

                {/* Interactive Control Panel */}
                <Card
                    sx={{
                        backgroundColor: 'rgba(26, 26, 26, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 3,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ color: 'primary.light' }}
                            >
                                Parameter Controls
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Refresh />}
                                onClick={resetToDefaults}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.3)',
                                    color: 'rgba(255,255,255,0.7)',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor:
                                            'rgba(25, 118, 210, 0.1)',
                                    },
                                }}
                            >
                                Reset
                            </Button>
                        </Box>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        SAM Perturbation Radius:{' '}
                                        {samRadius.toFixed(2)}
                                    </Typography>
                                    <Slider
                                        value={samRadius}
                                        onChange={(e, value) =>
                                            setSamRadius(value)
                                        }
                                        min={0.01}
                                        max={0.2}
                                        step={0.01}
                                        sx={{
                                            color: 'primary.main',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'primary.main',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'primary.main',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor:
                                                    'rgba(255,255,255,0.2)',
                                            },
                                        }}
                                    />
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Learning Rate: {learningRate.toFixed(3)}
                                    </Typography>
                                    <Slider
                                        value={learningRate}
                                        onChange={(e, value) =>
                                            setLearningRate(value)
                                        }
                                        min={0.001}
                                        max={0.1}
                                        step={0.001}
                                        sx={{
                                            color: 'success.main',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'success.main',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'success.main',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor:
                                                    'rgba(255,255,255,0.2)',
                                            },
                                        }}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Momentum: {momentum.toFixed(2)}
                                    </Typography>
                                    <Slider
                                        value={momentum}
                                        onChange={(e, value) =>
                                            setMomentum(value)
                                        }
                                        min={0.5}
                                        max={0.99}
                                        step={0.01}
                                        sx={{
                                            color: 'warning.main',
                                            '& .MuiSlider-thumb': {
                                                backgroundColor: 'warning.main',
                                            },
                                            '& .MuiSlider-track': {
                                                backgroundColor: 'warning.main',
                                            },
                                            '& .MuiSlider-rail': {
                                                backgroundColor:
                                                    'rgba(255,255,255,0.2)',
                                            },
                                        }}
                                    />
                                </Box>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={gradientFiltering}
                                            onChange={e =>
                                                setGradientFiltering(
                                                    e.target.checked
                                                )
                                            }
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked':
                                                    {
                                                        color: 'info.main',
                                                    },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor:
                                                            'info.main',
                                                    },
                                            }}
                                        />
                                    }
                                    label="Gradient Filtering"
                                    sx={{ color: 'text.secondary' }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ZSharp;
