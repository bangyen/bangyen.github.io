import { useMobile } from '@/hooks';

export interface ViewportConfig {
    sizeVariant?: 'default' | 'small';
}

export interface GameViewport {
    isMobile: boolean;
    scaling: {
        iconSize: string;
        containerSize: string;
        padding: number;
    };
}

/**
 * Centralized hook for game-related viewport and responsive logic.
 * Decouples layout calculations from presentational components.
 */
export function useGameViewport(config: ViewportConfig = {}): GameViewport {
    const isMobile = useMobile('sm');
    const { sizeVariant = 'default' } = config;

    const isSmall = sizeVariant === 'small' || isMobile;

    return {
        isMobile,
        scaling: {
            iconSize: isSmall ? '2rem' : '3rem',
            containerSize: isSmall ? '6rem' : '9rem',
            padding: isSmall ? 1 : 2,
        },
    };
}
