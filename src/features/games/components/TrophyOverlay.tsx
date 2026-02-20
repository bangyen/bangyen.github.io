import { Box, Typography, styled } from '@mui/material';

import { GAME_TEXT } from '../config/constants';
import { useOptionalGameState } from '../hooks/useGameContext';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
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

const OverlayContainer = styled(Box, {
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

const TrophyCard = styled(GlassCard, {
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

const TrophyIcon = styled(EmojiEventsRounded, {
    shouldForwardProp: prop => prop !== 'sizeRem' && prop !== 'customColor',
})<{ sizeRem: string; customColor: string }>(({ sizeRem, customColor }) => ({
    fontSize: sizeRem,
    color: customColor,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
}));

const TrophyLabel = styled(Typography)({
    color: COLORS.text.primary,
    fontWeight: 600,
    letterSpacing: '0.02em',
});

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
    const state = useOptionalGameState();
    const activeColor = useSecondary ? secondaryColor : primaryColor;
    const isShow = show || state?.solved || false;

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
