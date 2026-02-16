/**
 * Extracted style constants for the Lights Out cell renderers.
 * Keeps the renderer functions focused on prop assembly.
 */

import type { SxProps, Theme } from '@mui/material';

/** Circular indicator dot centered inside each cell. */
export const iconSx: SxProps<Theme> = {
    width: '45%',
    height: '45%',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
};
