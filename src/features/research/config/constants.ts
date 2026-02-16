import type { ChartConfig } from '../types';

/**
 * Sensible chart defaults used by `ResearchDemo` when the caller does
 * not provide an explicit `chartConfig` prop.  Extracted here so the
 * object is created once at module scope instead of on every render,
 * and can be reused by other research components that need the same
 * baseline configuration.
 */
export const DEFAULT_CHART_CONFIG: ChartConfig = {
    type: 'line',
    lines: [],
    xAxisKey: 'x',
    yAxisFormatter: (value: number) => value.toFixed(2),
    yAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
    dualYAxis: false,
    rightYAxisFormatter: (value: number) => value.toFixed(2),
    rightYAxisDomain: ['dataMin - 0.05', 'dataMax + 0.05'],
    tooltipLabelFormatter: (value: number) => `Round ${String(value)}`,
    tooltipFormatter: (value: number, name: string) => [value.toFixed(2), name],
};

export const RESEARCH_STYLES = {
    // Glass/Transparency effects for scientific UI
    GLASS: {
        VERY_SUBTLE: 'var(--glass-very-subtle)',
        SUBTLE: 'var(--glass-subtle)',
        TRANSPARENT: 'var(--glass-transparent)',
        SLIGHT: 'var(--glass-slight)',
        MEDIUM: 'var(--glass-medium)',
        STRONG: 'var(--glass-strong)',
        DARK: 'var(--glass-dark)',
    },
    // Cyan/Teal accents often used for "data" or "results"
    CYAN: {
        BG_SUBTLE: 'var(--research-cyan-bg)',
        BG_SLIGHT: 'var(--research-cyan-bg)',
        BORDER_SUBTLE: 'var(--research-cyan-border)',
        BORDER_SLIGHT: 'var(--research-cyan-border)',
    },
    // Green accents for success/proofs
    GREEN: {
        BG_SUBTLE: 'var(--research-green-bg)',
        BORDER_SUBTLE: 'var(--research-green-border)',
        HOVER: 'hsl(141, 64%, 39%)',
    },
    // Amber accents for warnings/logic nodes
    AMBER: {
        BG_SUBTLE: 'var(--research-amber-bg)',
        BORDER_SUBTLE: 'var(--research-amber-border)',
        HOVER: 'hsl(34, 95%, 48%)',
    },
    // General borders
    BORDER: {
        VERY_SUBTLE: 'var(--research-border-very-subtle)',
        SUBTLE: 'var(--research-border-subtle)',
    },
    // Layout constants
    LAYOUT: {
        BUTTON_HEIGHT: '36.5px',
        CONTROLS_SPACING: 2.5,
        RESULT_CARD_HEIGHT: 480,
        INNER_PADDING: '1rem',
        INNER_PADDING_SM: '0.6rem 0.8rem',
        FONT_SIZE_XS: '0.75rem',
        FONT_SIZE_SM: '0.85rem',
        FONT_SIZE_MD: '0.95rem',
        CARD_RADIUS: '6px',
    },
    // Animations
    ANIMATIONS: {
        SPIN: {
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
            },
        },
    },
};
