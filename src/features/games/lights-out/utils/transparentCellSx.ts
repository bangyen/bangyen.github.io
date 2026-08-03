/**
 * MUI `sx` object produced by cell factories, with the pseudo-class
 * overrides that transparent-overlay consumers need to preserve.
 */
export interface CellSx {
    '&:hover'?: { color?: unknown };
    '&:focus-visible'?: { color?: unknown };
    [key: string]: unknown;
}

/**
 * Rewrites a cell factory's `sx` so the overlay cell is visually transparent
 * while keeping the hover / focus-visible colors that reveal the underlying
 * icon.  Falls back to a fully transparent cell for nullish input.
 */
export function mergeTransparentCellSx(rawSx: unknown): CellSx {
    if (rawSx === null || typeof rawSx !== 'object' || Array.isArray(rawSx)) {
        return {
            backgroundColor: 'transparent !important',
            color: 'transparent',
            '&:hover': { color: 'inherit' },
            '&:focus-visible': { color: 'inherit' },
        };
    }
    const sx = rawSx as CellSx;
    const hover = sx['&:hover'];
    const focusVisible = sx['&:focus-visible'];
    return {
        ...sx,
        backgroundColor: 'transparent !important',
        color: 'transparent',
        '&:hover': {
            ...hover,
            color: hover?.color ?? 'inherit',
        },
        '&:focus-visible': {
            ...focusVisible,
            color: focusVisible?.color ?? 'inherit',
        },
    };
}
