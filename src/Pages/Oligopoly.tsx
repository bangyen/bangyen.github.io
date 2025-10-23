import React, { useState, useEffect } from 'react';
import { URLS, PAGE_TITLES, GAME_CONSTANTS } from '../config/constants';
import { COLORS } from '../config/theme';
import {
    BusinessRounded,
    TrendingUpRounded,
    AttachMoneyRounded,
} from '../components/icons';
import ResearchDemo from '../components/ResearchDemo';

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
                `HTTP error! status: ${response.status} - Failed to load Oligopoly data`
            );
        }

        if (typeof DecompressionStream === 'undefined') {
            throw new Error(
                'DecompressionStream not supported in this browser'
            );
        }

        const compressedData = await response.arrayBuffer();
        const decompressedData = await new Response(
            new ReadableStream({
                start(controller) {
                    const decompressionStream = new DecompressionStream('gzip');
                    const writer = decompressionStream.writable.getWriter();
                    const reader = decompressionStream.readable.getReader();

                    writer.write(compressedData).then(() => writer.close());

                    function pump(): Promise<void> {
                        return reader.read().then(({ done, value }: { done: boolean; value: Uint8Array | undefined }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                    return pump();
                },
            })
        ).text();
        const matrixData: MatrixItem[] = JSON.parse(decompressedData);

        if (!Array.isArray(matrixData)) {
            throw new Error('Invalid data format: expected array');
        }

        return matrixData;
    } catch (error) {
        console.error('Error loading Oligopoly data:', error);
        return [];
    }
};

const filterMatrixData = (
    matrixData: MatrixItem[],
    numFirms: number,
    modelType: string,
    demandElasticity: number,
    basePrice: number,
    collusionEnabled: boolean
): MarketDataPoint[] => {
    if (!matrixData || matrixData.length === 0) {
        return generateFallbackOligopolyData();
    }

    const filtered = matrixData.filter(
        item =>
            item.num_firms === numFirms &&
            item.model_type === modelType &&
            item.demand_elasticity === demandElasticity &&
            item.base_price === basePrice &&
            item.collusion_enabled === collusionEnabled
    );

    if (filtered.length === 0) {
        const closest = matrixData.filter(
            item => item.num_firms === numFirms && item.model_type === modelType
        );
        const sorted = closest.sort((a, b) => a.round - b.round);
        return sorted.slice(0, GAME_CONSTANTS.oligopoly.maxRounds);
    }

    const sorted = filtered.sort((a, b) => a.round - b.round);
    return sorted.slice(0, 15);
};

const generateFallbackOligopolyData = (): MarketDataPoint[] => {
    const data: MarketDataPoint[] = [];
    for (let i = 1; i <= GAME_CONSTANTS.oligopoly.maxRounds; i++) {
        const sim = GAME_CONSTANTS.oligopoly.simulation;
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
        GAME_CONSTANTS.oligopoly.defaultFirms
    );
    const [demandElasticity, setDemandElasticity] = useState(
        GAME_CONSTANTS.oligopoly.defaultElasticity
    );
    const [basePrice, setBasePrice] = useState(
        GAME_CONSTANTS.oligopoly.defaultBasePrice
    );
    const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
    const [matrixData, setMatrixData] = useState<MatrixItem[]>([]);
    const [loading, setLoading] = useState(true);

    const modelType = GAME_CONSTANTS.modelTypes.cournot;
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
                    collusionEnabled
                );
                setMarketData(initialData);
            } catch (error) {
                console.error(
                    'Error loading Oligopoly data in component:',
                    error
                );
                setMarketData(generateFallbackOligopolyData());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [numFirms, demandElasticity, basePrice, collusionEnabled, modelType]);

    useEffect(() => {
        if (matrixData.length > 0) {
            const filteredData = filterMatrixData(
                matrixData,
                numFirms,
                modelType,
                demandElasticity,
                basePrice,
                collusionEnabled
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
        setNumFirms(GAME_CONSTANTS.oligopoly.defaultFirms);
        setDemandElasticity(GAME_CONSTANTS.oligopoly.defaultElasticity);
        setBasePrice(GAME_CONSTANTS.oligopoly.defaultBasePrice);
    };

    const controls: Control[] = [
        {
            label: 'Number of Firms',
            icon: BusinessRounded,
            color: COLORS.primary.main,
            value: numFirms,
            onChange: setNumFirms,
            options: [
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' },
            ],
        },
        {
            label: 'Demand Elasticity',
            icon: TrendingUpRounded,
            color: COLORS.data.green,
            value: demandElasticity,
            onChange: setDemandElasticity,
            options: [
                { value: 1.5, label: '1.5' },
                { value: 2.0, label: '2.0' },
                { value: 2.5, label: '2.5' },
            ],
        },
        {
            label: 'Base Price',
            icon: AttachMoneyRounded,
            color: COLORS.data.amber,
            value: basePrice,
            onChange: setBasePrice,
            options: [
                { value: 30, label: '$30' },
                { value: 40, label: '$40' },
                { value: 50, label: '$50' },
            ],
        },
    ];

    const chartConfig = {
        type: 'line',
        xAxisKey: 'round',
        yAxisFormatter: (value: number) => `$${value.toFixed(2)}`,
        yAxisDomain: ['dataMin - 5', 'dataMax + 5'],
        dualYAxis: true,
        rightYAxisFormatter: (value: number) => value.toFixed(2),
        rightYAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
        tooltipLabelFormatter: (value: number) => `Round ${value}`,
        tooltipFormatter: (value: number, name: string) => [
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
            chartData={marketData as any}
            chartConfig={chartConfig as any}
            chartTitle="Market Dynamics"
            controls={controls as any}
            loading={loading}
            loadingMessage="Loading Cournot simulation data..."
            onReset={resetToDefaults}
            resetLabel="Reset"
        />
    );
};

export default Oligopoly;

