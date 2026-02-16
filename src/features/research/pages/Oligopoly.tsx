import { useState, useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';

import { ResearchDemo } from '../components';
import { RESEARCH_CONSTANTS } from '../config';
import type { MatrixItem } from './oligopolyConfig';
import {
    filterMatrixData,
    oligopolyChartConfig,
    buildOligopolyControls,
} from './oligopolyConfig';

import { URLS, PAGE_TITLES } from '@/config/constants';

export function Oligopoly() {
    const matrixData = useLoaderData<MatrixItem[]>();

    const [numFirms, setNumFirms] = useState(
        RESEARCH_CONSTANTS.oligopoly.defaultFirms,
    );
    const [demandElasticity, setDemandElasticity] = useState(
        RESEARCH_CONSTANTS.oligopoly.defaultElasticity,
    );
    const [basePrice, setBasePrice] = useState(
        RESEARCH_CONSTANTS.oligopoly.defaultBasePrice,
    );

    const modelType = RESEARCH_CONSTANTS.modelTypes.cournot;
    const collusionEnabled = false;

    const marketData = useMemo(
        () =>
            filterMatrixData(
                matrixData,
                numFirms,
                modelType,
                demandElasticity,
                basePrice,
                collusionEnabled,
            ),
        [
            matrixData,
            numFirms,
            modelType,
            demandElasticity,
            basePrice,
            collusionEnabled,
        ],
    );

    const resetToDefaults = () => {
        setNumFirms(RESEARCH_CONSTANTS.oligopoly.defaultFirms);
        setDemandElasticity(RESEARCH_CONSTANTS.oligopoly.defaultElasticity);
        setBasePrice(RESEARCH_CONSTANTS.oligopoly.defaultBasePrice);
    };

    const controls = useMemo(
        () =>
            buildOligopolyControls(
                { numFirms, demandElasticity, basePrice },
                { setNumFirms, setDemandElasticity, setBasePrice },
            ),
        [numFirms, demandElasticity, basePrice],
    );

    return (
        <ResearchDemo
            title="Oligopoly"
            pageTitle={PAGE_TITLES.oligopoly}
            subtitle="Agent-Based Economic Competition Analysis"
            githubUrl={URLS.oligopolyRepo}
            chart={{
                data: marketData,
                config: oligopolyChartConfig,
                title: 'Market Dynamics',
            }}
            controls={controls}
            onReset={resetToDefaults}
            resetLabel="Reset"
        />
    );
}
