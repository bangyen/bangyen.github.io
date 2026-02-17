import { BOARD_STYLES, createStorageKeys } from '../../config/constants';

export const NUMBER_SIZE_RATIO = 0.4;

export const LAYOUT_CONSTANTS = {
    LINE_WIDTH: '130%',
    LINE_THICKNESS: '6px',
    PADDING_OFFSET: 100,
    WIDTH_LIMIT: 1000,
    MAX_CELL_SIZE: 100,
    ICON_SIZE_RATIO: 0.8,
};

export const STORAGE_KEYS = {
    ...createStorageKeys('slant'),
    ANALYSIS_MOVES: 'slant-analysis-moves',
} as const;

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
        LINE: BOARD_STYLES.SHADOW,
        HINT: '0 4px 8px rgba(0,0,0,0.1)',
    },
    ANALYSIS: {
        BORDER: 'var(--slant-analysis-border)',
        BG_SUBTLE: 'var(--slant-analysis-bg-subtle)',
        BG_HOVER: 'var(--slant-analysis-bg-hover)',
        DASHED_BORDER: 'var(--slant-analysis-dashed-border)',
        HINT_BG: 'var(--slant-analysis-hint-bg)',
        HINT_BORDER: 'var(--slant-analysis-hint-border)',
        HINT_TEXT: 'var(--slant-analysis-hint-text)',
        OVERLAY_LABEL: 'rgba(255, 255, 255, 0.5)',
        OVERLAY_BG: 'rgba(0, 0, 0, 0.3)',
    },
    ANIMATIONS: {
        POP_IN: `
            @keyframes slant-pop-in {
                0% { transform: var(--slant-base-transform) scale(0.5); opacity: 0; }
                70% { transform: var(--slant-base-transform) scale(1.1); opacity: 1; }
                100% { transform: var(--slant-base-transform) scale(1); opacity: 1; }
            }
        `,
        POP_IN_STYLE:
            'slant-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
    },
};
