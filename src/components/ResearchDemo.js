import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
} from './mui';
import { GitHub, HomeRounded as Home, Refresh, SettingsRounded } from './icons';
import { CHART_DIMENSIONS, CHART_FORMATTING } from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../config/theme';
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

/**
 * Reusable ResearchDemo component for consistent research project visualizations
 * Provides standardized layout, charts, and interactive controls for research demos
 */
const ResearchDemo = ({
    // Basic info
    title,
    subtitle,
    githubUrl,

    // Chart configuration
    chartData = [],
    chartConfig = {
        type: 'line',
        lines: [],
        xAxisKey: 'x',
        yAxisFormatter: value => value.toFixed(2),
        yAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
        // Dual Y-axis support
        dualYAxis: false,
        rightYAxisFormatter: value => value.toFixed(2),
        rightYAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
        tooltipLabelFormatter: value => `Round ${value}`,
        tooltipFormatter: (value, name) => [value.toFixed(2), name],
    },

    // View types (for switching between different chart views)
    viewTypes = [],
    currentViewType = 'default',
    onViewTypeChange = () => {},

    // Interactive controls
    controls = [],

    // Loading state
    loading = false,
    loadingMessage = 'Loading data...',

    // Reset functionality
    onReset = null,
    resetLabel = 'Reset',

    // Custom chart title
    chartTitle = null,
}) => {
    // Get current chart data based on view type
    const getCurrentChartData = () => {
        if (!chartData || chartData.length === 0) return [];

        // If no view types, return data as-is
        if (!viewTypes.length) return chartData;

        // Find current view type configuration
        const currentView = viewTypes.find(
            view => view.key === currentViewType
        );
        if (!currentView || !currentView.dataProcessor) return chartData;

        // Process data using the view's data processor
        return currentView.dataProcessor(chartData);
    };

    const currentData = getCurrentChartData();
    const currentChartConfig =
        viewTypes.find(view => view.key === currentViewType)?.chartConfig ||
        chartConfig;

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
                                {title}
                            </Typography>
                        </Grid>
                        <Grid size="auto" sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                href={githubUrl}
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
                        {subtitle}
                    </Typography>

                    {/* Main Chart */}
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
                            {chartTitle ||
                                (viewTypes.length
                                    ? viewTypes.find(
                                          view => view.key === currentViewType
                                      )?.chartTitle || 'Data Visualization'
                                    : 'Data Visualization')}
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
                                    <Typography>{loadingMessage}</Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={currentData}>
                                        <CartesianGrid
                                            strokeDasharray={
                                                CHART_FORMATTING.lines
                                                    .strokeDashArray
                                            }
                                            stroke={COLORS.border.subtle}
                                        />
                                        <XAxis
                                            dataKey={
                                                currentChartConfig.xAxisKey
                                            }
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
                                            tickFormatter={
                                                currentChartConfig.yAxisFormatter
                                            }
                                            domain={
                                                currentChartConfig.yAxisDomain
                                            }
                                        />
                                        {currentChartConfig.dualYAxis && (
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                stroke={COLORS.text.secondary}
                                                tick={{
                                                    fill: COLORS.text.secondary,
                                                }}
                                                tickFormatter={
                                                    currentChartConfig.rightYAxisFormatter
                                                }
                                                domain={
                                                    currentChartConfig.rightYAxisDomain
                                                }
                                            />
                                        )}
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'hsla(0, 0%, 5%, 0.95)',
                                                border: `1px solid ${COLORS.border.subtle}`,
                                                borderRadius:
                                                    SPACING.borderRadius.lg,
                                                color: COLORS.text.primary,
                                            }}
                                            labelFormatter={
                                                currentChartConfig.tooltipLabelFormatter
                                            }
                                            formatter={
                                                currentChartConfig.tooltipFormatter
                                            }
                                        />
                                        {currentChartConfig.lines.map(
                                            (line, index) => (
                                                <Line
                                                    key={line.dataKey}
                                                    yAxisId={
                                                        line.yAxisId || 'left'
                                                    }
                                                    type="monotone"
                                                    dataKey={line.dataKey}
                                                    stroke={line.color}
                                                    strokeWidth={
                                                        CHART_DIMENSIONS.strokeWidth
                                                    }
                                                    name={line.name}
                                                    dot={{
                                                        fill: line.color,
                                                        strokeWidth:
                                                            CHART_FORMATTING
                                                                .lines
                                                                .defaultStrokeWidth,
                                                        r: CHART_DIMENSIONS.dotRadius,
                                                    }}
                                                />
                                            )
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </GlassCard>

                    {/* View Type Selection (if multiple view types) */}
                    {viewTypes.length > 1 && (
                        <GlassCard
                            sx={{
                                marginBottom: 3,
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
                                        Chart Views
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(2, minmax(0, 1fr))',
                                        md: `repeat(${Math.min(viewTypes.length, 4)}, 1fr)`,
                                    },
                                    gap: 1.5,
                                    width: '100%',
                                    margin: 0,
                                }}
                            >
                                {viewTypes.map(viewType => {
                                    const IconComponent = viewType.icon;
                                    return (
                                        <Button
                                            key={viewType.key}
                                            variant="outlined"
                                            size="small"
                                            startIcon={
                                                IconComponent ? (
                                                    <IconComponent />
                                                ) : null
                                            }
                                            onClick={() =>
                                                onViewTypeChange(viewType.key)
                                            }
                                            sx={{
                                                width: '100%',
                                                color:
                                                    currentViewType ===
                                                    viewType.key
                                                        ? COLORS.text.primary
                                                        : COLORS.text.secondary,
                                                backgroundColor:
                                                    currentViewType ===
                                                    viewType.key
                                                        ? COLORS.primary.main
                                                        : 'transparent',
                                                borderColor:
                                                    COLORS.border.subtle,
                                                borderWidth: '1px',
                                                borderStyle: 'solid',
                                                borderRadius:
                                                    SPACING.borderRadius.lg,
                                                minHeight: '36px',
                                                padding: '0.4rem 0.8rem',
                                                fontSize: '0.8rem',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .medium,
                                                transition:
                                                    'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor:
                                                        currentViewType ===
                                                        viewType.key
                                                            ? COLORS.primary
                                                                  .dark
                                                            : COLORS.interactive
                                                                  .hover,
                                                    transform:
                                                        'translateY(-1px)',
                                                    boxShadow:
                                                        '0 4px 8px rgba(0,0,0,0.1)',
                                                },
                                            }}
                                        >
                                            {viewType.label}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </GlassCard>
                    )}

                    {/* Interactive Controls */}
                    {controls.length > 0 && (
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
                                        Parameters
                                    </Typography>
                                </Box>
                                {onReset && (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Refresh />}
                                        onClick={onReset}
                                        sx={{
                                            color: COLORS.text.secondary,
                                            borderColor: COLORS.border.subtle,
                                            borderRadius:
                                                SPACING.borderRadius.lg,
                                            padding: '0.25rem 1rem',
                                            fontSize: '0.875rem',
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.medium,
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor:
                                                    COLORS.primary.main,
                                                backgroundColor:
                                                    COLORS.interactive.hover,
                                                transform: 'translateY(-1px)',
                                                boxShadow:
                                                    '0 4px 8px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        {resetLabel}
                                    </Button>
                                )}
                            </Box>

                            <Grid container={true} spacing={2.5}>
                                {controls.map((control, index) => (
                                    <Grid key={index} size={{ xs: 12, md: 4 }}>
                                        <Box
                                            sx={{
                                                marginBottom: 0,
                                                padding: '1rem',
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.02)',
                                                borderRadius:
                                                    SPACING.borderRadius.lg,
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
                                                {control.icon && (
                                                    <control.icon
                                                        sx={{
                                                            color:
                                                                control.color ||
                                                                COLORS.primary
                                                                    .light,
                                                            fontSize: '1.1rem',
                                                        }}
                                                    />
                                                )}
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: COLORS.text
                                                            .secondary,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .medium,
                                                    }}
                                                >
                                                    {control.label}
                                                </Typography>
                                            </Box>
                                            <ToggleButtonGroup
                                                value={control.value}
                                                exclusive
                                                onChange={(e, newValue) => {
                                                    if (newValue !== null) {
                                                        control.onChange(
                                                            newValue
                                                        );
                                                    }
                                                }}
                                                size="small"
                                                sx={{
                                                    width: '100%',
                                                    borderRadius:
                                                        SPACING.borderRadius.lg,
                                                    overflow: 'hidden',
                                                    border: `1px solid ${COLORS.border.subtle}`,
                                                    '& .MuiToggleButtonGroup-grouped':
                                                        {
                                                            margin: 0,
                                                            border: 0,
                                                            borderRadius: 0,
                                                            '&:not(:first-of-type)':
                                                                {
                                                                    borderLeft: `1px solid ${COLORS.border.subtle}`,
                                                                },
                                                        },
                                                    '& .MuiToggleButton-root': {
                                                        color: COLORS.text
                                                            .secondary,
                                                        borderColor:
                                                            COLORS.border
                                                                .subtle,
                                                        padding:
                                                            '0.6rem 0.8rem',
                                                        flex: 1,
                                                        fontSize: '0.85rem',
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .medium,
                                                        borderRadius: 0,
                                                        transition:
                                                            'all 0.2s ease-in-out',
                                                        '&.Mui-selected': {
                                                            backgroundColor:
                                                                control.color ||
                                                                COLORS.primary
                                                                    .main,
                                                            color: COLORS.text
                                                                .primary,
                                                            borderColor:
                                                                control.color ||
                                                                COLORS.primary
                                                                    .main,
                                                            '&:hover': {
                                                                // Use a darker shade on hover for visual feedback
                                                                backgroundColor:
                                                                    control.hoverColor ||
                                                                    (control.color ===
                                                                    COLORS
                                                                        .primary
                                                                        .main
                                                                        ? COLORS
                                                                              .primary
                                                                              .dark
                                                                        : control.color ===
                                                                            COLORS
                                                                                .data
                                                                                .green
                                                                          ? 'hsl(141, 64%, 39%)'
                                                                          : control.color ===
                                                                              COLORS
                                                                                  .data
                                                                                  .amber
                                                                            ? 'hsl(34, 95%, 48%)'
                                                                            : control.color ||
                                                                              COLORS
                                                                                  .primary
                                                                                  .dark),
                                                                borderColor:
                                                                    control.hoverColor ||
                                                                    (control.color ===
                                                                    COLORS
                                                                        .primary
                                                                        .main
                                                                        ? COLORS
                                                                              .primary
                                                                              .dark
                                                                        : control.color ===
                                                                            COLORS
                                                                                .data
                                                                                .green
                                                                          ? 'hsl(141, 64%, 39%)'
                                                                          : control.color ===
                                                                              COLORS
                                                                                  .data
                                                                                  .amber
                                                                            ? 'hsl(34, 95%, 48%)'
                                                                            : control.color ||
                                                                              COLORS
                                                                                  .primary
                                                                                  .dark),
                                                                transform:
                                                                    'translateY(-1px)',
                                                                boxShadow:
                                                                    '0 4px 8px rgba(0,0,0,0.1)',
                                                            },
                                                        },
                                                        '&:hover': {
                                                            backgroundColor:
                                                                COLORS
                                                                    .interactive
                                                                    .hover,
                                                            transform:
                                                                'translateY(-1px)',
                                                        },
                                                    },
                                                }}
                                            >
                                                {control.options.map(option => (
                                                    <ToggleButton
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </ToggleButton>
                                                ))}
                                            </ToggleButtonGroup>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </GlassCard>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default ResearchDemo;
