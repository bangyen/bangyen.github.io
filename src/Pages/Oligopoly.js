import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    IconButton,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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

// Generate market data based on parameters
const generateMarketData = (
    numFirms,
    modelType,
    demandElasticity,
    basePrice,
    collusionEnabled
) => {
    const data = [];
    const baseHHI = 0.25 + (numFirms - 2) * 0.05;
    const priceMultiplier = modelType === 'cournot' ? 1.0 : 0.8;
    const collusionThreshold = collusionEnabled ? 0.4 : 1.0;

    for (let i = 1; i <= 15; i++) {
        const basePriceValue = basePrice * priceMultiplier;
        const priceVariation = Math.sin(i * 0.3) * 5 + Math.random() * 3;
        const hhiVariation = Math.sin(i * 0.1) * 0.2 + Math.random() * 0.1;

        const currentHHI = baseHHI + hhiVariation;
        const isColluding = currentHHI > collusionThreshold && i > 5 && i < 11;

        data.push({
            round: i,
            price: basePriceValue + priceVariation + (isColluding ? 15 : 0),
            hhi: Math.max(0.1, Math.min(0.8, currentHHI)),
            collusion: isColluding,
        });
    }
    return data;
};

const Oligopoly = () => {
    const [numFirms, setNumFirms] = useState(3);
    const [modelType, setModelType] = useState('cournot');
    const [demandElasticity, setDemandElasticity] = useState(2.0);
    const [basePrice, setBasePrice] = useState(45);
    const [collusionEnabled, setCollusionEnabled] = useState(true);
    const [marketData, setMarketData] = useState(
        generateMarketData(3, 'cournot', 2.0, 45, true)
    );

    useEffect(() => {
        document.title = 'Oligopoly - Economic Simulation';
    }, []);

    useEffect(() => {
        setMarketData(
            generateMarketData(
                numFirms,
                modelType,
                demandElasticity,
                basePrice,
                collusionEnabled
            )
        );
    }, [numFirms, modelType, demandElasticity, basePrice, collusionEnabled]);

    const resetToDefaults = () => {
        setNumFirms(3);
        setModelType('cournot');
        setDemandElasticity(2.0);
        setBasePrice(45);
        setCollusionEnabled(true);
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
                                Oligopoly
                            </Typography>
                        </Grid>
                        <Grid>
                            <IconButton
                                href="https://github.com/bangyen/Oligopoly"
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
                        Agent-Based Economic Modeling & Collusion Detection
                    </Typography>

                    {/* Market Dynamics Chart */}
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
                            Market Dynamics & Collusion Detection
                        </Typography>
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
                                Market Parameters
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
                                    <FormControl fullWidth size="small">
                                        <InputLabel
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                            }}
                                        >
                                            Competition Model
                                        </InputLabel>
                                        <Select
                                            value={modelType}
                                            label="Competition Model"
                                            onChange={e =>
                                                setModelType(e.target.value)
                                            }
                                            sx={{
                                                color: 'white',
                                                '& .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            'rgba(255,255,255,0.3)',
                                                    },
                                                '&:hover .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            'rgba(255,255,255,0.5)',
                                                    },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                                    {
                                                        borderColor:
                                                            'primary.main',
                                                    },
                                            }}
                                        >
                                            <MenuItem value="cournot">
                                                Cournot (Quantity)
                                            </MenuItem>
                                            <MenuItem value="bertrand">
                                                Bertrand (Price)
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Number of Firms: {numFirms}
                                    </Typography>
                                    <Slider
                                        value={numFirms}
                                        onChange={(e, value) =>
                                            setNumFirms(value)
                                        }
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
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Demand Elasticity:{' '}
                                        {demandElasticity.toFixed(1)}
                                    </Typography>
                                    <Slider
                                        value={demandElasticity}
                                        onChange={(e, value) =>
                                            setDemandElasticity(value)
                                        }
                                        min={0.5}
                                        max={5.0}
                                        step={0.1}
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

                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Base Price: ${basePrice}
                                    </Typography>
                                    <Slider
                                        value={basePrice}
                                        onChange={(e, value) =>
                                            setBasePrice(value)
                                        }
                                        min={20}
                                        max={80}
                                        step={5}
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
                                            checked={collusionEnabled}
                                            onChange={e =>
                                                setCollusionEnabled(
                                                    e.target.checked
                                                )
                                            }
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked':
                                                    {
                                                        color: 'error.main',
                                                    },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                                    {
                                                        backgroundColor:
                                                            'error.main',
                                                    },
                                            }}
                                        />
                                    }
                                    label="Enable Collusion"
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

export default Oligopoly;
