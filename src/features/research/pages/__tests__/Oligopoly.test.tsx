import React from 'react';
import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Oligopoly from '../Oligopoly';

// Mocks
jest.mock('../../ResearchDemo', () => ({
    __esModule: true,
    default: ({ title, chartData, controls, onReset, loading }: any) => (
        <div data-testid="research-demo">
            <h1>{title}</h1>
            {loading && <div data-testid="loading">Loading...</div>}
            <div data-testid="chart-data-count">{chartData.length}</div>
            <div data-testid="controls">
                {controls.map((c: any) => (
                    <div key={c.label}>
                        <span>{c.label}</span>
                        <button
                            data-testid={`change-${c.label}`}
                            onClick={() => c.onChange(c.options[0].value)}
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
    ),
}));

// Better Response mock for this test
const originalResponse = (global as any).Response;
(global as any).Response = class extends originalResponse {
    async text() {
        if (this._data instanceof ReadableStream) {
            return '[{"round":1, "price":10, "hhi":0.5, "num_firms":3, "model_type":"cournot", "demand_elasticity":2.0, "base_price":40, "collusion_enabled":false}]';
        }
        return super.text ? await super.text() : '[{}]';
    }
};

describe('Oligopoly Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    const renderOligopoly = async () => {
        let result: any;
        await act(async () => {
            result = render(
                <BrowserRouter>
                    <ThemeProvider theme={createTheme()}>
                        <Oligopoly />
                    </ThemeProvider>
                </BrowserRouter>
            );
        });
        return result;
    };

    test('renders correctly and loads gzipped data', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new Uint8Array([0x1f, 0x8b, 0, 0]).buffer),
        });

        await renderOligopoly();
        expect(screen.getByText('Oligopoly')).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByTestId('chart-data-count')
            ).not.toHaveTextContent('0');
        });
    });

    test('handles fetch failure and uses fallback data', async () => {
        (global.fetch as jest.Mock).mockRejectedValue(
            new Error('Fetch failed')
        );

        await renderOligopoly();
        await waitFor(() => {
            const count = parseInt(
                screen.getByTestId('chart-data-count').textContent || '0'
            );
            expect(count).toBeGreaterThan(0);
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
                demand_elasticity: 2.0,
                base_price: 40,
                collusion_enabled: false,
            },
        ];
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(
                    new TextEncoder().encode(JSON.stringify(data)).buffer
                ),
        });

        await renderOligopoly();
        await waitFor(() => {
            expect(
                screen.getByTestId('chart-data-count')
            ).not.toHaveTextContent('0');
        });
    });

    test('handles control changes and reset', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('[]').buffer),
        });

        await renderOligopoly();

        await act(async () => {
            const changeBtn = screen.getByTestId('change-Number of Firms');
            fireEvent.click(changeBtn);
        });

        await act(async () => {
            const resetBtn = screen.getByTestId('reset-btn');
            fireEvent.click(resetBtn);
        });

        expect(screen.getByText('Oligopoly')).toBeInTheDocument();
    });

    test('sets document title', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('[]').buffer),
        });

        await renderOligopoly();
        expect(document.title).toContain('Oligopoly');
    });

    test('handles edge case: data format error', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('not-json').buffer),
        });

        await renderOligopoly();
        await waitFor(() => {
            const count = parseInt(
                screen.getByTestId('chart-data-count').textContent || '0'
            );
            expect(count).toBeGreaterThan(0);
        });
    });
});
