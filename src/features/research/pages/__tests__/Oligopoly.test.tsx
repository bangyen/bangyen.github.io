import { screen, fireEvent, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import type { ResearchDemoProps, Control } from '../../types';
import { Oligopoly } from '../Oligopoly';

import { renderWithDataRouter } from '@/utils/test-utils';

vi.mock('../../components/ResearchDemo', () => ({
    ResearchDemo: ({
        title,
        pageTitle,
        chart = {},
        controls = [],
        onReset,
    }: ResearchDemoProps<unknown>) => {
        const { data: chartData = [], config: chartConfig } = chart;
        if (pageTitle) document.title = pageTitle;
        if (chartConfig) {
            chartConfig.yAxisFormatter(0);
            chartConfig.rightYAxisFormatter?.(0);
            void chartConfig.tooltipLabelFormatter(0);
            chartConfig.tooltipFormatter(0, 'Market Price');
            chartConfig.tooltipFormatter(0, 'Other');
        }
        return (
            <div data-testid="research-demo">
                <h1>{title}</h1>
                <div data-testid="chart-data-count">{chartData.length}</div>
                <div data-testid="controls">
                    {controls.map((c: Control) => (
                        <div key={c.label}>
                            <span>{c.label}</span>
                            <button
                                data-testid={`change-${c.label}`}
                                onClick={() => {
                                    c.onChange(c.options[0]!.value);
                                }}
                            >
                                Change
                            </button>
                        </div>
                    ))}
                </div>
                <button data-testid="reset-btn" onClick={onReset}>
                    Reset
                </button>
            </div>
        );
    },
}));

const makeMatrixItem = (overrides: Record<string, unknown> = {}) => ({
    round: 1,
    price: 99.99,
    hhi: 0.99,
    num_firms: 3,
    model_type: 'cournot',
    demand_elasticity: 2,
    base_price: 40,
    collusion_enabled: false,
    ...overrides,
});

describe('Oligopoly Component', () => {
    const renderOligopoly = async (
        loaderData: unknown = [makeMatrixItem()],
    ) => {
        await act(async () => {
            renderWithDataRouter(<Oligopoly />, { loaderData });
            await Promise.resolve();
        });
    };

    test('renders correctly with loader data', async () => {
        await renderOligopoly([makeMatrixItem()]);
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '1',
            );
        });
    });

    test('handles empty loader data gracefully', async () => {
        await renderOligopoly([]);
        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '0',
            );
        });
    });

    test('handles control changes and reset', async () => {
        await renderOligopoly([]);

        await act(async () => {
            const changeBtn = screen.getByTestId('change-Number of Firms');
            fireEvent.click(changeBtn);
            await Promise.resolve();
        });

        await act(async () => {
            const resetBtn = screen.getByTestId('reset-btn');
            fireEvent.click(resetBtn);
            await Promise.resolve();
        });

        expect(screen.getByText('Oligopoly')).toBeInTheDocument();
    });

    test('sets document title', async () => {
        await renderOligopoly([]);
        expect(document.title).toContain('Oligopoly');
    });

    test('handles non-matching data with closest fallback', async () => {
        const data = [makeMatrixItem({ demand_elasticity: 9.9 })];

        await renderOligopoly(data);

        await waitFor(() => {
            expect(
                screen.getByTestId('chart-data-count'),
            ).not.toHaveTextContent('0');
        });
    });
});
