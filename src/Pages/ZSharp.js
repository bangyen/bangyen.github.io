import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    IconButton,
    Slider,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { GitHub, Refresh, Home } from '@mui/icons-material';
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

    const resetToDefaults = () => {
        setSamRadius(0.05);
        setLearningRate(0.01);
        setMomentum(0.9);
        setGradientFiltering(true);
    };

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
                        <Grid>
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
                            marginBottom: 4,
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
                            Performance Comparison
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
                                            value: 'Accuracy',
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
                                        formatter={(value, name) => [
                                            `${(value * 100).toFixed(1)}%`,
                                            name,
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
                    </Box>

                    {/* Interactive Control Panel */}
                    <Box
                        sx={{
                            padding: { xs: 1.5, sm: 2 },
                            backgroundColor: 'rgba(128, 128, 128, 0.05)',
                            borderRadius: 2,
                            border: '1px solid rgba(128, 128, 128, 0.2)',
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        }}
                    >
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
                                sx={{
                                    color: 'primary.light',
                                    fontWeight: 600,
                                }}
                            >
                                Parameter Controls
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Refresh />}
                                onClick={resetToDefaults}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'rgba(255,255,255,0.7)',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
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
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default ZSharp;
