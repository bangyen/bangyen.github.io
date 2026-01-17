import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
} from '../../components/mui';
import {
    GitHub,
    HomeRounded as Home,
    Refresh,
    SettingsRounded,
} from '../../components/icons';
import { CHART_DIMENSIONS, CHART_FORMATTING } from './config/researchConfig';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
    SHADOWS,
} from '../../config/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

interface ChartConfig {
    type: string;
    lines: Array<{
        dataKey: string;
        name: string;
        color: string;
        yAxisId?: string;
    }>;
    xAxisKey: string;
    yAxisFormatter: (value: number) => string;
    yAxisDomain: string[];
    dualYAxis?: boolean;
    rightYAxisFormatter?: (value: number) => string;
    rightYAxisDomain?: string[];
    tooltipLabelFormatter: (value: number) => string;
    tooltipFormatter: (value: number, name: string) => [string, string];
}

interface ViewType {
    key: string;
    label: string;
    icon: React.ElementType;
    chartTitle: string;
    dataProcessor: (data: any[]) => any[];
    chartConfig: ChartConfig;
}

interface ControlOption {
    value: number;
    label: string;
}

interface Control {
    label: string;
    icon?: React.ElementType;
    color?: string;
    hoverColor?: string;
    value: number;
    onChange: (value: number) => void;
    options: ControlOption[];
}

interface ResearchDemoProps {
    title: string;
    subtitle: string;
    githubUrl: string;
    chartData?: any[];
    chartConfig?: ChartConfig;
    viewTypes?: ViewType[];
    currentViewType?: string;
    onViewTypeChange?: (value: string) => void;
    controls?: Control[];
    loading?: boolean;
    loadingMessage?: string;
    onReset?: () => void;
    resetLabel?: string;
    chartTitle?: string | null;
}

const ResearchDemo: React.FC<ResearchDemoProps> = ({
    title,
    subtitle,
    githubUrl,
    chartData = [],
    chartConfig = {
        type: 'line',
        lines: [],
        xAxisKey: 'x',
        yAxisFormatter: (value: number) => value.toFixed(2),
        yAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
        dualYAxis: false,
        rightYAxisFormatter: (value: number) => value.toFixed(2),
        rightYAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
        tooltipLabelFormatter: (value: number) => `Round ${value}`,
        tooltipFormatter: (value: number, name: string) => [
            value.toFixed(2),
            name,
        ],
    },
    viewTypes = [],
    currentViewType = 'default',
    onViewTypeChange = () => undefined,
    controls = [],
    loading = false,
    loadingMessage = 'Loading data...',
    onReset = null,
    resetLabel = 'Reset',
    chartTitle = null,
}) => {
    const getCurrentChartData = () => {
        if (!chartData || chartData.length === 0) return [];

        if (!viewTypes.length) return chartData;

        const currentView = viewTypes.find(
            view => view.key === currentViewType
        );
        if (!currentView || !currentView.dataProcessor) return chartData;

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
                                                    COLORS.surface.elevated,
                                                border: `1px solid ${COLORS.border.subtle}`,
                                                borderRadius:
                                                    SPACING.borderRadius.lg,
                                                color: COLORS.text.primary,
                                            }}
                                            labelFormatter={
                                                currentChartConfig.tooltipLabelFormatter
                                            }
                                            formatter={
                                                currentChartConfig.tooltipFormatter as any
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
                                                    boxShadow: SHADOWS.sm,
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
                                                boxShadow: SHADOWS.sm,
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
                                                    COLORS.interactive.disabled,
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
                                                                    SHADOWS.sm,
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
