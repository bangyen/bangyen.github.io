import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
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

// Load real simulation matrix data
const loadRealSimulationMatrix = async () => {
    try {
        const response = await fetch('/oligopoly_data.json.gz');
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
        const matrixData = JSON.parse(decompressedData);
        return matrixData;
    } catch (error) {
        return [];
    }
};

// Filter matrix data based on current parameters
const filterMatrixData = (
    matrixData,
    numFirms,
    modelType,
    demandElasticity,
    basePrice,
    collusionEnabled
) => {
    if (!matrixData || matrixData.length === 0) {
        return generateFallbackOligopolyData();
    }

    // Find exact matching parameters
    const filtered = matrixData.filter(
        item =>
            item.num_firms === numFirms &&
            item.model_type === modelType &&
            item.demand_elasticity === demandElasticity &&
            item.base_price === basePrice &&
            item.collusion_enabled === collusionEnabled
    );

    if (filtered.length === 0) {
        // Fallback to closest match by num_firms and model_type
        const closest = matrixData.filter(
            item => item.num_firms === numFirms && item.model_type === modelType
        );
        // Sort by round to ensure proper order
        const sorted = closest.sort((a, b) => a.round - b.round);
        return sorted.slice(0, 15);
    }

    // Sort by round to ensure proper order
    const sorted = filtered.sort((a, b) => a.round - b.round);
    return sorted.slice(0, 15);
};

// Fallback data generation if real data fails to load
const generateFallbackOligopolyData = () => {
    const data = [];
    for (let i = 1; i <= 15; i++) {
        data.push({
            round: i,
            price: 20 + Math.sin(i * 0.3) * 5,
            hhi: 0.3 + Math.sin(i * 0.1) * 0.1,
            collusion: i > 5 && i < 11,
        });
    }
    return data;
};

const Oligopoly = () => {
    const [numFirms, setNumFirms] = useState(3);
    const [demandElasticity, setDemandElasticity] = useState(2.0);
    const [basePrice, setBasePrice] = useState(40);
    const [marketData, setMarketData] = useState([]);
    const [matrixData, setMatrixData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fixed parameters - Cournot model with no collusion
    const modelType = 'cournot';
    const collusionEnabled = false;

    useEffect(() => {
        document.title = 'Oligopoly - Cournot Competition';

        // Load real simulation matrix on component mount
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadRealSimulationMatrix();
                setMatrixData(data);
                // Set initial data
                const initialData = filterMatrixData(
                    data,
                    numFirms,
                    modelType,
                    demandElasticity,
                    basePrice,
                    collusionEnabled
                );
                setMarketData(initialData);
            } catch (error) {
                setMarketData(generateFallbackOligopolyData());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [numFirms, demandElasticity, basePrice, collusionEnabled]);

    // Update data when parameters change
    useEffect(() => {
        if (matrixData.length > 0) {
            const filteredData = filterMatrixData(
                matrixData,
                numFirms,
                modelType,
                demandElasticity,
                basePrice,
                collusionEnabled
            );
            setMarketData(filteredData);
        }
    }, [
        numFirms,
        demandElasticity,
        basePrice,
        matrixData,
        modelType,
        collusionEnabled,
    ]);

    const resetToDefaults = () => {
        setNumFirms(3);
        setDemandElasticity(2.0);
        setBasePrice(40);
    };

    return (
        <Grid
            container={true}
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
                size={12}
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
                        container={true}
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ marginBottom: 2 }}
                    >
                        <Grid size="auto">
                            <Typography
                                variant="h1"
                                sx={{
                                    color: 'text.primary',
                                    fontWeight: 700,
                                    fontSize: {
                                        xs: '2rem',
                                        sm: '2.8rem',
                                        md: '3.2rem',
                                    },
                                }}
                            >
                                Oligopoly
                            </Typography>
                        </Grid>
                        <Grid size="auto" sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                href="https://github.com/bangyen/Oligopoly"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitHub
                                    sx={{
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                    }}
                                />
                            </IconButton>
                            <IconButton component="a" href="/">
                                <Home
                                    sx={{
                                        fontSize: { xs: '1.5rem', sm: '2rem' },
                                    }}
                                />
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
                        Cournot Competition Simulation
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
                            Cournot Market Dynamics
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
                                        Loading Cournot simulation data...
                                    </Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={marketData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="round"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                            tickFormatter={value =>
                                                `$${value.toFixed(2)}`
                                            }
                                            domain={[
                                                'dataMin - 5',
                                                'dataMax + 5',
                                            ]}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                            tickFormatter={value =>
                                                value.toFixed(2)
                                            }
                                            domain={[
                                                'dataMin - 0.05',
                                                'dataMax + 0.05',
                                            ]}
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
                                                `Round ${value}`
                                            }
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
                            )}
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

                        <Grid container={true} spacing={3}>
                            {/* Top Row - Toggle Buttons */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Number of Firms
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={numFirms}
                                        exclusive
                                        onChange={(e, newValue) => {
                                            if (newValue !== null) {
                                                setNumFirms(newValue);
                                            }
                                        }}
                                        size="small"
                                        sx={{
                                            width: '80%',
                                            margin: '0 auto',
                                            '& .MuiToggleButton-root': {
                                                color: 'rgba(255,255,255,0.7)',
                                                borderColor:
                                                    'rgba(255,255,255,0.3)',
                                                padding: '8px 12px',
                                                flex: 1,
                                                '&.Mui-selected': {
                                                    backgroundColor:
                                                        'primary.main',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'primary.dark',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor:
                                                        'rgba(255,255,255,0.1)',
                                                },
                                            },
                                        }}
                                    >
                                        <ToggleButton value={2}>2</ToggleButton>
                                        <ToggleButton value={3}>3</ToggleButton>
                                        <ToggleButton value={4}>4</ToggleButton>
                                        <ToggleButton value={5}>5</ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Demand Elasticity
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={demandElasticity}
                                        exclusive
                                        onChange={(e, newValue) => {
                                            if (newValue !== null) {
                                                setDemandElasticity(newValue);
                                            }
                                        }}
                                        size="small"
                                        sx={{
                                            width: '80%',
                                            margin: '0 auto',
                                            '& .MuiToggleButton-root': {
                                                color: 'rgba(255,255,255,0.7)',
                                                borderColor:
                                                    'rgba(255,255,255,0.3)',
                                                padding: '8px 12px',
                                                flex: 1,
                                                '&.Mui-selected': {
                                                    backgroundColor:
                                                        'success.main',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'success.dark',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor:
                                                        'rgba(255,255,255,0.1)',
                                                },
                                            },
                                        }}
                                    >
                                        <ToggleButton value={1.5}>
                                            1.5
                                        </ToggleButton>
                                        <ToggleButton value={2.0}>
                                            2.0
                                        </ToggleButton>
                                        <ToggleButton value={2.5}>
                                            2.5
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'text.secondary', mb: 1 }}
                                    >
                                        Base Price
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={basePrice}
                                        exclusive
                                        onChange={(e, newValue) => {
                                            if (newValue !== null) {
                                                setBasePrice(newValue);
                                            }
                                        }}
                                        size="small"
                                        sx={{
                                            width: '80%',
                                            margin: '0 auto',
                                            '& .MuiToggleButton-root': {
                                                color: 'rgba(255,255,255,0.7)',
                                                borderColor:
                                                    'rgba(255,255,255,0.3)',
                                                padding: '8px 12px',
                                                flex: 1,
                                                '&.Mui-selected': {
                                                    backgroundColor:
                                                        'warning.main',
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'warning.dark',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor:
                                                        'rgba(255,255,255,0.1)',
                                                },
                                            },
                                        }}
                                    >
                                        <ToggleButton value={30}>
                                            $30
                                        </ToggleButton>
                                        <ToggleButton value={40}>
                                            $40
                                        </ToggleButton>
                                        <ToggleButton value={50}>
                                            $50
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Oligopoly;
