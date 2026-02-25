import { Typography, styled } from '@mui/material';
import React from 'react';

import { GAME_TEXT } from '../config/constants';
import type { GameScalingVariant } from '../config/tokens';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS } from '@/config/theme';

const OverlayContainer = styled('div', {
    shouldForwardProp: prop => prop !== 'show',
})<{ show: boolean }>(({ theme, show }) => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.modal,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    opacity: show ? 1 : 0,
    transform: show ? 'scale(1)' : 'scale(0.8)',
    transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter,
        easing: theme.transitions.easing.easeOut,
    }),
    visibility: show ? 'visible' : 'hidden',
    willChange: 'transform, opacity',
}));

const TrophyCard = styled(GlassCard, {
    shouldForwardProp: prop => prop !== 'size',
})<{ size: string }>(({ theme, size }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    maxWidth: '80%',
    width: size,
    height: size,
}));

const TrophyIcon = styled(EmojiEventsRounded, {
    shouldForwardProp: prop => prop !== 'fontSizeRem',
})<{ fontSizeRem: string }>(({ theme, fontSizeRem }) => ({
    fontSize: fontSizeRem,
    color: theme.palette.primary.main,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
}));

const TrophyLabel = styled(Typography)({
    color: COLORS.text.primary,
    fontWeight: 600,
    letterSpacing: '0.02em',
});

export interface TrophyOverlayProps {
    /** Whether the win card is visible (default false). */
    show?: boolean;
    /** Whether to use a smaller size variant for info modals (default 'default'). */
    sizeVariant?: GameScalingVariant;
    /** Whether to show the "Solved!" label beneath the icon (default true). */
    showLabel?: boolean;
    /** Required pre-calculated scaling data. */
    scaling: {
        iconSize: string;
        containerSize: string;
        padding: number;
    };
}

/**
 * Win-state overlay displayed over the game board when the puzzle is solved.
 * Shows a compact GlassCard with the trophy icon and a "Solved!" label as
 * a brief celebratory notification. The game auto-advances via useWinTransition,
 * so no explicit button is needed.
 */
export function TrophyOverlay({
    show = false,
    showLabel = true,
    scaling,
}: TrophyOverlayProps) {
    return (
        <OverlayContainer show={show}>
            <TrophyCard padding={scaling.padding} size={scaling.containerSize}>
                <TrophyIcon fontSizeRem={scaling.iconSize} />
                {showLabel && (
                    <TrophyLabel variant="h6">
                        {GAME_TEXT.trophy.solvedLabel}
                    </TrophyLabel>
                )}
            </TrophyCard>
        </OverlayContainer>
    );
}
