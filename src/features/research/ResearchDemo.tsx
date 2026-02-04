import React from 'react';
import {
    Box,
    Typography,
    Grid,
    useMediaQuery,
    Button,
} from '../../components/mui';
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
import { GlobalHeader } from '../../components/layout/GlobalHeader';
import { ArrowBackRounded as Back } from '../../components/icons';

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
        tooltipLabelFormatter: (value: number) => `Round ${value.toString()}`,
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
    onReset,
    resetLabel = 'Reset',
    chartTitle = null,
    children,
    backUrl,
}: ResearchDemoProps<T>) => {
    const getCurrentChartData = () => {
        if (chartData.length === 0) return [];

        if (!viewTypes.length) return chartData;

        const currentView = viewTypes.find(
            view => view.key === currentViewType
        );
        if (!currentView?.dataProcessor) return chartData;

        return currentView.dataProcessor(chartData);
    };

    const currentData = getCurrentChartData();
    const currentChartConfig =
        viewTypes.find(view => view.key === currentViewType)?.chartConfig ??
        chartConfig;

    const isMobile = useMediaQuery('(max-width:600px)');

    const backButton = (margin: number) => (
        <Button
            component="a"
            href={`#${backUrl ?? ''}`}
            startIcon={<Back />}
            size="small"
            sx={{
                color: COLORS.text.secondary,
                padding: 0,
                minWidth: 0,
                '&:hover': {
                    backgroundColor: 'transparent',
                    color: COLORS.primary.main,
                },
                marginBottom: margin,
                alignSelf: { xs: 'center', sm: 'flex-end' },
                textTransform: 'none',
                fontSize: '0.8rem',
            }}
        >
            Back to Simulation
        </Button>
    );

    let subtitleComponent;

    if (backUrl && isMobile) {
        subtitleComponent = backButton(0);
    } else {
        subtitleComponent = (
            <Typography
                variant="h5"
                sx={{
                    color: COLORS.text.secondary,
                    fontSize: TYPOGRAPHY.fontSize.subheading,
                    textAlign: {
                        xs: 'center',
                        md: 'right',
                    },
                    whiteSpace: {
                        xs: 'normal',
                        md: 'nowrap',
                    },
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                {subtitle}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: COLORS.surface.background,
            }}
        >
            <GlobalHeader showHome={true} githubUrl={githubUrl} />
            <Grid
                container={true}
                flex={1}
                flexDirection="column"
                sx={{
                    position: 'relative',
                    padding: SPACING.padding.md,
                    paddingTop: SPACING.padding.xl,
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: { xs: 'center', md: 'flex-start' },
                                gap: 2,
                                marginBottom: { xs: 3, md: 4 },
                                width: '100%',
                            }}
                        >
                            {backUrl && !isMobile && backButton(-2)}

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: {
                                        xs: 'center',
                                        md: 'baseline',
                                    },
                                    width: '100%',
                                }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                                        fontSize: TYPOGRAPHY.fontSize.h2,
                                        textAlign: { xs: 'center', md: 'left' },
                                    }}
                                >
                                    {title}
                                </Typography>

                                {subtitleComponent}
                            </Box>
                        </Box>

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
                                {chartTitle ??
                                    (viewTypes.length > 0
                                        ? (viewTypes.find(
                                              view =>
                                                  view.key === currentViewType
                                          )?.chartTitle ?? 'Data Visualization')
                                        : 'Data Visualization')}
                            </Typography>
                            <Box
                                sx={{
                                    height: CHART_DIMENSIONS.height,
                                    width: '100%',
                                    position: 'relative',
                                }}
                            >
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
                                            {loadingMessage}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer
                                        width="100%"
                                        height={CHART_DIMENSIONS.height}
                                        minWidth={0}
                                        minHeight={0}
                                        debounce={1}
                                    >
                                        <LineChart data={currentData}>
                                            <CartesianGrid
                                                strokeDasharray={
                                                    CHART_FORMATTING.lines
                                                        .strokeDashArray
                                                }
                                                stroke={COLORS.border.subtle}
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey={
                                                    currentChartConfig.xAxisKey
                                                }
                                                stroke={COLORS.text.secondary}
                                                tick={{
                                                    fill: COLORS.text.secondary,
                                                    fontSize: 10,
                                                }}
                                                axisLine={{
                                                    stroke: COLORS.border
                                                        .subtle,
                                                }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                hide={isMobile}
                                                stroke={COLORS.text.secondary}
                                                tick={{
                                                    fill: COLORS.text.secondary,
                                                    fontSize: 10,
                                                }}
                                                axisLine={false}
                                                tickLine={false}
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
                                                    stroke={
                                                        COLORS.text.secondary
                                                    }
                                                    tick={{
                                                        fill: COLORS.text
                                                            .secondary,
                                                        fontSize: 10,
                                                    }}
                                                    axisLine={false}
                                                    tickLine={false}
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
                                                        COLORS.surface.glass,
                                                    backdropFilter:
                                                        'blur(8px) saturate(180%)',
                                                    border: `1px solid ${COLORS.border.subtle}`,
                                                    borderRadius:
                                                        SPACING.borderRadius.md,
                                                    color: COLORS.text.primary,
                                                    boxShadow: 'none',
                                                }}
                                                itemStyle={{
                                                    fontSize: '12px',
                                                    padding: '2px 0',
                                                }}
                                                labelStyle={{
                                                    fontWeight: 'bold',
                                                    marginBottom: '4px',
                                                    color: COLORS.text.primary,
                                                }}
                                                labelFormatter={
                                                    currentChartConfig.tooltipLabelFormatter
                                                }
                                                formatter={(
                                                    value: number | undefined,
                                                    name: string | undefined
                                                ) => {
                                                    if (value === undefined) {
                                                        throw new Error(
                                                            'Value is undefined'
                                                        );
                                                    }
                                                    if (name === undefined) {
                                                        throw new Error(
                                                            'Name is undefined'
                                                        );
                                                    }
                                                    return currentChartConfig.tooltipFormatter(
                                                        value,
                                                        name
                                                    );
                                                }}
                                            />
                                            {currentChartConfig.lines.map(
                                                (line, _index) => (
                                                    <Line
                                                        key={line.dataKey}
                                                        yAxisId={
                                                            line.yAxisId ??
                                                            'left'
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

                        {children}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ResearchDemo;
