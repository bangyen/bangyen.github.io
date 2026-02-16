import { Box, Typography } from '@mui/material';

import {
    getOverlayContainerSx,
    trophyCardSx,
    getTrophyIconSx,
    trophyLabelSx,
} from './TrophyOverlay.styles';
import { GAME_TEXT } from '../config/constants';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, SPACING } from '@/config/theme';

export interface TrophyOverlayProps {
    /** Whether the win card is visible (default false). */
    show?: boolean;
    /** Callback to advance to the next puzzle (used by auto-advance hook). */
    onReset?: () => void;
    /** Board size in rem, used to scale the trophy icon (default 0). */
    size?: number;
    /** Ratio applied to size for the icon font-size (default 1). */
    iconSizeRatio?: number;
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
    size = 0,
    iconSizeRatio = 1,
    primaryColor = COLORS.primary.main,
    secondaryColor = COLORS.primary.main,
    useSecondary = false,
    showLabel = true,
}: TrophyOverlayProps) {
    const activeColor = useSecondary ? secondaryColor : primaryColor;

    return (
        <Box sx={getOverlayContainerSx(show)}>
            {size > 0 && (
                <GlassCard padding={SPACING.padding.md} sx={trophyCardSx}>
                    <EmojiEventsRounded
                        sx={getTrophyIconSx(
                            `${(size * iconSizeRatio * 0.6).toString()}rem`,
                            activeColor,
                        )}
                    />
                    {showLabel && (
                        <Typography variant="h6" sx={trophyLabelSx}>
                            {GAME_TEXT.trophy.solvedLabel}
                        </Typography>
                    )}
                </GlassCard>
            )}
        </Box>
    );
}
