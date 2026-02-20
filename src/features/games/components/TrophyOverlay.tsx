import { AnimatePresence } from 'framer-motion';

import {
    OverlayContainer,
    TrophyCard,
    TrophyIcon,
    TrophyLabel,
} from './TrophyOverlay.styles';
import { GAME_TEXT } from '../config/constants';
import { useGameViewport } from '../hooks/useGameViewport';

export interface TrophyOverlayProps {
    /** Whether the win card is visible (default false). */
    show?: boolean;
    /** Whether to use a smaller size variant for info modals (default 'default'). */
    sizeVariant?: 'default' | 'small';
    /** Whether to show the "Solved!" label beneath the icon (default true). */
    showLabel?: boolean;
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
}: TrophyOverlayProps) {
    const { scaling } = useGameViewport({ sizeVariant });

    return (
        <AnimatePresence>
            {show && (
                <OverlayContainer
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                        scale: {
                            type: 'spring',
                            damping: 20,
                            stiffness: 300,
                        },
                        opacity: {
                            duration: 0.4,
                            ease: 'easeOut',
                        },
                    }}
                >
                    <TrophyCard
                        padding={scaling.padding}
                        containerSize={scaling.containerSize}
                    >
                        <TrophyIcon sizeRem={scaling.iconSize} />
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
