import { Box, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

import {
    chartCardSx,
    chartTitleSx,
    chartContainerSx,
    loadingBoxSx,
    axisTickStyle,
    xAxisLineStyle,
    tooltipContentStyle,
    tooltipItemStyle,
    tooltipLabelStyle,
} from './ResearchChart.styles';
import { CHART_DIMENSIONS, CHART_FORMATTING } from '../config';
import type { ChartConfig } from '../types';

import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS } from '@/config/theme';
import { useMobileContext } from '@/hooks';

export interface ResearchChartProps<T> {
    currentData: T[];
    currentChartConfig: ChartConfig;
    loading: boolean;
    loadingMessage: string;
    chartTitle: string | null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ChartYAxisProps {
    config: ChartConfig;
    hide: boolean;
}

/**
 * Renders the left (and optional right) Y-axes so the main chart
 * component stays focused on top-level layout.
 */
function ChartYAxes({ config, hide }: ChartYAxisProps) {
    return (
        <>
            <YAxis
                yAxisId="left"
                hide={hide}
                stroke={COLORS.text.secondary}
                tick={axisTickStyle}
                axisLine={false}
                tickLine={false}
                tickFormatter={config.yAxisFormatter}
                domain={config.yAxisDomain}
            />
            {config.dualYAxis && (
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    hide={hide}
                    stroke={COLORS.text.secondary}
                    tick={axisTickStyle}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={config.rightYAxisFormatter}
                    domain={config.rightYAxisDomain}
                />
            )}
        </>
    );
}

interface ChartLinesProps {
    lines: ChartConfig['lines'];
}

/** Renders all data lines from the chart configuration. */
function ChartLines({ lines }: ChartLinesProps) {
    return (
        <>
            {lines.map(line => (
                <Line
                    key={line.dataKey}
                    yAxisId={line.yAxisId ?? 'left'}
                    type="monotone"
                    dataKey={line.dataKey}
                    stroke={line.color}
                    strokeWidth={CHART_DIMENSIONS.strokeWidth}
                    name={line.name}
                    dot={{
                        fill: line.color,
                        strokeWidth: CHART_FORMATTING.lines.defaultStrokeWidth,
                        r: CHART_DIMENSIONS.dotRadius,
                    }}
                />
            ))}
        </>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * Renders the Recharts line chart inside a glass card.
 *
 * Memoised because Recharts renders are expensive and the chart only
 * needs to update when data, config, or loading state actually change.
 * Reads mobile state from `MobileProvider` context rather than
 * accepting it as a prop.
 */
function ResearchChartInner<T>({
    currentData,
    currentChartConfig,
    loading,
    loadingMessage,
    chartTitle,
}: ResearchChartProps<T>) {
    const { sm: isMobile } = useMobileContext();

    const tooltipFormatter = useCallback(
        (value: number | undefined, name: string | undefined) => {
            if (value === undefined) {
                throw new Error(
                    `ResearchChart tooltip: value is undefined for "${String(name)}"`,
                );
            }
            if (name === undefined) {
                throw new Error(
                    `ResearchChart tooltip: name is undefined for value ${String(value)}`,
                );
            }
            return currentChartConfig.tooltipFormatter(value, name);
        },
        [currentChartConfig],
    );

    return (
        <GlassCard sx={chartCardSx}>
            <Typography variant="subtitle1" sx={chartTitleSx}>
                {chartTitle}
            </Typography>
            <Box sx={chartContainerSx}>
                {loading ? (
                    <Box sx={loadingBoxSx}>
                        <Typography>{loadingMessage}</Typography>
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
                                    CHART_FORMATTING.lines.strokeDashArray
                                }
                                stroke={COLORS.border.subtle}
                                vertical={false}
                            />
                            <XAxis
                                dataKey={currentChartConfig.xAxisKey}
                                stroke={COLORS.text.secondary}
                                tick={axisTickStyle}
                                axisLine={xAxisLineStyle}
                                tickLine={false}
                            />
                            <ChartYAxes
                                config={currentChartConfig}
                                hide={isMobile}
                            />
                            <RechartsTooltip
                                contentStyle={tooltipContentStyle}
                                itemStyle={tooltipItemStyle}
                                labelStyle={tooltipLabelStyle}
                                labelFormatter={
                                    currentChartConfig.tooltipLabelFormatter as (
                                        label: unknown,
                                    ) => string
                                }
                                formatter={tooltipFormatter}
                            />
                            <ChartLines lines={currentChartConfig.lines} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </GlassCard>
    );
}

export const ResearchChart = React.memo(
    ResearchChartInner,
) as typeof ResearchChartInner;
