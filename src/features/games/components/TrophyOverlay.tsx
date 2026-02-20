import {
    OverlayContainer,
    TrophyCard,
    TrophyIcon,
    TrophyLabel,
} from './TrophyOverlay.styles';
import { GAME_TEXT } from '../config/constants';

import { COLORS, SPACING } from '@/config/theme';

export interface TrophyOverlayProps {
    /** Whether the win card is visible (default false). */
    show?: boolean;
    /** Callback to advance to the next puzzle (used by auto-advance hook). */
    onReset?: () => void;
    /** Whether to use a smaller size variant for info modals (default 'default'). */
    sizeVariant?: 'default' | 'small';
    /** Primary trophy color (default COLORS.primary.main). */
    primaryColor?: string;
    /** Secondary trophy color (used when useSecondary is true, default COLORS.primary.main). */
    secondaryColor?: string;
    /** Whether to use the secondary color for the trophy. */
    useSecondary?: boolean;
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
    onReset: _onReset,
    sizeVariant = 'default',
    primaryColor = COLORS.primary.main,
    secondaryColor = COLORS.primary.main,
    useSecondary = false,
    showLabel = true,
}: TrophyOverlayProps) {
    const activeColor = useSecondary ? secondaryColor : primaryColor;
    const isShow = show;

    // Scale with screen size using viewport units (vmin) rather than board size.
    // Bounded by rem values to ensure it remains legible on tiny screens
    // and doesn't become grotesquely large on huge desktop monitors.
    const iconSize = sizeVariant === 'small' ? '2rem' : '3rem';
    const containerSize = sizeVariant === 'small' ? '5rem' : '9rem';

    return (
        <OverlayContainer show={isShow}>
            <TrophyCard
                padding={SPACING.padding.md}
                containerSize={containerSize}
            >
                <TrophyIcon sizeRem={iconSize} customColor={activeColor} />
                {showLabel && (
                    <TrophyLabel variant="h6">
                        {GAME_TEXT.trophy.solvedLabel}
                    </TrophyLabel>
                )}
            </TrophyCard>
        </OverlayContainer>
    );
}
