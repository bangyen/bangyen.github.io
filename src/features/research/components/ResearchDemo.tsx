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
 */
export function ResearchDemo<T>(props: ResearchDemoProps<T>) {
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
    } = resolveResearchDemoDefaults(props);

    const { title, subtitle } = props;

    const activeView = useCurrentView(
        viewTypes,
        currentViewType,
        chartData,
        chartConfig,
        chartTitle,
    );

    const controlsElement = (
        <ResearchControls
            controls={controls}
            onReset={onReset}
            resetLabel={resetLabel}
        />
    );

    return (
        <MobileProvider>
            <PageLayout
                background="surface.background"
                containerSx={demoContainerSx}
            >
                <Box sx={demoContentBoxSx}>
                    <ResearchHeader title={title} subtitle={subtitle} />

                    <Grid container spacing={3} sx={demoContentGridSx}>
                        {/* Main Chart Area */}
                        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                            <LazySuspense
                                message={loadingMessage}
                                errorFallback={chartErrorFallback}
                            >
                                <ResearchChart
                                    currentData={activeView.data}
                                    currentChartConfig={activeView.chartConfig}
                                    loading={loading}
                                    loadingMessage={loadingMessage}
                                    chartTitle={activeView.title}
                                />
                            </LazySuspense>
                        </Grid>

                        {/* Sidebar / Controls */}
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                }}
                            >
                                <ResearchViewSelector
                                    viewTypes={viewTypes}
                                    currentViewType={currentViewType}
                                    onViewTypeChange={onViewTypeChange}
                                />
                                {controlsElement}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </PageLayout>
        </MobileProvider>
    );
}
