/**
 * Lights Out-specific calculator styles, keeping component JSX focused
 * on structure and logic.
 */

import type { SxProps, Theme } from '@mui/material';

import { COLORS } from '@/config/theme';

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
