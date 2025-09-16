import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Button,
    Slider,
} from '@mui/material';
import {
    Business,
    Warning,
    Assessment,
    Timeline,
    GitHub,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

// Generate market data based on number of firms
const generateMarketData = numFirms => {
    const basePrice = 45;
    const baseHHI = 0.25;

    return [
        {
            round: 1,
            price: basePrice,
            hhi: baseHHI + (numFirms - 2) * 0.05,
            collusion: false,
        },
        {
            round: 2,
            price: basePrice + 2,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.03,
            collusion: false,
        },
        {
            round: 3,
            price: basePrice + 4,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.07,
            collusion: false,
        },
        {
            round: 4,
            price: basePrice + 7,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.1,
            collusion: false,
        },
        {
            round: 5,
            price: basePrice + 10,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.13,
            collusion: false,
        },
        {
            round: 6,
            price: basePrice + 13,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.17,
            collusion: true,
        },
        {
            round: 7,
            price: basePrice + 15,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.2,
            collusion: true,
        },
        {
            round: 8,
            price: basePrice + 17,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.23,
            collusion: true,
        },
        {
            round: 9,
            price: basePrice + 20,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.27,
            collusion: true,
        },
        {
            round: 10,
            price: basePrice + 23,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.3,
            collusion: true,
        },
        {
            round: 11,
            price: basePrice + 10,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.1,
            collusion: false,
        },
        {
            round: 12,
            price: basePrice + 7,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.07,
            collusion: false,
        },
        {
            round: 13,
            price: basePrice + 4,
            hhi: baseHHI + (numFirms - 2) * 0.05 + 0.03,
            collusion: false,
        },
        {
            round: 14,
            price: basePrice + 2,
            hhi: baseHHI + (numFirms - 2) * 0.05,
            collusion: false,
        },
        {
            round: 15,
            price: basePrice,
            hhi: baseHHI + (numFirms - 2) * 0.05 - 0.03,
            collusion: false,
        },
    ];
};

const Oligopoly = () => {
    const [numFirms, setNumFirms] = useState(3);
    const [marketData, setMarketData] = useState(generateMarketData(3));

    useEffect(() => {
        document.title = 'Oligopoly - Economic Simulation';
    }, []);

    useEffect(() => {
        setMarketData(generateMarketData(numFirms));
    }, [numFirms]);

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
                        sx={{ color: 'text.secondary', marginBottom: 2 }}
                    >
                        Agent-Based Economic Modeling & Collusion Detection
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<GitHub />}
                        href="https://github.com/bangyen/Oligopoly"
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
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 3,
                            }}
                        >
                            <Typography
                                variant="h5"
                                sx={{ color: 'primary.light' }}
                            >
                                Market Dynamics & Collusion Detection
                            </Typography>
                            <Box sx={{ minWidth: 200 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', mb: 1 }}
                                >
                                    Number of Firms: {numFirms}
                                </Typography>
                                <Slider
                                    value={numFirms}
                                    onChange={(e, value) => setNumFirms(value)}
                                    min={2}
                                    max={5}
                                    step={1}
                                    marks
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
                                        '& .MuiSlider-mark': {
                                            backgroundColor:
                                                'rgba(255,255,255,0.5)',
                                        },
                                        '& .MuiSlider-markLabel': {
                                            color: 'rgba(255,255,255,0.7)',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ height: 300 }}>
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
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Card
                            sx={{
                                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <CardContent>
                                <Chip
                                    icon={<Business />}
                                    label="Cournot & Bertrand"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Competition Models
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
                                <Chip
                                    icon={<Warning />}
                                    label="HHI Monitoring"
                                    color="warning"
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Collusion Detection
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
                                <Chip
                                    icon={<Assessment />}
                                    label="Behavioral Analysis"
                                    color="info"
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Market Insights
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
                                <Chip
                                    icon={<Timeline />}
                                    label="Regulatory Response"
                                    color="success"
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Intervention System
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
