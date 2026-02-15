/**
 * Shared style helper for the GameInfo modal's scrollable content area.
 * Kept in a separate module so game-specific config files (e.g. Slant)
 * can compose overrides without importing from a component file, which
 * would trigger the react-refresh/only-export-components lint rule.
 */

import type { SxProps, Theme } from '@mui/material';

/** Scrollable content area wrapping steps. */
export const infoContentSx = (step: number): SxProps<Theme> => ({
    flex: 1,
    overflowY: step === 1 ? 'hidden' : 'auto',
    p: { xs: 2.5, md: 3 },
    display: 'flex',
    flexDirection: 'column',
});
