import React from 'react';
import { Box, Typography } from '../../../components/mui';
import { CHART_DIMENSIONS, CHART_FORMATTING } from '../config/researchConfig';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../config/theme';
import { GlassCard } from '../../../components/ui/GlassCard';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';
import { ChartConfig } from '../types';

interface ResearchChartProps<T> {
    currentData: T[];
    currentChartConfig: ChartConfig;
    loading: boolean;
    loadingMessage: string;
    chartTitle: string | null;
    isMobile: boolean;
}

export function ResearchChart<T>({
    currentData,
    currentChartConfig,
    loading,
    loadingMessage,
    chartTitle,
    isMobile,
}: ResearchChartProps<T>) {
    return (
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
                {chartTitle}
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
                                tick={{
                                    fill: COLORS.text.secondary,
                                    fontSize: 10,
                                }}
                                axisLine={{
                                    stroke: COLORS.border.subtle,
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
                                domain={currentChartConfig.yAxisDomain}
                            />
                            {currentChartConfig.dualYAxis && (
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    hide={isMobile}
                                    stroke={COLORS.text.secondary}
                                    tick={{
                                        fill: COLORS.text.secondary,
                                        fontSize: 10,
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={
                                        currentChartConfig.rightYAxisFormatter
                                    }
                                    domain={currentChartConfig.rightYAxisDomain}
                                />
                            )}
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: COLORS.surface.glass,
                                    backdropFilter: 'blur(8px) saturate(180%)',
                                    border: `1px solid ${COLORS.border.subtle}`,
                                    borderRadius: SPACING.borderRadius.md,
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
                                        throw new Error('Value is undefined');
                                    }
                                    if (name === undefined) {
                                        throw new Error('Name is undefined');
                                    }
                                    return currentChartConfig.tooltipFormatter(
                                        value,
                                        name
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
                                )
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </GlassCard>
    );
}
