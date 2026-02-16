/**
 * Extracted style helpers for `useSlantProps`.
 * Keeps the hook focused on prop shaping rather than style computation.
 */

import type { SxProps, Theme } from '@mui/material';

/** Returns responsive content padding based on the current breakpoint. */
export const getSlantContentSx = (mobile: boolean): SxProps<Theme> => ({
    px: mobile ? '1rem' : '2rem',
    pt: mobile ? '1rem' : '2rem',
});
