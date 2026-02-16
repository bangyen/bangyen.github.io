import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { ResearchDemo } from '../components';
import type { DataPoint } from './zsharpConfig';
import { zsharpViewTypes } from './zsharpConfig';

import { URLS, PAGE_TITLES } from '@/config/constants';

export const ZSharp: React.FC = () => {
    const chartData = useLoaderData<DataPoint[]>();
    const [viewType, setViewType] = useState<string>('accuracy');

    return (
        <ResearchDemo
            title="ZSharp"
            pageTitle={PAGE_TITLES.zsharp}
            subtitle="Neural Network Optimization Research"
            githubUrl={URLS.zsharpRepo}
            chartData={chartData}
            viewTypes={zsharpViewTypes}
            currentViewType={viewType}
            onViewTypeChange={setViewType}
        />
    );
};
