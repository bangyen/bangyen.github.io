import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';

import type { ResearchDemoProps, ViewType } from '../../types';
import { ZSharp } from '../ZSharp';

import { renderWithDataRouter } from '@/utils/test-utils';

vi.mock('../../components/ResearchDemo', () => ({
    ResearchDemo: ({
        title,
        chart = {},
        view = {},
    }: ResearchDemoProps<unknown>) => {
        const { data: chartData } = chart;
        const {
            types: viewTypes,
            current: currentViewType,
            onChange: onViewTypeChange,
        } = view;

        if (chartData && chartData.length > 0 && viewTypes) {
            viewTypes.forEach((vt: ViewType<unknown>) => {
                vt.dataProcessor(chartData);
                vt.chartConfig.yAxisFormatter(0.5);
                vt.chartConfig.tooltipFormatter(0.5, 'test');
                void vt.chartConfig.tooltipLabelFormatter(1);
            });
        }

        return (
            <div data-testid="research-demo">
                <h1>{title}</h1>
                <div data-testid="chart-data-count">
                    {chartData ? chartData.length : 0}
                </div>
                <div data-testid="view-types">
                    {viewTypes?.map((v: ViewType<unknown>) => (
                        <button
                            key={v.key}
                            data-testid={`view-${v.key}`}
                            onClick={() => onViewTypeChange?.(v.key)}
                        >
                            {v.label}
                        </button>
                    ))}
                </div>
                <div data-testid="current-view">{currentViewType}</div>
            </div>
        );
    },
}));

const MOCK_ZSHARP_DATA = [
    { epoch: 1, sgd: 0.8, zsharp: 0.82, sgdLoss: 0.5, zsharpLoss: 0.45 },
    { epoch: 2, sgd: 0.85, zsharp: 0.87, sgdLoss: 0.4, zsharpLoss: 0.35 },
];

describe('ZSharp Component', () => {
    const renderZSharp = async (loaderData: unknown = MOCK_ZSHARP_DATA) => {
        let result: ReturnType<typeof renderWithDataRouter> | undefined;
        await act(async () => {
            result = renderWithDataRouter(<ZSharp />, { loaderData });
            await Promise.resolve();
        });
        return result;
    };

    test('renders correctly with loader data', async () => {
        await renderZSharp();
        expect(screen.getByText('ZSharp')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '2',
            );
        });
    });

    test('handles empty loader data gracefully', async () => {
        await renderZSharp([]);
        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '0',
            );
        });
    });

    test('handles view type changes', async () => {
        await renderZSharp();
        await waitFor(() => {
            expect(screen.getByTestId('current-view')).toHaveTextContent(
                'accuracy',
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('view-loss'));
            await Promise.resolve();
        });
        expect(screen.getByTestId('current-view')).toHaveTextContent('loss');
    });
});
