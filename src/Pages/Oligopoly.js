import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    ToggleButton,
    ToggleButtonGroup,
    Grid,
} from '../components/mui';
import {
    URLS,
    PAGE_TITLES,
    CHART_DIMENSIONS,
    CHART_FORMATTING,
    GAME_CONSTANTS,
} from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../config/theme';
import {
    GitHub,
    Refresh,
    HomeRounded as Home,
    BusinessRounded,
    TrendingUpRounded,
    AttachMoneyRounded,
    SettingsRounded,
} from '../components/icons';
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
        return sorted.slice(0, GAME_CONSTANTS.oligopoly.maxRounds);
    }

    // Sort by round to ensure proper order
    const sorted = filtered.sort((a, b) => a.round - b.round);
    return sorted.slice(0, 15);
};

// Fallback data generation if real data fails to load
const generateFallbackOligopolyData = () => {
    const data = [];
    for (let i = 1; i <= GAME_CONSTANTS.oligopoly.maxRounds; i++) {
        const sim = GAME_CONSTANTS.oligopoly.simulation;
        data.push({
            round: i,
            price:
                sim.fallbackPrice +
                Math.sin(i * sim.priceFrequency) * sim.priceAmplitude,
            hhi:
                sim.fallbackHHI +
                Math.sin(i * sim.hhiFrequency) * sim.hhiAmplitude,
            collusion: i > sim.collusionStart && i < sim.collusionEnd,
        });
    }
    return data;
};

const Oligopoly = () => {
    const [numFirms, setNumFirms] = useState(
        GAME_CONSTANTS.oligopoly.defaultFirms
    );
    const [demandElasticity, setDemandElasticity] = useState(
        GAME_CONSTANTS.oligopoly.defaultElasticity
    );
    const [basePrice, setBasePrice] = useState(
        GAME_CONSTANTS.oligopoly.defaultBasePrice
    );
    const [marketData, setMarketData] = useState([]);
    const [matrixData, setMatrixData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fixed parameters - Cournot model with no collusion
    const modelType = GAME_CONSTANTS.modelTypes.cournot;
    const collusionEnabled = false;

    useEffect(() => {
        document.title = PAGE_TITLES.oligopoly;

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
    }, [numFirms, demandElasticity, basePrice, collusionEnabled, modelType]);

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
        setNumFirms(GAME_CONSTANTS.oligopoly.defaultFirms);
        setDemandElasticity(GAME_CONSTANTS.oligopoly.defaultElasticity);
        setBasePrice(GAME_CONSTANTS.oligopoly.defaultBasePrice);
    };

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
                                Oligopoly
                            </Typography>
                        </Grid>
                        <Grid size="auto" sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                href={URLS.oligopolyRepo}
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
                        Agent-Based Economic Competition Analysis
                    </Typography>

                    {/* Market Dynamics Chart */}
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
                            Market Dynamics
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
                                        Loading Cournot simulation data...
                                    </Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={marketData}>
                                        <CartesianGrid
                                            strokeDasharray={
                                                CHART_FORMATTING.lines
                                                    .strokeDashArray
                                            }
                                            stroke={COLORS.border.subtle}
                                        />
                                        <XAxis
                                            dataKey="round"
                                            stroke={COLORS.text.secondary}
                                            tick={{
                                                fill: COLORS.text.secondary,
                                            }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            stroke={COLORS.text.secondary}
                                            tick={{
                                                fill: COLORS.text.secondary,
                                            }}
                                            tickFormatter={value =>
                                                `${CHART_FORMATTING.price.prefix}${value.toFixed(CHART_FORMATTING.price.decimals)}`
                                            }
                                            domain={[
                                                `dataMin - ${CHART_FORMATTING.axis.padding}`,
                                                `dataMax + ${CHART_FORMATTING.axis.padding}`,
                                            ]}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            stroke={COLORS.text.secondary}
                                            tick={{
                                                fill: COLORS.text.secondary,
                                            }}
                                            tickFormatter={value =>
                                                value.toFixed(
                                                    CHART_FORMATTING.price
                                                        .decimals
                                                )
                                            }
                                            domain={[
                                                'dataMin - 0.05',
                                                'dataMax + 0.05',
                                            ]}
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
                                                `Round ${value}`
                                            }
                                        />
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="price"
                                            stroke={COLORS.primary.main}
                                            strokeWidth={
                                                CHART_DIMENSIONS.strokeWidth
                                            }
                                            name="Market Price"
                                            dot={{
                                                fill: COLORS.primary.main,
                                                strokeWidth:
                                                    CHART_FORMATTING.lines
                                                        .defaultStrokeWidth,
                                                r: CHART_DIMENSIONS.dotRadius,
                                            }}
                                        />
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="hhi"
                                            stroke={COLORS.data.amber}
                                            strokeWidth={
                                                CHART_DIMENSIONS.strokeWidth
                                            }
                                            name="HHI Concentration"
                                            dot={{
                                                fill: COLORS.data.amber,
                                                strokeWidth:
                                                    CHART_FORMATTING.lines
                                                        .defaultStrokeWidth,
                                                r: CHART_DIMENSIONS.dotRadius,
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </GlassCard>

                    {/* Interactive Control Panel */}
                    <GlassCard
                        sx={{
                            marginBottom: 0,
                            width: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            paddingBottom: SPACING.padding.md,
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
                                <SettingsRounded
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
                                    Market Parameters
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Refresh />}
                                onClick={resetToDefaults}
                                sx={{
                                    color: COLORS.text.secondary,
                                    borderColor: COLORS.border.subtle,
                                    borderRadius: SPACING.borderRadius.lg,
                                    padding: '0.25rem 1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        borderColor: COLORS.primary.main,
                                        backgroundColor:
                                            COLORS.interactive.hover,
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    },
                                }}
                            >
                                Reset
                            </Button>
                        </Box>

                        <Grid container={true} spacing={2.5}>
                            {/* Top Row - Toggle Buttons */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                    sx={{
                                        marginBottom: 0,
                                        padding: '1rem',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.02)',
                                        borderRadius: SPACING.borderRadius.lg,
                                        border: `1px solid ${COLORS.border.subtle}`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <BusinessRounded
                                            sx={{
                                                color: COLORS.primary.light,
                                                fontSize: '1.1rem',
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                            }}
                                        >
                                            Number of Firms
                                        </Typography>
                                    </Box>
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
                                            width: '100%',
                                            borderRadius:
                                                SPACING.borderRadius.lg,
                                            overflow: 'hidden',
                                            border: `1px solid ${COLORS.border.subtle}`,
                                            '& .MuiToggleButtonGroup-grouped': {
                                                margin: 0,
                                                border: 0,
                                                borderRadius: 0,
                                                '&:not(:first-of-type)': {
                                                    borderLeft: `1px solid ${COLORS.border.subtle}`,
                                                },
                                            },
                                            '& .MuiToggleButton-root': {
                                                color: COLORS.text.secondary,
                                                borderColor:
                                                    COLORS.border.subtle,
                                                padding: '0.6rem 0.8rem',
                                                flex: 1,
                                                fontSize: '0.85rem',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                                borderRadius: 0,
                                                transition:
                                                    'all 0.2s ease-in-out',
                                                '&.Mui-selected': {
                                                    backgroundColor:
                                                        COLORS.primary.main,
                                                    color: COLORS.text.primary,
                                                    borderColor:
                                                        COLORS.primary.main,
                                                    '&:hover': {
                                                        backgroundColor:
                                                            COLORS.primary.dark,
                                                        transform:
                                                            'translateY(-1px)',
                                                        boxShadow:
                                                            '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor:
                                                        COLORS.interactive
                                                            .hover,
                                                    transform:
                                                        'translateY(-1px)',
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
                                <Box
                                    sx={{
                                        marginBottom: 0,
                                        padding: '1rem',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.02)',
                                        borderRadius: SPACING.borderRadius.lg,
                                        border: `1px solid ${COLORS.border.subtle}`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <TrendingUpRounded
                                            sx={{
                                                color: COLORS.data.green,
                                                fontSize: '1.1rem',
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                            }}
                                        >
                                            Demand Elasticity
                                        </Typography>
                                    </Box>
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
                                            width: '100%',
                                            borderRadius:
                                                SPACING.borderRadius.lg,
                                            overflow: 'hidden',
                                            border: `1px solid ${COLORS.border.subtle}`,
                                            '& .MuiToggleButtonGroup-grouped': {
                                                margin: 0,
                                                border: 0,
                                                borderRadius: 0,
                                                '&:not(:first-of-type)': {
                                                    borderLeft: `1px solid ${COLORS.border.subtle}`,
                                                },
                                            },
                                            '& .MuiToggleButton-root': {
                                                color: COLORS.text.secondary,
                                                borderColor:
                                                    COLORS.border.subtle,
                                                padding: '0.6rem 0.8rem',
                                                flex: 1,
                                                fontSize: '0.85rem',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                                borderRadius: 0,
                                                transition:
                                                    'all 0.2s ease-in-out',
                                                '&.Mui-selected': {
                                                    backgroundColor:
                                                        COLORS.data.green,
                                                    color: COLORS.text.primary,
                                                    borderColor:
                                                        COLORS.data.green,
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'hsl(141, 64%, 39%)',
                                                        transform:
                                                            'translateY(-1px)',
                                                        boxShadow:
                                                            '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor:
                                                        COLORS.interactive
                                                            .hover,
                                                    transform:
                                                        'translateY(-1px)',
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
                                <Box
                                    sx={{
                                        marginBottom: 0,
                                        padding: '1rem',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.02)',
                                        borderRadius: SPACING.borderRadius.lg,
                                        border: `1px solid ${COLORS.border.subtle}`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <AttachMoneyRounded
                                            sx={{
                                                color: COLORS.data.amber,
                                                fontSize: '1.1rem',
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                            }}
                                        >
                                            Base Price
                                        </Typography>
                                    </Box>
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
                                            width: '100%',
                                            borderRadius:
                                                SPACING.borderRadius.lg,
                                            overflow: 'hidden',
                                            border: `1px solid ${COLORS.border.subtle}`,
                                            '& .MuiToggleButtonGroup-grouped': {
                                                margin: 0,
                                                border: 0,
                                                borderRadius: 0,
                                                '&:not(:first-of-type)': {
                                                    borderLeft: `1px solid ${COLORS.border.subtle}`,
                                                },
                                            },
                                            '& .MuiToggleButton-root': {
                                                color: COLORS.text.secondary,
                                                borderColor:
                                                    COLORS.border.subtle,
                                                padding: '0.6rem 0.8rem',
                                                flex: 1,
                                                fontSize: '0.85rem',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                                borderRadius: 0,
                                                transition:
                                                    'all 0.2s ease-in-out',
                                                '&.Mui-selected': {
                                                    backgroundColor:
                                                        COLORS.data.amber,
                                                    color: COLORS.text.primary,
                                                    borderColor:
                                                        COLORS.data.amber,
                                                    '&:hover': {
                                                        backgroundColor:
                                                            'hsl(34, 95%, 48%)',
                                                        transform:
                                                            'translateY(-1px)',
                                                        boxShadow:
                                                            '0 4px 8px rgba(0,0,0,0.1)',
                                                    },
                                                },
                                                '&:hover': {
                                                    backgroundColor:
                                                        COLORS.interactive
                                                            .hover,
                                                    transform:
                                                        'translateY(-1px)',
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
                    </GlassCard>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Oligopoly;
