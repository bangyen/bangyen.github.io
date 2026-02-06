export const RESEARCH_STYLES = {
    // Glass/Transparency effects for scientific UI
    GLASS: {
        VERY_SUBTLE: 'rgba(255, 255, 255, 0.01)',
        SUBTLE: 'rgba(255, 255, 255, 0.02)',
        TRANSPARENT: 'rgba(255, 255, 255, 0.03)',
        SLIGHT: 'rgba(255, 255, 255, 0.05)',
        MEDIUM: 'rgba(255, 255, 255, 0.1)',
        STRONG: 'rgba(255, 255, 255, 0.2)',
        DARK: 'rgba(0, 0, 0, 0.2)',
    },
    // Cyan/Teal accents often used for "data" or "results"
    CYAN: {
        BG_SUBTLE: 'rgba(0, 184, 212, 0.05)',
        BG_SLIGHT: 'rgba(0, 184, 212, 0.1)',
        BORDER_SUBTLE: 'rgba(0, 184, 212, 0.1)',
        BORDER_SLIGHT: 'rgba(0, 184, 212, 0.2)',
    },
    // Green accents for success/proofs
    GREEN: {
        BG_SUBTLE: 'rgba(0, 200, 83, 0.05)',
        BORDER_SUBTLE: 'rgba(0, 200, 83, 0.1)',
        HOVER: 'hsl(141, 64%, 39%)',
    },
    // Amber accents for warnings/logic nodes
    AMBER: {
        BG_SUBTLE: 'rgba(255, 193, 7, 0.05)',
        BORDER_SUBTLE: 'rgba(255, 193, 7, 0.1)',
        HOVER: 'hsl(34, 95%, 48%)',
    },
    // General borders
    BORDER: {
        VERY_SUBTLE: 'rgba(255, 255, 255, 0.03)',
        SUBTLE: 'rgba(255, 255, 255, 0.05)',
    },
    // Layout constants
    LAYOUT: {
        BUTTON_HEIGHT: '36.5px',
        CONTROLS_SPACING: 2.5,
        RESULT_CARD_HEIGHT: 480,
        INNER_PADDING: '1rem',
        INNER_PADDING_SM: '0.6rem 0.8rem',
        FONT_SIZE_XS: '0.65rem',
        FONT_SIZE_SM: '0.75rem',
        FONT_SIZE_MD: '0.85rem',
        CARD_RADIUS: '6px',
    },
    // Animations
    ANIMATIONS: {
        SPIN: {
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
            },
        },
    },
};
