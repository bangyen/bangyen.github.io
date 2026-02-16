import type { SxProps, Theme } from '@mui/material';

import { RESEARCH_STYLES } from '../config/constants';
import type { Control } from '../types';

import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    ANIMATIONS,
} from '@/config/theme';

/** Static style objects for ResearchControls layout elements. */
export const styles = {
    rootContainer: {
        marginBottom: 0,
        width: '100%',
        boxSizing: 'border-box',
        paddingBottom: SPACING.padding.md,
    },

    resetButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mb: RESEARCH_STYLES.LAYOUT.CONTROLS_SPACING,
    },

    resetButton: {
        color: COLORS.text.secondary,
        borderColor: COLORS.border.subtle,
        borderRadius: SPACING.borderRadius.lg,
        px: 2,
        py: 0.5,
        fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_MD,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        transition: ANIMATIONS.transitions.standard,
        '&:hover': {
            borderColor: COLORS.primary.main,
            backgroundColor: COLORS.interactive.hover,
            transform: 'translateY(-1px)',
            boxShadow: SHADOWS.sm,
        },
    },

    controlCard: {
        marginBottom: 0,
        padding: RESEARCH_STYLES.LAYOUT.INNER_PADDING,
        backgroundColor: COLORS.interactive.disabled,
        borderRadius: SPACING.borderRadius.lg,
        border: `1px solid ${COLORS.border.subtle}`,
    },

    iconLabelContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
    },

    label: {
        color: COLORS.text.secondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
} as const satisfies Record<string, SxProps<Theme>>;

/**
 * Builds the `sx` prop for a control icon, tinting it with the
 * control's colour or the default primary light.
 */
export function getIconStyles(color: string | undefined): SxProps<Theme> {
    return {
        color: color ?? COLORS.primary.light,
        fontSize: '1.1rem',
    };
}

/**
 * Resolves the hover colour for a selected toggle button based on
 * the control's explicit `hoverColor` or its base `color`.
 */
function resolveSelectedHoverColor(control: Control): string {
    if (control.hoverColor) return control.hoverColor;
    if (control.color === COLORS.primary.main) return COLORS.primary.dark;
    if (control.color === COLORS.data.green) return RESEARCH_STYLES.GREEN.HOVER;
    if (control.color === COLORS.data.amber) return RESEARCH_STYLES.AMBER.HOVER;
    return control.color ?? COLORS.primary.dark;
}

/**
 * Builds the `sx` prop for a `ToggleButtonGroup`, including the
 * dynamic selected/hover colour logic that depends on `control`.
 */
export function getToggleButtonGroupStyles(control: Control): SxProps<Theme> {
    const selectedHover = resolveSelectedHoverColor(control);

    return {
        width: '100%',
        borderRadius: SPACING.borderRadius.lg,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border.subtle}`,
        '& .MuiToggleButtonGroup-grouped': {
            margin: 0,
            border: 0,
            borderRadius: 0,
            '&:not(:first-of-type)': {
                borderLeft: `1px solid ${COLORS.border.subtle}`,
            },
        },
        '& .MuiToggleButton-root': {
            color: COLORS.text.secondary,
            borderColor: COLORS.border.subtle,
            padding: RESEARCH_STYLES.LAYOUT.INNER_PADDING_SM,
            flex: 1,
            fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_MD,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            borderRadius: 0,
            transition: ANIMATIONS.transitions.standard,
            '&.Mui-selected': {
                backgroundColor: control.color ?? COLORS.primary.main,
                color: COLORS.text.primary,
                borderColor: control.color ?? COLORS.primary.main,
                '&:hover': {
                    backgroundColor: selectedHover,
                    borderColor: selectedHover,
                    transform: 'translateY(-1px)',
                    boxShadow: SHADOWS.sm,
                },
            },
            '&:hover': {
                backgroundColor: COLORS.interactive.hover,
                transform: 'translateY(-1px)',
            },
        },
    };
}
