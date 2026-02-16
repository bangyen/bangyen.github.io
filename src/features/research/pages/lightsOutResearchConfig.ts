import { RESEARCH_CONSTANTS } from '../config';
import type { ChartConfig } from '../types';

import { COLORS } from '@/config/theme';

/**
 * Data point for the periodicity chart showing how the identity-matrix
 * period z varies with grid width n.
 */
export interface PeriodicityData {
    n: number;
    z: number;
}

/**
 * Static periodicity data for grid widths n = 1..10, derived from
 * the mathematical proofs in the Lights Out research.
 */
export const periodicityData: PeriodicityData[] = [
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

/**
 * Chart configuration for the Lights Out research periodicity chart.
 * Defined at module scope so it is created once and shared across renders.
 */
export const lightsOutResearchChartConfig: ChartConfig = {
    type: 'line',
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
