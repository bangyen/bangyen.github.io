import { Box, Grid } from '@mui/material';
import React from 'react';

import { ResearchControls } from './ResearchControls';
import { ResearchHeader } from './ResearchHeader';
import { ResearchViewSelector } from './ResearchViewSelector';
import { DEFAULT_CHART_CONFIG } from '../config/constants';
import { useCurrentView } from '../hooks/useCurrentView';
import type { ResearchDemoProps } from '../types';

import { PageLayout } from '@/components/layout/PageLayout';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { SPACING, COMPONENT_VARIANTS } from '@/config/theme';
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
    chartData = [],
    chartConfig = DEFAULT_CHART_CONFIG,
    viewTypes = [],
    currentViewType = 'default',
    onViewTypeChange = () => {},
    controls = [],
    loading = false,
    loadingMessage = 'Loading data...',
    onReset,
    resetLabel = 'Reset',
    chartTitle = null,
    children,
    backUrl,
}: ResearchDemoProps<T>) => {
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
