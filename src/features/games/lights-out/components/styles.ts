/**
 * Extracted sx-prop style constants for the Lights Out Info modal and
 * calculator, keeping the component JSX focused on structure and logic.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

// ---------------------------------------------------------------------------
// Info modal
// ---------------------------------------------------------------------------

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
export const infoCardSx: Record<string, unknown> = {
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

/** Scrollable content area wrapping steps. */
export const infoContentSx = (step: number): SxProps<Theme> => ({
    flex: 1,
    overflowY: step === 1 ? 'hidden' : 'auto',
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
    px: 2,
};

/** Close button colour. */
export const infoCloseButtonSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
};

/** Step-content wrapper. */
export const infoStepContentSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    pr: { xs: 3, md: 0 },
};

// ---------------------------------------------------------------------------
// InfoCalculator
// ---------------------------------------------------------------------------

/** Root wrapper of the calculator step. */
export const calculatorRootSx: SxProps<Theme> = {
    animation: 'fadeIn 0.3s ease',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
};

/** Flex container holding input / output grids and buttons. */
export const calculatorContainerSx = (
    useHorizontal: boolean,
): SxProps<Theme> => ({
    flex: 1,
    display: 'flex',
    flexDirection: useHorizontal ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
});

/** Bold label above each grid row. */
export const calculatorLabelSx: SxProps<Theme> = {
    mb: 1,
    color: COLORS.text.primary,
    fontWeight: 'bold',
};

/** Lighter sub-label inside the grid row header. */
export const calculatorSubLabelSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontWeight: 'normal',
};

/** Button-group container layout. */
export const calculatorButtonGroupSx = (
    useHorizontal: boolean,
    isMobile: boolean,
): SxProps<Theme> => ({
    display: 'flex',
    flexDirection: useHorizontal || isMobile ? 'column' : 'row',
    gap: 1,
    alignItems: 'center',
});

/** Outlined action button. */
export const calculatorButtonSx: SxProps<Theme> = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
};
