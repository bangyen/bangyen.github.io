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

export const GRID_CONFIG = {
    cellSize: {
        divisor: 4,
        fontSizeMultiplier: 0.375,
    },
};

export function getSpace(size: number): string {
    return `${(size * GRID_CONFIG.cellSize.divisor).toString()}px`;
}

/** Shared board styling constants used by all game pages. */
export const BOARD_STYLES = {
    PADDING: { MOBILE: '30px', DESKTOP: '36px' },
    BORDER_RADIUS: '24px',
    BORDER: '2px solid transparent',
    SHADOW: '0 2px 4px rgba(0,0,0,0.2)',
};

export const PAGE_TITLES = {
    lightsOut: 'Lights Out | Bangyen',
    slant: 'Slant | Bangyen',
};
