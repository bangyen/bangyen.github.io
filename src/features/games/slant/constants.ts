export const MOBILE_PADDING = '32px';
export const DESKTOP_PADDING = '48px';
export const NUMBER_SIZE_RATIO = 0.4;

export const TIMING_CONSTANTS = {
    WIN_ANIMATION_DELAY: 2000,
    INTERACTION_DELAY: 500,
    AUTO_PLAY_SPEED: 300,
    TOUCH_HOLD_DELAY: 500,
};

export const LAYOUT_CONSTANTS = {
    LINE_WIDTH: '130%',
    LINE_THICKNESS: '6px',
    CALCULATOR_BORDER_RADIUS: '24px',
    HEADER_OFFSET: {
        MOBILE: 64,
        DESKTOP: 80,
    },
    PADDING_OFFSET: 100,
    WIDTH_LIMIT: 1000,
    BOARD_MAX_WIDTH: 1200,
    BOARD_SIZE_FACTOR: 0.95,
    HEIGHT_OFFSET: 160,
    MAX_CELL_SIZE: 100,
    REM_BASE: 16,
};

export const STORAGE_KEYS = {
    SIZE: 'slant-size',
    STATE: 'slant-state',
    GHOST_MOVES: 'slant-ghost-moves',
};

export const GAME_LOGIC_CONSTANTS = {
    HINT_DENSITY: 0.35,
    MIN_SIZE: 3,
    MAX_SIZE: 10,
    DEFAULT_SIZE: 5,
    PUZZLE_GENERATION_ITERATIONS: 30,
};

export const SLANT_STYLES = {
    COLORS: {
        WHITE: '#fff',
    },
    SHADOWS: {
        LINE: '0 2px 4px rgba(0,0,0,0.2)',
        HINT: '0 4px 8px rgba(0,0,0,0.1)',
    },
    GHOST: {
        BORDER: 'rgba(255, 255, 255, 0.1)',
        BG_SUBTLE: 'rgba(255, 255, 255, 0.02)',
        BG_HOVER: 'rgba(255, 255, 255, 0.1)',
        DASHED_BORDER: 'rgba(255, 255, 255, 0.2)',
        HINT_BG: 'hsl(217, 50%, 8%)',
        HINT_BORDER: 'rgba(255, 255, 255, 0.3)',
        OVERLAY_LABEL: 'rgba(255, 255, 255, 0.5)',
        OVERLAY_BG: 'rgba(0, 0, 0, 0.3)',
    },
};
