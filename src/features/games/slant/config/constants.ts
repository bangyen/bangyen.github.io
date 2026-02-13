export const MOBILE_PADDING = '30px';
export const DESKTOP_PADDING = '36px';
export const NUMBER_SIZE_RATIO = 0.4;

export const LAYOUT_CONSTANTS = {
    LINE_WIDTH: '130%',
    LINE_THICKNESS: '6px',
    CALCULATOR_BORDER_RADIUS: '24px',
    PADDING_OFFSET: 100,
    WIDTH_LIMIT: 1000,
    BOARD_MAX_WIDTH: 1200,
    BOARD_SIZE_FACTOR: 0.94,
    HEIGHT_OFFSET: 240,
    MAX_CELL_SIZE: 100,
    REM_BASE: 16,
    ICON_SIZE_RATIO: 0.8,
};

export const STORAGE_KEYS = {
    SIZE: 'slant-size',
    STATE: 'slant-state',
    GHOST_MOVES: 'slant-ghost-moves',
};

export const GAME_LOGIC_CONSTANTS = {
    HINT_DENSITY: 0, // 0 means remove as many clues as possible while remaining deductively solvable
    MIN_SIZE: 3,
    MAX_SIZE: 8,
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
        BORDER: 'var(--slant-ghost-border)',
        BG_SUBTLE: 'var(--slant-ghost-bg-subtle)',
        BG_HOVER: 'var(--slant-ghost-bg-hover)',
        DASHED_BORDER: 'var(--slant-ghost-dashed-border)',
        HINT_BG: 'var(--slant-ghost-hint-bg)',
        HINT_BORDER: 'var(--slant-ghost-hint-border)',
        HINT_TEXT: 'var(--slant-ghost-hint-text)',
        OVERLAY_LABEL: 'rgba(255, 255, 255, 0.5)',
        OVERLAY_BG: 'rgba(0, 0, 0, 0.3)',
    },
};
