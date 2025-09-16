import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { Business, Warning, Assessment, Timeline } from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

// Static market data for demonstration
const marketData = [
    { round: 1, price: 45, hhi: 0.25, collusion: false },
    { round: 2, price: 47, hhi: 0.28, collusion: false },
    { round: 3, price: 49, hhi: 0.32, collusion: false },
    { round: 4, price: 52, hhi: 0.35, collusion: false },
    { round: 5, price: 55, hhi: 0.38, collusion: false },
    { round: 6, price: 58, hhi: 0.42, collusion: true },
    { round: 7, price: 60, hhi: 0.45, collusion: true },
    { round: 8, price: 62, hhi: 0.48, collusion: true },
    { round: 9, price: 65, hhi: 0.52, collusion: true },
    { round: 10, price: 68, hhi: 0.55, collusion: true },
    { round: 11, price: 55, hhi: 0.35, collusion: false },
    { round: 12, price: 52, hhi: 0.32, collusion: false },
    { round: 13, price: 49, hhi: 0.28, collusion: false },
    { round: 14, price: 47, hhi: 0.25, collusion: false },
    { round: 15, price: 45, hhi: 0.22, collusion: false },
];

const Oligopoly = () => {
    useEffect(() => {
        document.title = 'Oligopoly - Economic Simulation';
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
                        Oligopoly
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ color: 'text.secondary', marginBottom: 1 }}
                    >
                        Agent-Based Economic Modeling & Collusion Detection
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '800px',
                            margin: '0 auto',
                        }}
                    >
                        A sophisticated simulation platform for modeling
                        oligopoly market competition, detecting collusion
                        patterns, and analyzing regulatory intervention effects.
                    </Typography>
                </Box>

                {/* Market Dynamics Chart */}
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
                            Market Dynamics & Collusion Detection
                        </Typography>
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={marketData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.1)"
                                    />
                                    <XAxis
                                        dataKey="round"
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                        label={{
                                            value: 'Price ($)',
                                            angle: -90,
                                            position: 'insideLeft',
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="rgba(255,255,255,0.7)"
                                        tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                        label={{
                                            value: 'HHI',
                                            angle: 90,
                                            position: 'insideRight',
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
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#1976d2"
                                        strokeWidth={3}
                                        name="Market Price"
                                        dot={{
                                            fill: '#1976d2',
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="hhi"
                                        stroke="#f57c00"
                                        strokeWidth={3}
                                        name="HHI Concentration"
                                        dot={{
                                            fill: '#f57c00',
                                            strokeWidth: 2,
                                            r: 4,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </Card>

                {/* Key Features */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
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
                                    icon={<Business />}
                                    label="Cournot & Bertrand"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'primary.light', mb: 1 }}
                                >
                                    Competition Models
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Supports both quantity and price competition
                                    models with realistic firm behavior.
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
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<Warning />}
                                    label="Collusion Detection"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'warning.main', mb: 1 }}
                                >
                                    HHI Monitoring
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Real-time monitoring of market concentration
                                    to detect potential collusion.
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
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<Assessment />}
                                    label="Market Analysis"
                                    color="info"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'info.main', mb: 1 }}
                                >
                                    Behavioral Insights
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Analyzes firm strategies to understand
                                    competitive dynamics and market behavior.
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
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<Timeline />}
                                    label="Regulatory Response"
                                    color="success"
                                    variant="outlined"
                                    sx={{ mb: 2 }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'success.main', mb: 1 }}
                                >
                                    Intervention System
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Automatic regulatory intervention with
                                    penalties when collusion is detected.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Oligopoly;
