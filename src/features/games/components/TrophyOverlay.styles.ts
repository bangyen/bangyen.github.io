import { Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS } from '@/config/theme';

export const OverlayContainer = styled(motion.div)({
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
    pointerEvents: 'none',
});

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
    shouldForwardProp: prop => prop !== 'sizeRem',
})<{ sizeRem: string }>(({ theme, sizeRem }) => ({
    fontSize: sizeRem,
    color: theme.palette.primary.main,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
}));

export const TrophyLabel = styled(Typography)({
    color: COLORS.text.primary,
    fontWeight: 600,
    letterSpacing: '0.02em',
});
