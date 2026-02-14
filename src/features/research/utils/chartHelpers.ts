/**
 * Shared helpers for building chart-config fragments so every research
 * page declares only the parts that differ (padding value, axis label
 * prefix) instead of duplicating the full string-template boilerplate.
 */

/**
 * Produces a Recharts-style y-axis domain that pads symmetrically
 * around the data extent, avoiding repeated template-string construction.
 */
export const buildAxisDomain = (padding: number | string): string[] => [
    `dataMin - ${String(padding)}`,
    `dataMax + ${String(padding)}`,
];

/**
 * Returns a tooltip label formatter that prepends a human-readable
 * prefix (e.g. "Epoch", "Round") to the x-axis value.
 */
export const buildTooltipLabelFormatter =
    (prefix: string) =>
    (value: number): string =>
        `${prefix} ${value.toString()}`;
