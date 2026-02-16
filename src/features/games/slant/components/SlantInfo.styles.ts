/**
 * Extracted style constants for the `SlantInfo` component.
 * Keeps the component file focused on structure and composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/** Layout wrapper around the analysis button in the instructions footer. */
export const analysisFooterSx: SxProps<Theme> = {
    display: 'flex',
    px: 2,
    ml: { xs: 5, sm: 4 },
    pt: { xs: 0, sm: 3 },
    mt: { xs: -2, sm: 0 },
};

/** Styling for the "Open Analysis" button. */
export const analysisButtonSx: SxProps<Theme> = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
};
