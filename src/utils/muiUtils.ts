import { SxProps, Theme } from '@mui/material';

/** Normalizes SxProps to an array for safe spreading in MUI sx prop. */
export function toSxArray(sx: SxProps<Theme> | undefined): SxProps<Theme>[] {
    if (sx === undefined) return [];
    return (Array.isArray(sx) ? sx : [sx]) as SxProps<Theme>[];
}
