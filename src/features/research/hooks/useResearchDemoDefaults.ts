import { DEFAULT_CHART_CONFIG } from '../config/constants';
import type {
    ChartConfig,
    Control,
    ResearchDemoChartProps,
    ResearchDemoViewProps,
    ViewType,
} from '../types';

/**
 * Resolved defaults after merging caller-supplied `chart` and `view`
 * prop groups with sensible fallbacks.
 */
export interface ResearchDemoDefaults<T> {
    chartData: T[];
    chartConfig: ChartConfig;
    chartTitle: string | null;
    loading: boolean;
    loadingMessage: string;
    viewTypes: ViewType<T>[];
    currentViewType: string;
    onViewTypeChange: (value: string) => void;
    controls: Control[];
    onReset: (() => void) | undefined;
    resetLabel: string;
}

/**
 * Merges optional `chart` and `view` prop groups from `ResearchDemo`
 * with sensible defaults.
 *
 * Extracted from the component body so `ResearchDemo` stays purely
 * compositional and this logic is independently testable.
 */
export function useResearchDemoDefaults<T>({
    chart = {},
    view = {},
    controls = [],
    onReset,
    resetLabel = 'Reset',
}: {
    chart?: ResearchDemoChartProps<T>;
    view?: ResearchDemoViewProps<T>;
    controls?: Control[];
    onReset?: () => void;
    resetLabel?: string;
}): ResearchDemoDefaults<T> {
    const {
        data: chartData = [],
        config: chartConfig = DEFAULT_CHART_CONFIG,
        title: chartTitle = null,
        loading = false,
        loadingMessage = 'Loading data...',
    } = chart;

    const {
        types: viewTypes = [],
        current: currentViewType = 'default',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onChange: onViewTypeChange = () => {},
    } = view;

    return {
        chartData,
        chartConfig,
        chartTitle,
        loading,
        loadingMessage,
        viewTypes,
        currentViewType,
        onViewTypeChange,
        controls,
        onReset,
        resetLabel,
    };
}
