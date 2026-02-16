/**
 * Extracted style constants for the `SlantInfo` component.
 * Keeps the component file focused on structure and composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/** Layout wrapper around the calculator button in the instructions footer. */
export const calculatorFooterSx: SxProps<Theme> = {
    display: 'flex',
    px: 2,
    ml: { xs: 5, sm: 4 },
    pt: { xs: 0, sm: 3 },
    mt: { xs: -2, sm: 0 },
};

/** Styling for the "Open Calculator" button. */
export const calculatorButtonSx: SxProps<Theme> = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
};
