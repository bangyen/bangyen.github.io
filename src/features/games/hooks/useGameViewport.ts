import { GAME_TOKENS, type GameScalingVariant } from '../config/tokens';

import { useMobile } from '@/hooks';

export interface ViewportConfig {
    /** Explicit size variant override. Defaults to 'default'. */
    sizeVariant?: GameScalingVariant;
}

export interface GameViewport {
    /** Whether the viewport is currently at a mobile breakpoint. */
    isMobile: boolean;
    /** Scaling tokens for the current viewport and variant. */
    scaling: (typeof GAME_TOKENS.scaling)[GameScalingVariant];
}

/**
 * Centralized hook for game-related viewport and responsive logic.
 * Decouples layout calculations from presentational components by
 * resolving abstract variants into concrete design tokens.
 */
export function useGameViewport(config: ViewportConfig = {}): GameViewport {
    const isMobile = useMobile('sm');
    const { sizeVariant = 'default' } = config;

    // 'small' variant is forced on mobile regardless of config,
    // unless we want to allow explicit overrides to 'default' on mobile (rare).
    const resolvedVariant: GameScalingVariant =
        sizeVariant === 'small' || isMobile ? 'small' : 'default';

    return {
        isMobile,
        scaling: GAME_TOKENS.scaling[resolvedVariant],
    };
}
