import React from 'react';

const ResearchChart = React.lazy(() =>
    import('./ResearchChart').then(module => ({
        default: module.ResearchChart,
    }))
);

import ResearchControls from './ResearchControls';
import { ResearchErrorBoundary } from './ResearchErrorBoundary';
import { ResearchHeader } from './ResearchHeader';
import ResearchViewSelector from './ResearchViewSelector';
import { ResearchDemoProps } from '../types';

import { PageLayout } from '@/components/layout/PageLayout';
import { Box, Grid, useMediaQuery } from '@/components/mui';
import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';

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
        tooltipLabelFormatter: (value: unknown) => `Round ${String(value)}`,
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

    const calculatedChartTitle =
        chartTitle ??
        (viewTypes.length > 0
            ? (viewTypes.find(view => view.key === currentViewType)
                  ?.chartTitle ?? 'Data Visualization')
            : 'Data Visualization');

    return (
        <ResearchErrorBoundary>
            <PageLayout githubUrl={githubUrl}>
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
                            <ResearchHeader
                                title={title}
                                subtitle={subtitle}
                                backUrl={backUrl}
                                isMobile={isMobile}
                            />

                            <React.Suspense
                                fallback={
                                    <Box
                                        sx={{
                                            height: 400,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        Loading Chart...
                                    </Box>
                                }
                            >
                                <ResearchChart
                                    currentData={currentData}
                                    currentChartConfig={currentChartConfig}
                                    loading={loading}
                                    loadingMessage={loadingMessage}
                                    chartTitle={calculatedChartTitle}
                                    isMobile={isMobile}
                                />
                            </React.Suspense>

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
            </PageLayout>
        </ResearchErrorBoundary>
    );
};

export default ResearchDemo;
