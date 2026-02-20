import { Box, Typography, styled } from '@mui/material';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS } from '@/config/theme';

export const OverlayContainer = styled(Box, {
    shouldForwardProp: prop => prop !== 'show',
})<{ show: boolean }>(({ show }) => ({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: show ? 1 : 0,
    transform: show ? 'scale(1)' : 'scale(0.5)',
    visibility: show ? 'visible' : 'hidden',
    transition: [
        'opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'visibility 0.5s step-start',
    ].join(', '),
    willChange: 'opacity, transform',
    backfaceVisibility: 'hidden',
    zIndex: 10,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
}));

export const TrophyCard = styled(GlassCard, {
    shouldForwardProp: prop => prop !== 'containerSize',
})<{ containerSize: string }>(({ theme, containerSize }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    maxWidth: '80%',
    width: containerSize,
    height: containerSize,
}));

export const TrophyIcon = styled(EmojiEventsRounded, {
    shouldForwardProp: prop => prop !== 'sizeRem' && prop !== 'customColor',
})<{ sizeRem: string; customColor: string }>(({ sizeRem, customColor }) => ({
    fontSize: sizeRem,
    color: customColor,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
}));

export const TrophyLabel = styled(Typography)({
    color: COLORS.text.primary,
    fontWeight: 600,
    letterSpacing: '0.02em',
});
