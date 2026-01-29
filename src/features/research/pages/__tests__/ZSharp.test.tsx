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
import { ResearchDemoProps, ViewType } from '../../types';
import ZSharp from '../ZSharp';

// Mocks
jest.mock('../../ResearchDemo', () => ({
    __esModule: true,
    default: ({
        title,
        chartData,
        viewTypes,
        currentViewType,
        onViewTypeChange,
        loading,
    }: ResearchDemoProps<unknown>) => {
        // Exercise data processors and formatters for coverage
        if (chartData && chartData.length > 0 && viewTypes) {
            viewTypes.forEach((vt: ViewType<unknown>) => {
                vt.dataProcessor(chartData);
                if (vt.chartConfig.yAxisFormatter)
                    vt.chartConfig.yAxisFormatter(0.5);
                if (vt.chartConfig.tooltipFormatter)
                    vt.chartConfig.tooltipFormatter(0.5, 'test');
                if (vt.chartConfig.tooltipLabelFormatter)
                    vt.chartConfig.tooltipLabelFormatter(1);
            });
        }

        return (
            <div data-testid="research-demo">
                <h1>{title}</h1>
                {loading && <div data-testid="loading">Loading...</div>}
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

// Mock DecompressionStream and ReadableStream
class MockDecompressionStream {
    writable = {
        getWriter: () => ({
            write: jest.fn().mockResolvedValue(undefined),
            close: jest.fn().mockResolvedValue(undefined),
        }),
    };
    readable = {
        getReader: () => ({
            read: jest
                .fn()
                .mockResolvedValueOnce({
                    done: false,
                    value: new TextEncoder().encode(
                        JSON.stringify({
                            'SGD Baseline': {
                                train_accuracies: [80, 85],
                                train_losses: [0.5, 0.4],
                            },
                            ZSharp: {
                                train_accuracies: [82, 87],
                                train_losses: [0.45, 0.35],
                            },
                        })
                    ),
                })
                .mockResolvedValueOnce({ done: true }),
        }),
    };
}

const originalResponse = (global as unknown as { Response: typeof Response })
    .Response;

Object.defineProperty(global, 'DecompressionStream', {
    value: MockDecompressionStream,
    writable: true,
});

Object.defineProperty(global, 'Response', {
    value: class extends originalResponse {
        async text() {
            const self = this as unknown as { _data: unknown };
            if (self._data instanceof ReadableStream) {
                return JSON.stringify({
                    'SGD Baseline': {
                        train_accuracies: [80, 85],
                        train_losses: [0.5, 0.4],
                    },
                    ZSharp: {
                        train_accuracies: [82, 87],
                        train_losses: [0.45, 0.35],
                    },
                });
            }
            const proto = originalResponse.prototype as unknown as {
                text?: () => Promise<string>;
            };
            return proto.text ? await proto.text.call(this) : '{}';
        }
    },
    writable: true,
});

describe('ZSharp Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    const renderZSharp = async () => {
        let result: ReturnType<typeof render> | undefined;
        await act(async () => {
            result = render(
                <BrowserRouter>
                    <ThemeProvider theme={createTheme()}>
                        <ZSharp />
                    </ThemeProvider>
                </BrowserRouter>
            );
        });
        return result;
    };

    test('renders correctly and loads data', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new Uint8Array([0x1f, 0x8b, 0, 0]).buffer),
        });

        await renderZSharp();
        expect(screen.getByText('ZSharp')).toBeInTheDocument();

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

        await renderZSharp();
        await waitFor(() => {
            const count = parseInt(
                screen.getByTestId('chart-data-count').textContent || '0'
            );
            expect(count).toBeGreaterThan(0);
        });
    });

    test('handles view type changes', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: () =>
                Promise.resolve(new TextEncoder().encode('{}').buffer),
        });

        await renderZSharp();
        await waitFor(() => {
            expect(screen.getByTestId('current-view')).toHaveTextContent(
                'accuracy'
            );
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('view-loss'));
        });
        expect(screen.getByTestId('current-view')).toHaveTextContent('loss');
    });
});
