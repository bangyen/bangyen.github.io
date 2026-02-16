import { Box } from '@mui/material';
import React from 'react';

import { ResearchDemo } from '../components';
import { RESEARCH_CONSTANTS } from '../config';
import {
    AlgorithmOverview,
    IdentityMatrixCard,
    MathDerivation,
    PeriodicityTable,
    References,
} from './lightsOutSections';

import { URLS, ROUTES, PAGE_TITLES } from '@/config/constants';
import { COLORS } from '@/config/theme';

interface PeriodicityData {
    n: number;
    z: number;
}

const periodicityData: PeriodicityData[] = [
    { n: 1, z: 3 },
    { n: 2, z: 2 },
    { n: 3, z: 12 },
    { n: 4, z: 10 },
    { n: 5, z: 24 },
    { n: 6, z: 18 },
    { n: 7, z: 24 },
    { n: 8, z: 14 },
    { n: 9, z: 60 },
    { n: 10, z: 62 },
];

export const LightsOutResearch: React.FC = () => {
    const chartConfig = {
        type: 'line' as const,
        xAxisKey: 'n',
        yAxisFormatter: (value: number) => value.toString(),
        yAxisDomain: ['0', String(RESEARCH_CONSTANTS.lightsOut.yAxisMax)],
        tooltipLabelFormatter: (value: number) =>
            `Grid Width n = ${value.toString()} `,
        tooltipFormatter: (value: number): [string, string] => [
            value.toString(),
            'Period (z)',
        ],
        lines: [
            {
                dataKey: 'z',
                name: 'Period z',
                color: COLORS.primary.main,
            },
        ],
    };

    return (
        <ResearchDemo
            title="Lights Out"
            pageTitle={PAGE_TITLES.lightsOutResearch}
            subtitle="The Mathematics of Grid Solving"
            githubUrl={URLS.githubProfile}
            chartData={periodicityData}
            chartConfig={chartConfig}
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
