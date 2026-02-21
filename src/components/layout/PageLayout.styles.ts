import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/**
 * Base styles for the outermost page wrapper.
 *
 * Accepts an optional background colour and additional consumer-supplied
 * `containerSx` overrides that are spread after the base styles.
 */
export const getContainerSx = (
    background: string = COLORS.surface.background,
    containerSx: SxProps<Theme> = {},
): SxProps<Theme> =>
    [
        {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background,
            position: 'relative',
            overflow: 'hidden',
        },
        containerSx,
    ] as SxProps<Theme>;

/**
 * Base styles for the `<main>` content area inside the page layout.
 *
 * Consumer-supplied `sx` overrides are spread after the base styles.
 */
export const getMainSx = (sx: SxProps<Theme> = {}): SxProps<Theme> =>
    [
        {
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            position: 'relative',
        },
        sx,
    ] as SxProps<Theme>;
