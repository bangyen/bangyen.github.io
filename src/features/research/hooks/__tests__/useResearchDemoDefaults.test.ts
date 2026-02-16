import { describe, it, expect } from 'vitest';

import { DEFAULT_CHART_CONFIG } from '../../config/constants';
import { resolveResearchDemoDefaults } from '../useResearchDemoDefaults';

describe('resolveResearchDemoDefaults', () => {
    it('returns sensible defaults when no props are provided', () => {
        const result = resolveResearchDemoDefaults({});

        expect(result.chartData).toEqual([]);
        expect(result.chartConfig).toEqual(DEFAULT_CHART_CONFIG);
        expect(result.chartTitle).toBeNull();
        expect(result.loading).toBe(false);
        expect(result.loadingMessage).toBe('Loading data...');
        expect(result.viewTypes).toEqual([]);
        expect(result.currentViewType).toBe('default');
        expect(result.controls).toEqual([]);
        expect(result.onReset).toBeUndefined();
        expect(result.resetLabel).toBe('Reset');
    });

    it('passes through chart props when provided', () => {
        const customConfig = {
            ...DEFAULT_CHART_CONFIG,
            type: 'bar' as const,
        };
        const data = [{ x: 1, y: 2 }];

        const result = resolveResearchDemoDefaults({
            chart: {
                data,
                config: customConfig,
                title: 'Custom Title',
                loading: true,
                loadingMessage: 'Computing...',
            },
        });

        expect(result.chartData).toEqual(data);
        expect(result.chartConfig).toEqual(customConfig);
        expect(result.chartTitle).toBe('Custom Title');
        expect(result.loading).toBe(true);
        expect(result.loadingMessage).toBe('Computing...');
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

        const result = resolveResearchDemoDefaults({
            view: {
                types: viewTypes,
                current: 'custom',
                onChange,
            },
        });

        expect(result.viewTypes).toEqual(viewTypes);
        expect(result.currentViewType).toBe('custom');
        expect(result.onViewTypeChange).toBe(onChange);
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

        const result = resolveResearchDemoDefaults({
            controls,
            onReset,
            resetLabel: 'Start Over',
        });

        expect(result.controls).toEqual(controls);
        expect(result.onReset).toBe(onReset);
        expect(result.resetLabel).toBe('Start Over');
    });
});
