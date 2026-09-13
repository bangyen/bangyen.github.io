import { useLoaderData } from 'react-router-dom';

import { ResearchDemo } from '../components';
import { useOligopolyState } from '../hooks';
import type { MatrixItem } from './oligopolyConfig';
import { oligopolyChartConfig } from './oligopolyConfig';

import { URLS, PAGE_TITLES } from '@/config/constants';

export function Oligopoly() {
    const matrixData = useLoaderData<MatrixItem[]>();
    const { marketData, controls, reset } = useOligopolyState(matrixData);

    return (
        <ResearchDemo
            title="Oligopoly"
            pageTitle={PAGE_TITLES.oligopoly}
            description="Explore an interactive agent-based Cournot competition simulation and compare market concentration and pricing dynamics."
            subtitle="Agent-Based Economic Competition Analysis"
            githubUrl={URLS.oligopolyRepo}
            chart={{
                data: marketData,
                config: oligopolyChartConfig,
                title: 'Market Dynamics',
            }}
            controls={controls}
            onReset={reset}
            resetLabel="Reset"
        />
    );
}
