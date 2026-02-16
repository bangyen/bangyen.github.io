import { RESEARCH_CONSTANTS } from '../config';
import type { ChartConfig, Control } from '../types';
import {
    buildAxisDomain,
    buildTooltipLabelFormatter,
    fetchGzippedJson,
} from '../utils';

import {
    BusinessRounded,
    TrendingUpRounded,
    AttachMoneyRounded,
} from '@/components/icons';
import { COLORS } from '@/config/theme';

/**
 * Raw row from the Oligopoly simulation matrix dataset, including both
 * the simulation output (round/price/hhi) and the parameter metadata
 * used to filter the correct scenario.
 */
export interface MatrixItem {
    round: number;
    price: number;
    hhi: number;
    collusion?: boolean;
    num_firms?: number;
    model_type?: string;
    demand_elasticity?: number;
    base_price?: number;
    collusion_enabled?: boolean;
}

export interface MarketDataPoint {
    round: number;
    price: number;
    hhi: number;
    collusion?: boolean;
}

/**
 * Fetches the gzipped Oligopoly simulation matrix, validating that
 * the response is an array.
 */
export const loadRealSimulationMatrix = async (): Promise<MatrixItem[]> => {
    const matrixData = await fetchGzippedJson<MatrixItem[]>(
        '/oligopoly_data.json.gz',
    );

    if (!Array.isArray(matrixData)) {
        throw new TypeError('Invalid data format: expected array');
    }

    return matrixData;
};

/**
 * Selects the subset of matrix rows matching the given parameter
 * combination.  Falls back to the closest match (same firm count and
 * model type) when an exact match yields no results.
 */
export const filterMatrixData = (
    matrixData: MatrixItem[],
    numFirms: number,
    modelType: string,
    demandElasticity: number,
    basePrice: number,
    collusionEnabled: boolean,
): MarketDataPoint[] => {
    if (matrixData.length === 0) {
        return [];
    }

    const filtered = matrixData.filter(
        item =>
            item.num_firms === numFirms &&
            item.model_type === modelType &&
            item.demand_elasticity === demandElasticity &&
            item.base_price === basePrice &&
            item.collusion_enabled === collusionEnabled,
    );

    if (filtered.length === 0) {
        const closest = matrixData.filter(
            item =>
                item.num_firms === numFirms && item.model_type === modelType,
        );
        const sorted = closest.sort((a, b) => a.round - b.round);
        return sorted.slice(0, RESEARCH_CONSTANTS.oligopoly.maxRounds);
    }

    const sorted = filtered.sort((a, b) => a.round - b.round);
    return sorted.slice(0, 15);
};

// ---------------------------------------------------------------------------
// Chart configuration
// ---------------------------------------------------------------------------

/**
 * Static chart configuration for the Oligopoly dual-axis line chart
 * (price on left, HHI on right).  Defined at module scope so it is
 * created once and shared across renders.
 */
export const oligopolyChartConfig: ChartConfig = {
    type: 'line',
    xAxisKey: 'round',
    yAxisFormatter: (value: number) => `$${value.toFixed(2)}`,
    yAxisDomain: buildAxisDomain(5),
    dualYAxis: true,
    rightYAxisFormatter: (value: number) => value.toFixed(2),
    rightYAxisDomain: buildAxisDomain(
        RESEARCH_CONSTANTS.oligopoly.hhiAxisPadding,
    ),
    tooltipLabelFormatter: buildTooltipLabelFormatter('Round'),
    tooltipFormatter: (value: number, name: string): [string, string] => [
        name === 'Market Price' ? `$${value.toFixed(2)}` : value.toFixed(2),
        name,
    ],
    lines: [
        {
            dataKey: 'price',
            name: 'Market Price',
            color: COLORS.primary.main,
            yAxisId: 'left',
        },
        {
            dataKey: 'hhi',
            name: 'HHI Concentration',
            color: COLORS.data.amber,
            yAxisId: 'right',
        },
    ],
};

// ---------------------------------------------------------------------------
// Controls factory
// ---------------------------------------------------------------------------

interface ControlValues {
    numFirms: number;
    demandElasticity: number;
    basePrice: number;
}

interface ControlSetters {
    setNumFirms: (value: number) => void;
    setDemandElasticity: (value: number) => void;
    setBasePrice: (value: number) => void;
}

/**
 * Builds the Oligopoly control panel definition from the current state
 * values and their setters, keeping the page component free of layout
 * details.
 */
export function buildOligopolyControls(
    values: ControlValues,
    setters: ControlSetters,
): Control[] {
    return [
        {
            label: 'Number of Firms',
            icon: BusinessRounded,
            color: COLORS.primary.main,
            value: values.numFirms,
            onChange: setters.setNumFirms,
            options: RESEARCH_CONSTANTS.oligopoly.options.firms,
        },
        {
            label: 'Demand Elasticity',
            icon: TrendingUpRounded,
            color: COLORS.data.green,
            value: values.demandElasticity,
            onChange: setters.setDemandElasticity,
            options: RESEARCH_CONSTANTS.oligopoly.options.elasticity,
        },
        {
            label: 'Base Price',
            icon: AttachMoneyRounded,
            color: COLORS.data.amber,
            value: values.basePrice,
            onChange: setters.setBasePrice,
            options: RESEARCH_CONSTANTS.oligopoly.options.price,
        },
    ];
}
