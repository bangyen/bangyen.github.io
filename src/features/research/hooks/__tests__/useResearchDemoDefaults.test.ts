import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DEFAULT_CHART_CONFIG } from '../../config/constants';
import { useResearchDemoDefaults } from '../useResearchDemoDefaults';

describe('useResearchDemoDefaults', () => {
    it('returns sensible defaults when no props are provided', () => {
        const { result } = renderHook(() => useResearchDemoDefaults({}));

        expect(result.current.chartData).toEqual([]);
        expect(result.current.chartConfig).toEqual(DEFAULT_CHART_CONFIG);
        expect(result.current.chartTitle).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.loadingMessage).toBe('Loading data...');
        expect(result.current.viewTypes).toEqual([]);
        expect(result.current.currentViewType).toBe('default');
        expect(result.current.controls).toEqual([]);
        expect(result.current.onReset).toBeUndefined();
        expect(result.current.resetLabel).toBe('Reset');
    });

    it('passes through chart props when provided', () => {
        const customConfig = {
            ...DEFAULT_CHART_CONFIG,
            type: 'bar' as const,
        };
        const data = [{ x: 1, y: 2 }];

        const { result } = renderHook(() =>
            useResearchDemoDefaults({
                chart: {
                    data,
                    config: customConfig,
                    title: 'Custom Title',
                    loading: true,
                    loadingMessage: 'Computing...',
                },
            }),
        );

        expect(result.current.chartData).toEqual(data);
        expect(result.current.chartConfig).toEqual(customConfig);
        expect(result.current.chartTitle).toBe('Custom Title');
        expect(result.current.loading).toBe(true);
        expect(result.current.loadingMessage).toBe('Computing...');
    });

    it('passes through view props when provided', () => {
        const viewTypes = [
            {
                key: 'custom',
                label: 'Custom',
                icon: () => null,
                chartTitle: 'Custom View',
                dataProcessor: (d: unknown[]) => d,
                chartConfig: DEFAULT_CHART_CONFIG,
            },
        ];
        const onChange = () => {};

        const { result } = renderHook(() =>
            useResearchDemoDefaults({
                view: {
                    types: viewTypes,
                    current: 'custom',
                    onChange,
                },
            }),
        );

        expect(result.current.viewTypes).toEqual(viewTypes);
        expect(result.current.currentViewType).toBe('custom');
        expect(result.current.onViewTypeChange).toBe(onChange);
    });

    it('passes through controls, onReset, and resetLabel', () => {
        const controls = [
            {
                label: 'Firms',
                value: 3,
                onChange: () => {},
                options: [{ value: 3, label: '3' }],
            },
        ];
        const onReset = () => {};

        const { result } = renderHook(() =>
            useResearchDemoDefaults({
                controls,
                onReset,
                resetLabel: 'Start Over',
            }),
        );

        expect(result.current.controls).toEqual(controls);
        expect(result.current.onReset).toBe(onReset);
        expect(result.current.resetLabel).toBe('Start Over');
    });
});
