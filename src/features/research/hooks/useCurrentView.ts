import { useMemo } from 'react';

import type { ChartConfig, ViewType } from '../types';

/**
 * Resolved view state returned by `useCurrentView`.
 */
interface CurrentView<T> {
    /** Chart data, optionally transformed by the active view's processor. */
    data: T[] | unknown[];
    /** Chart configuration for the active view. */
    chartConfig: ChartConfig;
    /** Display title for the chart area. */
    title: string;
}

/**
 * Resolves the active research view from a list of view types and a
 * selection key.  Encapsulates the data-processing, config-selection,
 * and title-derivation logic that previously lived inline inside
 * `ResearchDemo`, and memoises the result so it only recomputes when
 * the inputs actually change.
 *
 * @param viewTypes        - Available view definitions (may be empty)
 * @param currentViewType  - Key of the currently selected view
 * @param chartData        - Raw chart data to (optionally) process
 * @param chartConfig      - Fallback chart config when no view overrides it
 * @param chartTitleOverride - Explicit title prop; takes precedence over view titles
 */
export function useCurrentView<T>(
    viewTypes: ViewType<T>[],
    currentViewType: string,
    chartData: T[],
    chartConfig: ChartConfig,
    chartTitleOverride: string | null,
): CurrentView<T> {
    return useMemo(() => {
        const view = viewTypes.find(v => v.key === currentViewType);

        const data =
            chartData.length === 0
                ? []
                : view?.dataProcessor
                  ? view.dataProcessor(chartData)
                  : chartData;

        const resolvedConfig = view?.chartConfig ?? chartConfig;

        const title =
            chartTitleOverride ??
            (viewTypes.length > 0
                ? (view?.chartTitle ?? 'Data Visualization')
                : 'Data Visualization');

        return { data, chartConfig: resolvedConfig, title };
    }, [
        viewTypes,
        currentViewType,
        chartData,
        chartConfig,
        chartTitleOverride,
    ]);
}
