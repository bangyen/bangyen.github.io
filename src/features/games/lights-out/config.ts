import { BOARD_STYLES, createStorageKeys } from '../config/constants';

import { KeyboardArrowDown, Calculate, Replay } from '@/components/icons';
import { LAYOUT } from '@/config/theme';

export const LIGHTS_OUT_STYLES = {
    TRANSITION: {
        FAST: 'background-color 100ms ease-in-out, color 100ms ease-in-out, opacity 100ms ease-in-out, border-radius 100ms ease-in-out',
        DEFAULT:
            'background-color 200ms ease, color 200ms ease, opacity 200ms ease, border-radius 200ms ease',
    },
    SHADOWS: {
        DROP: BOARD_STYLES.DROP_SHADOW,
    },
};

export const LAYOUT_CONSTANTS = {
    ICON_SIZE_RATIO: 1.25,
    OFFSET: {
        MOBILE: -28,
        DESKTOP: -40,
    },
};

export const STORAGE_KEYS = createStorageKeys('lights-out');

// ---------------------------------------------------------------------------
// Info modal content (previously inline in Info.tsx)
// ---------------------------------------------------------------------------

export const INFO_TITLES = ['Chasing Lights', 'How It Works', 'Calculator'];

export const INSTRUCTIONS = [
    {
        Icon: KeyboardArrowDown,
        title: 'Chase to Bottom',
        text: 'Turn off rows from top to bottom by clicking lights in each row to push them down.',
    },
    {
        Icon: Calculate,
        title: 'Use Calulator',
        text: 'Enter the remaining lights pattern from the bottom row into the calculator on the last page.',
    },
    {
        Icon: Replay,
        title: 'Chase Again',
        text: 'Apply the solution pattern to the top row, then chase them down again to solve the puzzle.',
    },
];

/** Example grid size constants for the info modal. */
export const EXAMPLE_SIZE = {
    MOBILE: 3,
    DESKTOP: 4,
} as const;

/**
 * Returns the `useBaseGame` configuration for Lights Out.
 * Note: responsive board padding (which depends on mobile state computed
 * in useBaseGame) should be inlined directly in the game hook or config.
 */
export function getLightsOutGameConfig() {
    return {
        storageKey: 'lights-out',
        grid: {
            maxSize: 10,
            headerOffset: {
                mobile: LAYOUT.headerHeight.xs,
                desktop: LAYOUT.headerHeight.md,
            },
            gridPadding: {
                x: 80,
                y: 60,
            },
        },
        board: {
            boardPadding: (mobile: boolean) => ({
                x: mobile ? 40 : 120,
                y: mobile ? 120 : 160,
            }),
            maxCellSize: 80,
        },
    };
}
