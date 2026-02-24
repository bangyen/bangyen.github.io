import { Typography, styled } from '@mui/material';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS } from '@/config/theme';

export const OverlayContainer = styled('div', {
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

export const TrophyCard = styled(GlassCard, {
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

export const TrophyIcon = styled(EmojiEventsRounded, {
    shouldForwardProp: prop => prop !== 'fontSizeRem',
})<{ fontSizeRem: string }>(({ theme, fontSizeRem }) => ({
    fontSize: fontSizeRem,
    color: theme.palette.primary.main,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
}));

export const TrophyLabel = styled(Typography)({
    color: COLORS.text.primary,
    fontWeight: 600,
    letterSpacing: '0.02em',
});
