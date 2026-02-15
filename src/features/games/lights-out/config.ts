import { BOARD_STYLES, createStorageKeys } from '../config/constants';

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

/**
 * Returns the `useBaseGame` configuration for Lights Out.
 * Accepts `mobile` so responsive padding offsets are resolved here
 * instead of cluttering the page component.
 */
export function getLightsOutGameConfig(mobile: boolean) {
    return {
        storageKey: 'lights-out',
        grid: {
            maxSize: 10,
            headerOffset: {
                mobile: LAYOUT.headerHeight.xs,
                desktop: LAYOUT.headerHeight.md,
            },
            gridPadding: {
                x: mobile ? 60 : 80,
                y: 60,
            },
        },
        board: {
            boardPadding: {
                x: mobile ? 40 : 120,
                y: mobile ? 120 : 160,
            },
            maxCellSize: 80,
        },
    };
}
