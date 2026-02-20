/**
 * Extracted style constants for the TrophyOverlay component.
 * Separates layout and animation styles so the component file
 * focuses on composition and rendering logic.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

/** Full-overlay container that fades/scales in when the puzzle is solved. */
export const getOverlayContainerSx = (show: boolean): SxProps<Theme> => ({
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
});

/** GlassCard wrapper for the trophy icon and label. */
export const trophyCardSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    maxWidth: '80%',
};

/** Trophy icon styling with dynamic size and color. */
export const getTrophyIconSx = (
    sizeRem: string,
    color: string,
): SxProps<Theme> => ({
    fontSize: sizeRem,
    color,
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
});

/** "Solved!" label beneath the trophy icon. */
export const trophyLabelSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontWeight: 600,
    letterSpacing: '0.02em',
};
