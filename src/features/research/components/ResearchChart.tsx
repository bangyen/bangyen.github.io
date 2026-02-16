import { Box, Typography } from '@mui/material';
import React from 'react';
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

export interface ResearchChartProps<T> {
    currentData: T[];
    currentChartConfig: ChartConfig;
    loading: boolean;
    loadingMessage: string;
    chartTitle: string | null;
    isMobile: boolean;
}

/**
 * Renders the Recharts line chart inside a glass card.
 *
 * Memoised because Recharts renders are expensive and the chart only
 * needs to update when data, config, or loading state actually change.
 */
function ResearchChartInner<T>({
    currentData,
    currentChartConfig,
    loading,
    loadingMessage,
    chartTitle,
    isMobile,
}: ResearchChartProps<T>) {
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
                            <YAxis
                                yAxisId="left"
                                hide={isMobile}
                                stroke={COLORS.text.secondary}
                                tick={axisTickStyle}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={
                                    currentChartConfig.yAxisFormatter
                                }
                                domain={currentChartConfig.yAxisDomain}
                            />
                            {currentChartConfig.dualYAxis && (
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    hide={isMobile}
                                    stroke={COLORS.text.secondary}
                                    tick={axisTickStyle}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={
                                        currentChartConfig.rightYAxisFormatter
                                    }
                                    domain={currentChartConfig.rightYAxisDomain}
                                />
                            )}
                            <RechartsTooltip
                                contentStyle={tooltipContentStyle}
                                itemStyle={tooltipItemStyle}
                                labelStyle={tooltipLabelStyle}
                                labelFormatter={
                                    currentChartConfig.tooltipLabelFormatter
                                }
                                formatter={(
                                    value: number | undefined,
                                    name: string | undefined,
                                ) => {
                                    if (value === undefined) {
                                        throw new Error('Value is undefined');
                                    }
                                    if (name === undefined) {
                                        throw new Error('Name is undefined');
                                    }
                                    return currentChartConfig.tooltipFormatter(
                                        value,
                                        name,
                                    );
                                }}
                            />
                            {currentChartConfig.lines.map(
                                (line: {
                                    dataKey: string;
                                    color: string;
                                    name: string;
                                    yAxisId?: string;
                                }) => (
                                    <Line
                                        key={line.dataKey}
                                        yAxisId={line.yAxisId ?? 'left'}
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
                                                CHART_FORMATTING.lines
                                                    .defaultStrokeWidth,
                                            r: CHART_DIMENSIONS.dotRadius,
                                        }}
                                    />
                                ),
                            )}
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
