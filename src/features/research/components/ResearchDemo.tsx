import { Box, Grid } from '@mui/material';
import { lazy } from 'react';

import { ResearchControls } from './ResearchControls';
import {
    demoContentBoxSx,
    demoContentGridSx,
    demoContainerSx,
} from './ResearchDemo.styles';
import { ResearchHeader } from './ResearchHeader';
import { ResearchViewSelector } from './ResearchViewSelector';
import { useCurrentView } from '../hooks/useCurrentView';
import { resolveResearchDemoDefaults } from '../hooks/useResearchDemoDefaults';
import type { ResearchDemoProps } from '../types';

import { PageLayout } from '@/components/layout/PageLayout';
import { ErrorState } from '@/components/ui/ErrorState';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { MobileProvider } from '@/hooks';

const ResearchChart = lazy(() =>
    import('./ResearchChart').then(m => ({ default: m.ResearchChart })),
);

const chartErrorFallback = (
    <ErrorState message="Failed to load chart. Please refresh the page." />
);

/**
 * Generic research demo page shell that provides a consistent layout
 * (header, chart, view selector, controls) for every research tool.
 *
 * Exists so individual research pages (Oligopoly, ZSharp, etc.) only
 * need to supply data-specific configuration while the common chrome
 * and responsive behaviour is handled once.
 */
export const ResearchDemo = <T,>({
    title,
    pageTitle,
    subtitle,
    githubUrl,
    children,
    backUrl,
    ...rest
}: ResearchDemoProps<T>) => {
    const {
        chartData,
        chartConfig,
        chartTitle,
        loading,
        loadingMessage,
        viewTypes,
        currentViewType,
        onViewTypeChange,
        controls,
        onReset,
        resetLabel,
    } = resolveResearchDemoDefaults(rest);

    const {
        data: currentData,
        chartConfig: currentChartConfig,
        title: calculatedChartTitle,
    } = useCurrentView(
        viewTypes,
        currentViewType,
        chartData,
        chartConfig,
        chartTitle ?? null,
    );

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
