import { useState, useMemo, useCallback } from 'react';

import { RESEARCH_CONSTANTS } from '../config';
import type { MatrixItem, MarketDataPoint } from '../pages/oligopolyConfig';
import {
    filterMatrixData,
    buildOligopolyControls,
} from '../pages/oligopolyConfig';
import type { Control } from '../types';

interface OligopolyState {
    /** Filtered market data for the current parameter combination. */
    marketData: MarketDataPoint[];
    /** Control panel definitions bound to current values and setters. */
    controls: Control[];
    /** Resets all parameters to their default values. */
    resetToDefaults: () => void;
}

/**
 * Encapsulates the Oligopoly page's filter-parameter state so the page
 * component stays as thin as the ZSharp page.
 *
 * Manages three independent sliders (firms, elasticity, base price),
 * derives the filtered market data via `useMemo`, and builds the
 * control panel definition that `ResearchDemo` renders.
 */
export function useOligopolyState(matrixData: MatrixItem[]): OligopolyState {
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

    const resetToDefaults = useCallback(() => {
        setNumFirms(RESEARCH_CONSTANTS.oligopoly.defaultFirms);
        setDemandElasticity(RESEARCH_CONSTANTS.oligopoly.defaultElasticity);
        setBasePrice(RESEARCH_CONSTANTS.oligopoly.defaultBasePrice);
    }, []);

    const controls = useMemo(
        () =>
            buildOligopolyControls(
                { numFirms, demandElasticity, basePrice },
                { setNumFirms, setDemandElasticity, setBasePrice },
            ),
        [numFirms, demandElasticity, basePrice],
    );

    return { marketData, controls, resetToDefaults };
}
