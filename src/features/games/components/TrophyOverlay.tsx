import { Box, Typography } from '@mui/material';
import React from 'react';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, SPACING } from '@/config/theme';

interface TrophyOverlayProps {
    /** Whether the win card is visible. */
    show: boolean;
    /** Callback to advance to the next puzzle (used by auto-advance hook). */
    onReset?: () => void;
    /** Board size in rem, used to scale the trophy icon. */
    size: number;
    /** Ratio applied to size for the icon font-size. */
    iconSizeRatio: number;
    /** Primary trophy color. */
    primaryColor?: string;
    /** Secondary trophy color (used when useSecondary is true). */
    secondaryColor?: string;
    /** Whether to use the secondary color for the trophy. */
    useSecondary?: boolean;
}

/**
 * Win-state overlay displayed over the game board when the puzzle is solved.
 * Shows a compact GlassCard with the trophy icon and a "Solved!" label as
 * a brief celebratory notification. The game auto-advances via useWinTransition,
 * so no explicit button is needed.
 */
export function TrophyOverlay({
    show,
    onReset: _onReset,
    size,
    iconSizeRatio,
    primaryColor,
    secondaryColor,
    useSecondary = false,
}: TrophyOverlayProps) {
    const activeColor = useSecondary ? secondaryColor : primaryColor;

    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: show ? 1 : 0,
                transform: show ? 'scale(1)' : 'scale(0.5)',
                visibility: show ? 'visible' : 'hidden',
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 10,
                backgroundColor: 'transparent',
                pointerEvents: 'none',
            }}
        >
            {size > 0 && (
                <GlassCard
                    padding={SPACING.padding.md}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1.5,
                        height: 'auto',
                        width: 'auto',
                        maxWidth: '80%',
                    }}
                >
                    <EmojiEventsRounded
                        sx={{
                            fontSize: `${(size * iconSizeRatio * 0.6).toString()}rem`,
                            color: activeColor,
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{
                            color: COLORS.text.primary,
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                        }}
                    >
                        Solved!
                    </Typography>
                </GlassCard>
            )}
        </Box>
    );
}
