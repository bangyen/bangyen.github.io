import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    useMediaQuery,
} from '../../components/mui';
import { GitHub, HomeRounded as Home } from '../../components/icons';
import { CHART_DIMENSIONS, CHART_FORMATTING } from './config/researchConfig';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
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
import { ResearchDemoProps } from './types';
import ResearchViewSelector from './components/ResearchViewSelector';
import ResearchControls from './components/ResearchControls';

const ResearchDemo = <T,>({
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
    onReset = undefined,
    resetLabel = 'Reset',
    chartTitle = null,
}: ResearchDemoProps<T>) => {
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

    const isMobile = useMediaQuery('(max-width:600px)');

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
                size={{ xs: 12 }}
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
                                            hide={isMobile}
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
                                                hide={isMobile}
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
                                            (line, _index) => (
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

                    <ResearchViewSelector
                        viewTypes={viewTypes}
                        currentViewType={currentViewType}
                        onViewTypeChange={onViewTypeChange}
                    />

                    <ResearchControls
                        controls={controls}
                        onReset={onReset}
                        resetLabel={resetLabel}
                    />
                </Box>
            </Grid>
        </Grid>
    );
};

export default ResearchDemo;
