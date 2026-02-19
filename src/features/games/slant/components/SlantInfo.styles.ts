/**
 * Extracted style constants for the `SlantInfo` component.
 * Keeps the component file focused on structure and composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/** Outer container for the example animation and buttons. */
export const exampleContainerSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'center',
    alignItems: 'center',
    gap: { xs: 2, sm: 4 },
    width: '100%',
    flex: 1,
};

/** Layout wrapper around buttons on the example slide. */
export const exampleActionsSx: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: '1fr' },
    gap: 1.5,
    justifyContent: 'center',
    justifyItems: 'center',
    alignItems: 'center',
    mt: { xs: 2, sm: 0 },
    width: { xs: '100%', sm: 'auto' },
    maxWidth: { xs: '320px', sm: 'none' },
};

/** Styling for buttons inside the info modal. */
export const infoButtonSx: SxProps<Theme> = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
    width: { xs: '140px', sm: '180px' },
    px: 1,
    '& .MuiButton-startIcon': {
        mr: { xs: 0.5, sm: 1 },
    },
};
