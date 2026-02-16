import { Box } from '@mui/material';
import React from 'react';

import { ResearchDemo } from '../components';
import {
    periodicityData,
    lightsOutResearchChartConfig,
} from './lightsOutResearchConfig';
import {
    AlgorithmOverview,
    IdentityMatrixCard,
    MathDerivation,
    PeriodicityTable,
    References,
} from './lightsOutSections';

import { URLS, ROUTES, PAGE_TITLES } from '@/config/constants';

export const LightsOutResearch: React.FC = () => {
    return (
        <ResearchDemo
            title="Lights Out"
            pageTitle={PAGE_TITLES.lightsOutResearch}
            subtitle="The Mathematics of Grid Solving"
            githubUrl={URLS.githubProfile}
            chartData={periodicityData}
            chartConfig={lightsOutResearchChartConfig}
            chartTitle="Identity Matrix Periodicity"
            backUrl={ROUTES.pages.LightsOut}
        >
            <Box sx={{ mt: 6, textAlign: 'left' }}>
                <AlgorithmOverview />
                <IdentityMatrixCard />
                <MathDerivation />
                <PeriodicityTable />
                <References />
            </Box>
        </ResearchDemo>
    );
};
