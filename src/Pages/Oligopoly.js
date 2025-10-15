import React, { useState, useEffect } from 'react';
import { URLS, PAGE_TITLES, GAME_CONSTANTS } from '../config/constants';
import { COLORS } from '../config/theme';
import {
    BusinessRounded,
    TrendingUpRounded,
    AttachMoneyRounded,
} from '../components/icons';
import ResearchDemo from '../components/ResearchDemo';

// Load real simulation matrix data
const loadRealSimulationMatrix = async () => {
    try {
        const response = await fetch('/oligopoly_data.json.gz');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const compressedData = await response.arrayBuffer();
        const decompressedData = await new Response(
            new ReadableStream({
                start(controller) {
                    const decompressionStream = new DecompressionStream('gzip');
                    const writer = decompressionStream.writable.getWriter();
                    const reader = decompressionStream.readable.getReader();

                    writer.write(compressedData).then(() => writer.close());

                    function pump() {
                        return reader.read().then(({ done, value }) => {
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
        const matrixData = JSON.parse(decompressedData);
        return matrixData;
    } catch (error) {
        return [];
    }
};

// Filter matrix data based on current parameters
const filterMatrixData = (
    matrixData,
    numFirms,
    modelType,
    demandElasticity,
    basePrice,
    collusionEnabled
) => {
    if (!matrixData || matrixData.length === 0) {
        return generateFallbackOligopolyData();
    }

    // Find exact matching parameters
    const filtered = matrixData.filter(
        item =>
            item.num_firms === numFirms &&
            item.model_type === modelType &&
            item.demand_elasticity === demandElasticity &&
            item.base_price === basePrice &&
            item.collusion_enabled === collusionEnabled
    );

    if (filtered.length === 0) {
        // Fallback to closest match by num_firms and model_type
        const closest = matrixData.filter(
            item => item.num_firms === numFirms && item.model_type === modelType
        );
        // Sort by round to ensure proper order
        const sorted = closest.sort((a, b) => a.round - b.round);
        return sorted.slice(0, GAME_CONSTANTS.oligopoly.maxRounds);
    }

    // Sort by round to ensure proper order
    const sorted = filtered.sort((a, b) => a.round - b.round);
    return sorted.slice(0, 15);
};

// Fallback data generation if real data fails to load
const generateFallbackOligopolyData = () => {
    const data = [];
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

const Oligopoly = () => {
    const [numFirms, setNumFirms] = useState(
        GAME_CONSTANTS.oligopoly.defaultFirms
    );
    const [demandElasticity, setDemandElasticity] = useState(
        GAME_CONSTANTS.oligopoly.defaultElasticity
    );
    const [basePrice, setBasePrice] = useState(
        GAME_CONSTANTS.oligopoly.defaultBasePrice
    );
    const [marketData, setMarketData] = useState([]);
    const [matrixData, setMatrixData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fixed parameters - Cournot model with no collusion
    const modelType = GAME_CONSTANTS.modelTypes.cournot;
    const collusionEnabled = false;

    useEffect(() => {
        document.title = PAGE_TITLES.oligopoly;

        // Load real simulation matrix on component mount
        const loadData = async () => {
            setLoading(true);
            try {
                const data = await loadRealSimulationMatrix();
                setMatrixData(data);
                // Set initial data
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
                setMarketData(generateFallbackOligopolyData());
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [numFirms, demandElasticity, basePrice, collusionEnabled, modelType]);

    // Update data when parameters change
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

    // Define controls for the ResearchDemo component
    const controls = [
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

    // Define chart configuration
    const chartConfig = {
        type: 'line',
        xAxisKey: 'round',
        yAxisFormatter: value => `$${value.toFixed(2)}`,
        yAxisDomain: ['dataMin - 5', 'dataMax + 5'],
        // Dual Y-axis support
        dualYAxis: true,
        rightYAxisFormatter: value => value.toFixed(2),
        rightYAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
        tooltipLabelFormatter: value => `Round ${value}`,
        tooltipFormatter: (value, name) => [
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
