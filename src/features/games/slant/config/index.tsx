import { Box, type SxProps, type Theme } from '@mui/material';

import { LAYOUT_CONSTANTS, GAME_LOGIC_CONSTANTS } from './constants';
import { infoContentSx } from '../../components/GameInfo/GameInfo.styles';

import {
    TextureRounded,
    TagRounded,
    NotInterestedRounded,
} from '@/components/icons';
import { toSxArray } from '@/utils/muiUtils';

// ---------------------------------------------------------------------------
export * from './constants'; // eslint-disable-line react-refresh/only-export-components

const slashSx: SxProps<Theme> = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'primary.main',
    fontSize: '1em',
    borderRadius: 1,
    px: 0.6,
    lineHeight: 1,
    verticalAlign: 'baseline',
};

// ---------------------------------------------------------------------------
// Info modal content (previously inline in Slant.tsx)
// ---------------------------------------------------------------------------

export const SLANT_INFO_TITLES = ['Slant Rules', 'Example', 'Common Patterns'];

export const SLANT_INSTRUCTIONS = [
    {
        Icon: TextureRounded,
        title: 'Fill with Slashes',
        text: (
            <>
                Place a forward{' '}
                <Box component="span" sx={slashSx}>
                    <svg
                        viewBox="0 0 10 10"
                        style={{
                            width: '0.8em',
                            height: '0.8em',
                            stroke: 'currentColor',
                            strokeWidth: 1.5,
                            strokeLinecap: 'round',
                        }}
                    >
                        <line x1="1" y1="9" x2="9" y2="1" />
                    </svg>
                </Box>{' '}
                or backward{' '}
                <Box component="span" sx={slashSx}>
                    <svg
                        viewBox="0 0 10 10"
                        style={{
                            width: '0.8em',
                            height: '0.8em',
                            stroke: 'currentColor',
                            strokeWidth: 1.5,
                            strokeLinecap: 'round',
                        }}
                    >
                        <line x1="1" y1="1" x2="9" y2="9" />
                    </svg>
                </Box>{' '}
                slash in every cell of the grid.
            </>
        ),
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
 * Responsive board padding is resolved via callback so `useSlantGame` doesn't
 * need to call `useMobile()` separately (it's already called inside useBaseGame).
 *
 * This lives in its own module (rather than `constants.ts`) because
 * `constants.ts` is transitively imported by web workers, and the
 * `@/` path alias does not resolve inside the worker bundle.
 */
export function getSlantGameConfig() {
    return {
        storageKey: 'slant',
        grid: {
            defaultSize: GAME_LOGIC_CONSTANTS.DEFAULT_SIZE,
            maxSize: GAME_LOGIC_CONSTANTS.MAX_SIZE,
            gridPadding: {
                x: 80,
                y: 120,
            },
            widthLimit: LAYOUT_CONSTANTS.WIDTH_LIMIT,
            cellSizeReference: 4,
        },
        board: {
            boardPadding: (mobile: boolean) => ({
                x: mobile ? 48 : 80,
                y: LAYOUT_CONSTANTS.PADDING_OFFSET,
            }),
            maxCellSize: LAYOUT_CONSTANTS.MAX_CELL_SIZE,
            rowOffset: 1,
            colOffset: 1,
        },
    };
}
