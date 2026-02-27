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
        standardTransition: '150ms ease-in-out',
    },
    animations: {
        celebration: {
            duration: '0.3s',
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            keyframes: `
                @keyframes shared-pop-in {
                    0% { opacity: 0; transform: scale(0.5); }
                    70% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `,
        },
    },
    layout: {
        headerHeight: {
            mobile: 64,
            desktop: 80,
        },
    },
};

/**
 * Shared user-facing text used across game features.
 * Centralises copy to avoid duplication and make updates easier.
 */
export const GAME_TEXT = {
    info: {
        loading: 'Loading info...',
        loadError: 'Failed to load info panel.',
    },
    trophy: {
        solvedLabel: 'Solved!',
    },
    errors: {
        boardTitle: 'Board Error',
        boardReset: 'Reset Board',
    },
} as const;

/** Default bottom padding for the game content area. */
export const DEFAULT_CONTENT_PADDING = {
    xs: '80px',
    md: '120px',
} as const;

/** Shared board styling constants used by all game pages. */
export const BOARD_STYLES = {
    PADDING: { MOBILE: '30px', DESKTOP: '36px' },
    BORDER_RADIUS: '24px',
    BORDER: '2px solid transparent',
    SHADOW: '0 4px 12px rgba(0,0,0,0.15)',
    DROP_SHADOW: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
    TRANSITION: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
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
    boardPadding: 0 as number | { x: number; y: number },
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
    gridPadding: 0 as number | { x: number; y: number },
    widthLimit: 1300,
    cellSizeReference: {
        mobile: GAME_CONSTANTS.gridSizes.mobile,
        desktop: GAME_CONSTANTS.gridSizes.desktop,
    } as number | { mobile: number; desktop: number },
};
