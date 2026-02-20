import { AnimatePresence } from 'framer-motion';

import {
    OverlayContainer,
    TrophyCard,
    TrophyIcon,
    TrophyLabel,
} from './TrophyOverlay.styles';
import { overlayScalePop, overlayTransition } from '../config/animations';
import { GAME_TEXT } from '../config/constants';
import type { GAME_TOKENS, GameScalingVariant } from '../config/tokens';
import { useGameViewport } from '../hooks/useGameViewport';

export interface TrophyOverlayProps {
    /** Whether the win card is visible (default false). */
    show?: boolean;
    /** Whether to use a smaller size variant for info modals (default 'default'). */
    sizeVariant?: GameScalingVariant;
    /** Whether to show the "Solved!" label beneath the icon (default true). */
    showLabel?: boolean;
    /** Optional pre-calculated scaling data. */
    scaling?: (typeof GAME_TOKENS.scaling)[GameScalingVariant];
}

/**
 * Win-state overlay displayed over the game board when the puzzle is solved.
 * Shows a compact GlassCard with the trophy icon and a "Solved!" label as
 * a brief celebratory notification. The game auto-advances via useWinTransition,
 * so no explicit button is needed.
 */
export function TrophyOverlay({
    show = false,
    sizeVariant = 'default',
    showLabel = true,
    scaling: propScaling,
}: TrophyOverlayProps) {
    // Fallback to hook if scaling not provided (for backward compatibility/standalone use)
    const { scaling: hookScaling } = useGameViewport({ sizeVariant });
    const scaling = propScaling ?? hookScaling;

    return (
        <AnimatePresence>
            {show && (
                <OverlayContainer
                    {...overlayScalePop}
                    transition={overlayTransition}
                >
                    <TrophyCard
                        padding={scaling.padding}
                        size={scaling.containerSize}
                    >
                        <TrophyIcon fontSizeRem={scaling.iconSize} />
                        {showLabel && (
                            <TrophyLabel variant="h6">
                                {GAME_TEXT.trophy.solvedLabel}
                            </TrophyLabel>
                        )}
                    </TrophyCard>
                </OverlayContainer>
            )}
        </AnimatePresence>
    );
}
