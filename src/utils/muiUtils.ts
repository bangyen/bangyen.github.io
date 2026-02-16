import type { SxProps, Theme } from '@mui/material';

/** Normalizes SxProps to an array for safe spreading in MUI sx prop. */
export function toSxArray(sx: SxProps<Theme> | undefined): SxProps<Theme>[] {
    if (sx === undefined) return [];
    return (Array.isArray(sx) ? sx : [sx]) as SxProps<Theme>[];
}

/**
 * Safely casts an `SxProps<Theme>` value into a plain object so it can
 * be spread inside an `sx` object literal.  Centralises the type escape
 * hatch that would otherwise be repeated at every call-site.
 */
export const spreadSx = (sx?: SxProps<Theme>): Record<string, unknown> =>
    (sx as Record<string, unknown> | undefined) ?? {};
