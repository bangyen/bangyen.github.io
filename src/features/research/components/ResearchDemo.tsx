import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

import { ResearchControls } from './ResearchControls';
import {
    demoContainerSx,
    demoContentGridSx,
    demoContentBoxSx,
} from './ResearchDemo.styles';
import { ResearchHeader } from './ResearchHeader';
import { ResearchViewSelector } from './ResearchViewSelector';
import { useCurrentView } from '../hooks/useCurrentView';
import { useResearchDemoDefaults } from '../hooks/useResearchDemoDefaults';
import type { ResearchDemoProps } from '../types';

import { PageLayout } from '@/components/layout/PageLayout';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { MobileProvider } from '@/hooks';
import { lazyNamed } from '@/utils/lazyNamed';

const ResearchChart = lazyNamed(
    () => import('./ResearchChart'),
    'ResearchChart',
);

const chartErrorFallback = (
    <Typography color="error" sx={{ p: 3, textAlign: 'center' }}>
        Failed to load chart. Please refresh the page.
    </Typography>
);

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
    } = useResearchDemoDefaults(rest);

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
                                message="Loading Chart..."
                                height={400}
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
