/**
 * Shared style constants for the GameInfo modal.
 * Kept in a separate module so game-specific config files (e.g. Slant)
 * can compose overrides without importing from a component file, which
 * would trigger the react-refresh/only-export-components lint rule.
 */

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
    height: { xs: '630px', sm: '495px' },
    minHeight: { xs: '630px', sm: '495px' },
    display: 'flex',
    flexDirection: 'column',
    p: 0,
    overflow: 'hidden',
    position: 'relative',
    m: 2,
};

/** Header row (title + close button). */
export const infoHeaderSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
    px: 2,
};

/** Close button colour. */
export const infoCloseButtonSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
};

/** Step-content wrapper. Accepts an optional step index so the scrollbar-
 *  compensating right padding only applies to steps that actually scroll. */
export const infoStepContentSx = (step?: number): SxProps<Theme> => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // Apply right padding to scrolling steps (0 and 2+) on mobile to
    // prevent text from running too close to the edge/scrollbar.
    pr: step === 1 ? 0 : { xs: 5, md: 3 },
    overflowY: step === 1 ? 'hidden' : 'auto',
    minHeight: 0,
});

/** Scrollable content area wrapping steps. */
export const infoContentSx = (_step: number): SxProps<Theme> => ({
    flex: 1,
    overflow: 'hidden',
    p: { xs: 2.5, md: 3 },
    display: 'flex',
    flexDirection: 'column',
});

/** Diameter (px) of each step-indicator dot in the navigation footer. */
export const STEP_DOT_SIZE = 8;

/** Footer row containing back/next buttons and the dot indicator. */
export const infoFooterSx: SxProps<Theme> = {
    px: 2.5,
    pb: 2.5,
    pt: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

// ---------------------------------------------------------------------------
// InstructionItem styles
// ---------------------------------------------------------------------------

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
    mr: 2,
    color: COLORS.primary.main,
    fontSize: '1.75rem',
};

/** Body text for an instruction. */
export const instructionTextSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    lineHeight: 1.6,
    fontSize: TYPOGRAPHY.fontSize.body,
    ml: 6,
};

// ---------------------------------------------------------------------------
// StepContent styles
// ---------------------------------------------------------------------------

/** Outer wrapper for a step with fade-in animation. */
export const stepFadeInSx: SxProps<Theme> = {
    animation: 'fadeIn 0.3s ease',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
