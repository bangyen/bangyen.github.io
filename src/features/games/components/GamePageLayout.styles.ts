/**
 * Extracted style constants for the `GamePageLayout` component.
 * Separates layout and board chrome styles so the component file
 * focuses on composition.
 */

import type { SxProps, Theme } from '@mui/material';

import { BOARD_STYLES } from '../config/constants';

import { toSxArray } from '@/utils/muiUtils';

/**
 * Returns the content area styles, merging caller overrides via
 * the `contentSx` array pattern used by MUI.
 */
export const getContentSx = (
    paddingBottom: string | object,
    contentSx: SxProps<Theme>,
): SxProps<Theme> =>
    [
        {
            flex: 1,
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            pb: paddingBottom,
        },
        ...toSxArray(contentSx),
    ] as SxProps<Theme>;

/**
 * Returns the board wrapper styles, merging caller overrides via
 * the `boardSx` array pattern.
 */
export const getBoardSx = (boardSx?: SxProps<Theme>): SxProps<Theme> =>
    [
        {
            position: 'relative',
            width: 'fit-content',
            userSelect: 'none',
            padding: {
                xs: BOARD_STYLES.PADDING.MOBILE,
                sm: BOARD_STYLES.PADDING.DESKTOP,
            },
            borderRadius: BOARD_STYLES.BORDER_RADIUS,
            border: BOARD_STYLES.BORDER,
        },
        ...toSxArray(boardSx),
    ] as SxProps<Theme>;
