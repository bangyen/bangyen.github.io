/**
 * Centralized design tokens for game-specific scaling and layout.
 * These tokens ensure consistency across different games and components.
 */
export const GAME_TOKENS = {
    scaling: {
        default: {
            iconSize: '3rem',
            containerSize: '9rem',
            padding: 2,
        },
        small: {
            iconSize: '2rem',
            containerSize: '6rem',
            padding: 1,
        },
    },
} as const;

export type GameScalingVariant = keyof typeof GAME_TOKENS.scaling;
