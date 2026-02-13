import pako from 'pako';
import React, { useState, useEffect } from 'react';

import { ResearchDemo } from '../components';
import { RESEARCH_CONSTANTS } from '../config';

import {
    BusinessRounded,
    TrendingUpRounded,
    AttachMoneyRounded,
} from '@/components/icons';
import { URLS, PAGE_TITLES } from '@/config/constants';
import { COLORS } from '@/config/theme';

interface MatrixItem {
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

interface MarketDataPoint {
    round: number;
    price: number;
    hhi: number;
    collusion?: boolean;
}

interface ControlOption {
    value: number;
    label: string;
}

interface Control {
    label: string;
    icon: React.ElementType;
    color: string;
    value: number;
    onChange: (value: number) => void;
    options: ControlOption[];
}

const loadRealSimulationMatrix = async (): Promise<MatrixItem[]> => {
    try {
        const response = await fetch('/oligopoly_data.json.gz');
        if (!response.ok) {
            throw new Error(
                `HTTP error! status: ${response.status.toString()} - Failed to load Oligopoly data`,
            );
        }

        const data = await response.arrayBuffer();
        const view = new Uint8Array(data);

        // Check for GZIP magic number (0x1f 0x8b)
        const isGzipped = view[0] === 0x1f && view[1] === 0x8b;

        const text: string = isGzipped
            ? (pako.ungzip(view, { to: 'string' }) as unknown as string)
            : new TextDecoder().decode(data);

        const matrixData = JSON.parse(text) as MatrixItem[];

        if (!Array.isArray(matrixData)) {
            throw new TypeError('Invalid data format: expected array');
        }

        return matrixData;
    } catch (error) {
        console.error('Error loading oligopoly data:', error);
        return [];
    }
};

const filterMatrixData = (
    matrixData: MatrixItem[],
    numFirms: number,
    modelType: string,
    demandElasticity: number,
    basePrice: number,
    collusionEnabled: boolean,
): MarketDataPoint[] => {
    if (matrixData.length === 0) {
        return generateFallbackOligopolyData();
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

const generateFallbackOligopolyData = (): MarketDataPoint[] => {
    const data: MarketDataPoint[] = [];
    for (let i = 1; i <= RESEARCH_CONSTANTS.oligopoly.maxRounds; i++) {
        const sim = RESEARCH_CONSTANTS.oligopoly.simulation;
        data.push({
            round: i,
            price:
                sim.fallbackPrice +
                Math.sin(i * sim.priceFrequency) * sim.priceAmplitude,
            hhi:
                sim.fallbackHHI +
                Math.sin(i * sim.hhiFrequency) * sim.hhiAmplitude,
            collusion: i > sim.collusionStart && i < sim.collusionEnd,
        });
    }
    return data;
};

const Oligopoly: React.FC = () => {
    const [numFirms, setNumFirms] = useState(
        RESEARCH_CONSTANTS.oligopoly.defaultFirms,
    );
    const [demandElasticity, setDemandElasticity] = useState(
        RESEARCH_CONSTANTS.oligopoly.defaultElasticity,
    );
    const [basePrice, setBasePrice] = useState(
        RESEARCH_CONSTANTS.oligopoly.defaultBasePrice,
    );
    const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
    const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);
    const [loading, setLoading] = useState(true);

    const modelType = RESEARCH_CONSTANTS.modelTypes.cournot;
    const collusionEnabled = false;

    useEffect(() => {
        document.title = PAGE_TITLES.oligopoly;

        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadRealSimulationMatrix();
                setMatrixData(data);
                const initialData = filterMatrixData(
                    data,
                    numFirms,
                    modelType,
                    demandElasticity,
                    basePrice,
                    collusionEnabled,
                );
                setMarketData(initialData);
            } catch {
                // Error loading data, use fallback
                setMarketData(generateFallbackOligopolyData());
            } finally {
                setLoading(false);
            }
        };

        void loadData();
    }, [numFirms, demandElasticity, basePrice, collusionEnabled, modelType]);

    useEffect(() => {
        if (matrixData.length > 0) {
            const filteredData = filterMatrixData(
                matrixData,
                numFirms,
                modelType,
                demandElasticity,
                basePrice,
                collusionEnabled,
            );
            setMarketData(filteredData);
        }
    }, [
        numFirms,
        demandElasticity,
        basePrice,
        matrixData,
        modelType,
        collusionEnabled,
    ]);

    const resetToDefaults = () => {
        setNumFirms(RESEARCH_CONSTANTS.oligopoly.defaultFirms);
        setDemandElasticity(RESEARCH_CONSTANTS.oligopoly.defaultElasticity);
        setBasePrice(RESEARCH_CONSTANTS.oligopoly.defaultBasePrice);
    };

    const controls: Control[] = [
        {
            label: 'Number of Firms',
            icon: BusinessRounded,
            color: COLORS.primary.main,
            value: numFirms,
            onChange: setNumFirms,
            options: RESEARCH_CONSTANTS.oligopoly.options.firms,
        },
        {
            label: 'Demand Elasticity',
            icon: TrendingUpRounded,
            color: COLORS.data.green,
            value: demandElasticity,
            onChange: setDemandElasticity,
            options: RESEARCH_CONSTANTS.oligopoly.options.elasticity,
        },
        {
            label: 'Base Price',
            icon: AttachMoneyRounded,
            color: COLORS.data.amber,
            value: basePrice,
            onChange: setBasePrice,
            options: RESEARCH_CONSTANTS.oligopoly.options.price,
        },
    ];

    const chartConfig = {
        type: 'line',
        xAxisKey: 'round',
        yAxisFormatter: (value: number) => `$${value.toFixed(2)}`,
        yAxisDomain: ['dataMin - 5', 'dataMax + 5'],
        dualYAxis: true,
        rightYAxisFormatter: (value: number) => value.toFixed(2),
        rightYAxisDomain: [
            `dataMin - ${String(RESEARCH_CONSTANTS.oligopoly.simulation.hhiFrequency)}`,
            `dataMax + ${String(RESEARCH_CONSTANTS.oligopoly.simulation.hhiFrequency)}`,
        ],
        tooltipLabelFormatter: (value: number) => `Round ${value.toString()}`,
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

    return (
        <ResearchDemo
            title="Oligopoly"
            subtitle="Agent-Based Economic Competition Analysis"
            githubUrl={URLS.oligopolyRepo}
            chartData={marketData}
            chartConfig={chartConfig}
            chartTitle="Market Dynamics"
            controls={controls}
            loading={loading}
            loadingMessage="Loading Cournot simulation data..."
            onReset={resetToDefaults}
            resetLabel="Reset"
        />
    );
};

export default Oligopoly;
