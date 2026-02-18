/**
 * Extracted style constants for the `SlantInfo` component.
 * Keeps the component file focused on structure and composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/** Layout wrapper around buttons on the example slide. */
export const exampleActionsSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
    mt: 2,
    width: '100%',
};

/** Styling for buttons inside the info modal. */
export const infoButtonSx: SxProps<Theme> = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
    width: { xs: '200px', sm: '180px' },
};
