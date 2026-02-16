import { Box, Grid } from '@mui/material';
import React from 'react';

import { ResearchControls } from './ResearchControls';
import {
    demoContainerSx,
    demoContentGridSx,
    demoContentBoxSx,
} from './ResearchDemo.styles';
import { ResearchHeader } from './ResearchHeader';
import { ResearchViewSelector } from './ResearchViewSelector';
import { DEFAULT_CHART_CONFIG } from '../config/constants';
import { useCurrentView } from '../hooks/useCurrentView';
import type { ResearchDemoProps } from '../types';

import { PageLayout } from '@/components/layout/PageLayout';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { useMobile } from '@/hooks';
import { lazyNamed } from '@/utils/lazyNamed';

const ResearchChart = lazyNamed(
    () => import('./ResearchChart'),
    'ResearchChart',
);

export const ResearchDemo = <T,>({
    title,
    pageTitle,
    subtitle,
    githubUrl,
    chart = {},
    view = {},
    controls = [],
    onReset,
    resetLabel = 'Reset',
    children,
    backUrl,
}: ResearchDemoProps<T>) => {
    const {
        data: chartData = [],
        config: chartConfig = DEFAULT_CHART_CONFIG,
        title: chartTitle = null,
        loading = false,
        loadingMessage = 'Loading data...',
    } = chart;

    const {
        types: viewTypes = [],
        current: currentViewType = 'default',
        onChange: onViewTypeChange = () => {},
    } = view;

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

    const isMobile = useMobile('sm');

    return (
        <PageLayout title={pageTitle ?? title} githubUrl={githubUrl}>
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
                            isMobile={isMobile}
                        />

                        <LazySuspense message="Loading Chart..." height={400}>
                            <ResearchChart
                                currentData={currentData}
                                currentChartConfig={currentChartConfig}
                                loading={loading}
                                loadingMessage={loadingMessage}
                                chartTitle={calculatedChartTitle}
                                isMobile={isMobile}
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
        </PageLayout>
    );
};
