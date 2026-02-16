/**
 * Extracted style constants for the Recharts line chart rendered by
 * `ResearchChart`. Kept separate so the component file focuses on
 * structure and the styles can be tweaked independently.
 */

import type { SxProps, Theme } from '@mui/material';
import type { CSSProperties } from 'react';

import { CHART_DIMENSIONS } from '../config';

import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

/** Outer GlassCard wrapper for the chart area. */
export const chartCardSx: SxProps<Theme> = {
    marginBottom: 3,
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
};

/** Chart title above the graph. */
export const chartTitleSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    fontSize: TYPOGRAPHY.fontSize.subheading,
};

/** Container that holds the chart or loading placeholder. */
export const chartContainerSx: SxProps<Theme> = {
    height: CHART_DIMENSIONS.height,
    width: '100%',
    position: 'relative',
};

/** Centred placeholder shown while data loads. */
export const loadingBoxSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: COLORS.text.secondary,
};

/** Shared tick style for both axes. */
export const axisTickStyle = {
    fill: COLORS.text.secondary,
    fontSize: 10,
} as const;

/** X-axis line style. */
export const xAxisLineStyle = {
    stroke: COLORS.border.subtle,
} as const;

/** Recharts tooltip `contentStyle` — the glass card around the tooltip. */
export const tooltipContentStyle: CSSProperties = {
    backgroundColor: COLORS.surface.glass,
    backdropFilter: 'blur(8px) saturate(180%)',
    border: `1px solid ${COLORS.border.subtle}`,
    borderRadius: SPACING.borderRadius.md,
    color: COLORS.text.primary,
    boxShadow: 'none',
};

/** Recharts tooltip `itemStyle` — each data row inside the tooltip. */
export const tooltipItemStyle: CSSProperties = {
    fontSize: '12px',
    padding: '2px 0',
};

/** Recharts tooltip `labelStyle` — the header label inside the tooltip. */
export const tooltipLabelStyle: CSSProperties = {
    fontWeight: 'bold',
    marginBottom: '4px',
    color: COLORS.text.primary,
};
