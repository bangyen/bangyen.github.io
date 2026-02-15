export const GAME_CONSTANTS = {
    gridSizes: {
        mobile: 2.5,
        desktop: 4,
    },
    controls: {
        arrowPrefix: 'arrow',
    },
    timing: {
        winAnimationDelay: 2000,
        interactionDelay: 500,
        autoPlaySpeed: 300,
        touchHoldDelay: 500,
    },
    layout: {
        headerHeight: {
            mobile: 64,
            desktop: 80,
        },
    },
};

// Re-export from shared config so existing feature-level imports keep working.
// Uses a relative path (not @/ alias) because this module is transitively
// imported by web-worker entry points whose Rollup build lacks the alias.
export { GRID_CONFIG, getSpace } from '../../../config/theme/spacing';

/** Shared board styling constants used by all game pages. */
export const BOARD_STYLES = {
    PADDING: { MOBILE: '30px', DESKTOP: '36px' },
    BORDER_RADIUS: '24px',
    BORDER: '2px solid transparent',
    SHADOW: '0 2px 4px rgba(0,0,0,0.2)',
    DROP_SHADOW: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
};

/**
 * Build the standard `SIZE` / `STATE` localStorage keys for a game.
 * Games that need extra keys can spread the result and add them.
 */
export function createStorageKeys(prefix: string) {
    return { SIZE: `${prefix}-size`, STATE: `${prefix}-state` } as const;
}

/**
 * Sensible defaults for board rendering in `useBaseGame`.
 * Games only need to specify fields that differ from these values.
 */
export const DEFAULT_BOARD_CONFIG = {
    paddingOffset: 0 as number | { x: number; y: number },
    boardMaxWidth: 1200,
    boardSizeFactor: 0.94,
    maxCellSize: 80,
    remBase: 16,
};

/**
 * Sensible defaults for grid sizing in `useBaseGame`.
 * Games only need to specify fields that differ from these values.
 */
export const DEFAULT_GRID_CONFIG = {
    defaultSize: null as number | null,
    minSize: 3,
    maxSize: 10,
    mobileRowOffset: 2,
    headerOffset: GAME_CONSTANTS.layout.headerHeight,
    paddingOffset: 0 as number | { x: number; y: number },
    widthLimit: 1300,
    cellSizeReference: {
        mobile: GAME_CONSTANTS.gridSizes.mobile,
        desktop: GAME_CONSTANTS.gridSizes.desktop,
    } as number | { mobile: number; desktop: number },
};
