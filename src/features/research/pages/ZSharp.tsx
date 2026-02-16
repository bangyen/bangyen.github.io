import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { ResearchDemo } from '../components';
import type { DataPoint } from './zsharpConfig';
import { zsharpViewTypes } from './zsharpConfig';

import { URLS, PAGE_TITLES } from '@/config/constants';

export function ZSharp() {
    const chartData = useLoaderData<DataPoint[]>();
    const [viewType, setViewType] = useState<string>('accuracy');

    return (
        <ResearchDemo
            title="ZSharp"
            pageTitle={PAGE_TITLES.zsharp}
            subtitle="Neural Network Optimization Research"
            githubUrl={URLS.zsharpRepo}
            chart={{ data: chartData }}
            view={{
                types: zsharpViewTypes,
                current: viewType,
                onChange: setViewType,
            }}
        />
    );
}
