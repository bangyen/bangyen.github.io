import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
} from '@testing-library/react';
import pako from 'pako';
import { BrowserRouter } from 'react-router-dom';
import { vi, type Mock } from 'vitest';

import type { ResearchDemoProps, Control } from '../../types';
import { Oligopoly } from '../Oligopoly';

// Mocks
vi.mock('pako', () => ({
    default: {
        ungzip: vi.fn(),
    },
    ungzip: vi.fn(),
}));
vi.mock('../../components/ResearchDemo', () => ({
    ResearchDemo: ({
        title,
        chartData = [],
        chartConfig,
        controls = [],
        onReset,
        loading,
    }: ResearchDemoProps<unknown>) => {
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
                {loading && <div data-testid="loading">Loading...</div>}
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

// Better Response mock for this test
const originalResponse = (
    globalThis as unknown as { Response: typeof Response }
).Response;
Object.defineProperty(globalThis, 'Response', {
    value: class extends originalResponse {
        override async text() {
            const self = this as unknown as { _data: unknown };
            if (self._data instanceof ReadableStream) {
                return '[{"round":1, "price":10, "hhi":0.5, "num_firms":3, "model_type":"cournot", "demand_elasticity":2.0, "base_price":40, "collusion_enabled":false}]';
            }
            return await super.text();
        }
    },
    writable: true,
});

describe('Oligopoly Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.fetch = vi.fn();
    });

    const renderOligopoly = async () => {
        await act(async () => {
            render(
                <BrowserRouter>
                    <ThemeProvider theme={createTheme()}>
                        <Oligopoly />
                    </ThemeProvider>
                </BrowserRouter>,
            );
            await Promise.resolve();
        });
    };

    test('renders correctly and loads gzipped data', async () => {
        const testData = [
            {
                round: 1,
                price: 99.99,
                hhi: 0.99,
                num_firms: 3,
                model_type: 'cournot',
                demand_elasticity: 2,
                base_price: 40,
                collusion_enabled: false,
            },
        ];
        (pako.ungzip as Mock).mockReturnValue(JSON.stringify(testData));
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new Uint8Array([0x1f, 0x8b, 0, 0]).buffer),
        });

        await renderOligopoly();
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '1',
            );
        });
    });

    test('handles fetch failure gracefully with empty data', async () => {
        (globalThis.fetch as Mock).mockRejectedValue(new Error('Fetch failed'));

        await renderOligopoly();
        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '0',
            );
        });
    });

    test('handles non-gzipped data', async () => {
        const data = [
            {
                round: 1,
                price: 50,
                hhi: 0.5,
                num_firms: 3,
                model_type: 'cournot',
                demand_elasticity: 2,
                base_price: 40,
                collusion_enabled: false,
            },
        ];
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(
                    new TextEncoder().encode(JSON.stringify(data)).buffer,
                ),
        });

        await renderOligopoly();
        await waitFor(() => {
            expect(
                screen.getByTestId('chart-data-count'),
            ).not.toHaveTextContent('0');
        });
    });

    test('handles control changes and reset', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('[]').buffer),
        });

        await renderOligopoly();

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
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('[]').buffer),
        });

        await renderOligopoly();
        expect(document.title).toContain('Oligopoly');
    });

    test('handles edge case: data format error', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('not-json').buffer),
        });

        await renderOligopoly();
        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '0',
            );
        });
    });

    test('handles HTTP error 404', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: false,
            status: 404,
        });

        await renderOligopoly();
        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '0',
            );
        });
    });

    test('handles non-array matrix data', async () => {
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(
                    new TextEncoder().encode('{"not": "an-array"}').buffer,
                ),
        });

        await renderOligopoly();
        await waitFor(() => {
            expect(screen.getByTestId('chart-data-count')).toHaveTextContent(
                '0',
            );
        });
    });

    test('fallbacks to closest data when no exact match is found', async () => {
        const data = [
            {
                round: 1,
                price: 50,
                hhi: 0.5,
                num_firms: 3, // Match default numFirms
                model_type: 'cournot', // Match default modelType
                demand_elasticity: 9.9, // Not matching elasticity
                base_price: 40,
                collusion_enabled: false,
            },
        ];
        (globalThis.fetch as Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(
                    new TextEncoder().encode(JSON.stringify(data)).buffer,
                ),
        });

        await renderOligopoly();

        await waitFor(() => {
            expect(
                screen.getByTestId('chart-data-count'),
            ).not.toHaveTextContent('0');
        });
    });
});
