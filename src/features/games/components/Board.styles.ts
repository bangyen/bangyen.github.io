/**
 * Extracted style constants for the `Board` component.
 * Keeps the component file focused on structure and composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { LAYOUT } from '@/config/theme';

/** Container that stacks both grid layers on top of each other. */
export const boardContainerSx: SxProps<Theme> = {
    display: 'grid',
    placeItems: 'center',
};

/** Base styles for the cell (bottom) layer. */
export const cellLayerBaseSx: SxProps<Theme> = {
    gridArea: '1/1',
};

/** Base styles for the overlay (top) layer. */
export const overlayLayerBaseSx: SxProps<Theme> = {
    gridArea: '1/1',
    zIndex: LAYOUT.zIndex.base + 1,
};
