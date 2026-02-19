import type { SxProps, Theme } from '@mui/material';

import { LAYOUT_CONSTANTS, GAME_LOGIC_CONSTANTS } from './constants';
import { infoContentSx } from '../../components/GameInfo/GameInfo.styles';

import {
    TextureRounded,
    TagRounded,
    NotInterestedRounded,
} from '@/components/icons';
import { toSxArray } from '@/utils/muiUtils';

// ---------------------------------------------------------------------------
// Re-export constants for convenient single-import access
// ---------------------------------------------------------------------------

export * from './constants';

// ---------------------------------------------------------------------------
// Info modal content (previously inline in Slant.tsx)
// ---------------------------------------------------------------------------

export const SLANT_INFO_TITLES = ['Slant Rules', 'Example', 'Common Patterns'];

export const SLANT_INSTRUCTIONS = [
    {
        Icon: TextureRounded,
        title: 'Fill with Slashes',
        text: String.raw`Place a forward (/) or backward (\) slash in every cell of the grid.`,
    },
    {
        Icon: TagRounded,
        title: 'Match the Numbers',
        text: 'Each number at a corner tells how many slashes touch that point.',
    },
    {
        Icon: NotInterestedRounded,
        title: 'No Loops',
        text: 'Slashes must never form a closed loop — every path stays open.',
    },
];

export const SLANT_INFO_CARD_SX: SxProps<Theme> = {
    height: { xs: '660px', sm: '525px' },
    minHeight: { xs: '660px', sm: '525px' },
};

/** Content-area sx with overflow hidden for the animated example. */
export const slantInfoContentSx = (step: number): SxProps<Theme> =>
    [
        ...toSxArray(infoContentSx(step)),
        step < 2 ? { overflowY: 'hidden' } : {},
    ] as SxProps<Theme>;

// ---------------------------------------------------------------------------
// useBaseGame configuration
// ---------------------------------------------------------------------------

/**
 * Returns the `useBaseGame` configuration for Slant.
 * Accepts `mobile` so responsive padding offsets and the optional
 * board-size factor are resolved here instead of in the page component.
 *
 * This lives in its own module (rather than `constants.ts`) because
 * `constants.ts` is transitively imported by web workers, and the
 * `@/` path alias does not resolve inside the worker bundle.
 */
export function getSlantGameConfig(mobile: boolean) {
    return {
        storageKey: 'slant',
        grid: {
            defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
            maxSize: GAME_LOGIC_CONSTANTS.MAX_SIZE,
            gridPadding: {
                x: mobile ? 48 : 80,
                y: 120,
            },
            widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
            cellSizeReference: 4,
        },
        board: {
            boardPadding: (isMobile: boolean) => ({
                x: isMobile ? 48 : 80,
                y: LAYOUT_CONSTANTS.PADDING_OFFSET,
            }),
            ...(mobile ? { boardSizeFactor: 0.92 } : {}),
            maxCellSize: LAYOUT_CONSTANTS.MAX_CELL_SIZE,
            rowOffset: 1,
            colOffset: 1,
        },
    };
}
