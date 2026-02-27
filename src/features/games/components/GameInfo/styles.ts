import type { SxProps, Theme } from '@mui/material';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Backdrop blur + tinted overlay for the Info modal. */
export const infoBackdropSx: SxProps<Theme> = {
    backgroundColor: (theme: Theme) =>
        theme.palette.mode === 'dark'
            ? 'hsla(0, 0%, 3%, 0.85)'
            : 'hsla(0, 0%, 98%, 0.85)',
    backdropFilter: 'blur(12px) saturate(180%)',
    transition: 'all 0.3s ease-in-out !important',
};

/** Root Modal positioning. */
export const infoModalSx: SxProps<Theme> = {
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

/** Outer wrapper that centres the GlassCard within the modal. */
export const infoOuterBoxSx: SxProps<Theme> = {
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
};

/** GlassCard container for the entire Info modal content. */
export const infoCardSx: SxProps<Theme> = {
    width: '100%',
    maxWidth: '1000px',
    height: { xs: '600px', sm: '500px' },
    minHeight: { xs: '600px', sm: '500px' },
    display: 'flex',
    flexDirection: 'column',
    p: 0,
    overflow: 'hidden',
    position: 'relative',
    m: 2,
};

/** Scrollable content area wrapping steps. */
export const infoContentSx = (_step: number): SxProps<Theme> => ({
    flex: 1,
    overflow: 'hidden',
    p: { xs: 2.5, md: 3 },
    display: 'flex',
    flexDirection: 'column',
});

/** Header row (title + close button). */
export const infoHeaderSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
    pl: 3,
    pr: 1,
};

/** Close button colour. */
export const infoCloseButtonSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
};

/** Step-content wrapper. Accepts a boolean indicating if the step should
 *  receive scrollbar-compensating right padding on mobile. */
export const infoStepContentSx = (
    hasScrollPadding: boolean,
): SxProps<Theme> => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // Apply right spacing to scrolling steps on mobile to
    // prevent text from running too close to the edge/scrollbar.
    // Shifted from 'pr' to 'mr' to move the scrollbar itself further left.
    mr: hasScrollPadding ? 2 : 0,
    pr: hasScrollPadding ? { xs: 1, md: 0 } : 0,
    overflowY: hasScrollPadding ? 'auto' : 'hidden',
    minHeight: 0,
});

/** Footer row containing back/next buttons and the dot indicator. */
export const infoFooterSx: SxProps<Theme> = {
    px: 3,
    pb: 2,
    pt: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

/** Title row with icon and text. */
export const instructionTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    mb: 1.5,
    fontSize: TYPOGRAPHY.fontSize.subheading,
};

/** Icon preceding the instruction title. */
export const instructionIconSx: SxProps<Theme> = {
    ml: 1,
    mr: 2,
    color: COLORS.primary.main,
    fontSize: '1.75rem',
};

/** Body text for an instruction. */
export const instructionTextSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    lineHeight: 1.6,
    fontSize: TYPOGRAPHY.fontSize.body,
    ml: 6.5,
    pr: 2,
};

/** Outer wrapper for a step with fade-in animation. */
export const stepFadeInSx: SxProps<Theme> = {
    animation: 'fadeIn 0.3s ease',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'clip',
};

/** Centered content area within a step. */
export const stepCenteredContentSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

/** Instructions list with spacing. */
export const stepInstructionsListSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
};
