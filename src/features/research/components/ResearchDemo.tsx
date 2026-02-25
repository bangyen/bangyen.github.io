import { Box, Grid } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { lazy, useMemo } from 'react';

import { ResearchControls } from './ResearchControls';
import { ResearchHeader } from './ResearchHeader';
import { ResearchViewSelector } from './ResearchViewSelector';
import { DEFAULT_CHART_CONFIG } from '../config/constants';
import type { ResearchDemoProps } from '../types';

import { PageLayout } from '@/components/layout/PageLayout';
import { ErrorState } from '@/components/ui/ErrorState';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';
import { MobileProvider } from '@/hooks';

/** Outer Grid container that fills the page and constrains content width. */
const demoContainerSx: SxProps<Theme> = {
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
};

/** Inner Grid item that centres content vertically. */
const demoContentGridSx: SxProps<Theme> = {
    ...COMPONENT_VARIANTS.flexCenter,
    flexDirection: 'column',
    zIndex: 1,
    padding: 0,
    minHeight: 0,
};

/** Content wrapper that constrains child width and adds horizontal padding. */
const demoContentBoxSx: SxProps<Theme> = {
    textAlign: 'center',
    maxWidth: SPACING.maxWidth.md,
    width: '100%',
    padding: {
        xs: '0 0.5rem',
        md: '0 2rem',
    },
    boxSizing: 'border-box',
    overflow: 'hidden',
};

const ResearchChart = lazy(() =>
    import('./ResearchChart').then(m => ({ default: m.ResearchChart })),
);

const chartErrorFallback = (
    <ErrorState message="Failed to load chart. Please refresh the page." />
);

/**
 * Generic research demo page shell that provides a consistent layout
 * (header, chart, view selector, controls) for every research tool.
 */
export const ResearchDemo = <T,>({
    title,
    pageTitle,
    subtitle,
    githubUrl,
    children,
    backUrl,
    chart = {},
    view = {},
    controls = [],
    onReset,
    resetLabel = 'Reset',
}: ResearchDemoProps<T>) => {
    // resolveResearchDemoDefaults inline
    const {
        data: chartData = [],
        config: chartConfig = DEFAULT_CHART_CONFIG,
        title: chartTitleOverride = null,
        loading = false,
        loadingMessage = 'Loading data...',
    } = chart;

    const {
        types: viewTypes = [],
        current: currentViewType = 'default',
        onChange: onViewTypeChange = () => {},
    } = view;

    // useCurrentView inline
    const {
        data: currentData,
        chartConfig: currentChartConfig,
        title: calculatedChartTitle,
    } = useMemo(() => {
        const activeView = viewTypes.find(v => v.key === currentViewType);

        const data =
            chartData.length === 0
                ? []
                : activeView?.dataProcessor
                  ? activeView.dataProcessor(chartData)
                  : chartData;

        const resolvedConfig = activeView?.chartConfig ?? chartConfig;

        const chartAreaTitle =
            chartTitleOverride ??
            (viewTypes.length > 0
                ? (activeView?.chartTitle ?? 'Data Visualization')
                : 'Data Visualization');

        return {
            data,
            chartConfig: resolvedConfig,
            title: chartAreaTitle,
        };
    }, [
        viewTypes,
        currentViewType,
        chartData,
        chartConfig,
        chartTitleOverride,
    ]);

    return (
        <PageLayout title={pageTitle ?? title} githubUrl={githubUrl}>
            <MobileProvider>
                <Grid
                    container={true}
                    flex={1}
                    flexDirection="column"
                    sx={demoContainerSx}
                >
                    <Grid size={{ xs: 12 }} flex={1} sx={demoContentGridSx}>
                        <Box sx={demoContentBoxSx}>
                            <ResearchHeader
                                title={title}
                                subtitle={subtitle}
                                backUrl={backUrl}
                            />

                            <LazySuspense
                                message={loadingMessage}
                                errorFallback={chartErrorFallback}
                            >
                                <ResearchChart
                                    currentData={currentData}
                                    currentChartConfig={currentChartConfig}
                                    loading={loading}
                                    loadingMessage={loadingMessage}
                                    chartTitle={calculatedChartTitle}
                                />
                            </LazySuspense>

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
            </MobileProvider>
        </PageLayout>
    );
};
