import {
    Box,
    Button,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { RESEARCH_STYLES } from '../config/constants';
import { useListNavigation } from '../hooks/useListNavigation';
import type { Control } from '../types';

import { Refresh } from '@/components/icons';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    ANIMATIONS,
} from '@/config/theme';

/** Static style objects for ResearchControls layout elements. */
const styles = {
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
function getIconStyles(color: string | undefined): SxProps<Theme> {
    return {
        color: color ?? COLORS.primary.light,
        fontSize: '1.1rem',
    };
}

/**
 * Resolves the base colour for a selected toggle button.
 */
function resolveSelectedColor(control: Control): string {
    return control.color ?? COLORS.primary.main;
}

/**
 * Resolves the text colour for a selected toggle button based on
 * the perceived lightness of its background. Vibrant greens and
 * ambers require dark text for optimal contrast.
 */
function resolveSelectedTextColor(control: Control): string {
    const isVibrant =
        control.color === COLORS.data.green ||
        control.color === COLORS.data.amber;

    // Use dark primary text for vibrant backgrounds, white for others
    return isVibrant ? COLORS.text.primary : '#fff';
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
function getToggleButtonGroupStyles(control: Control): SxProps<Theme> {
    const selectedColor = resolveSelectedColor(control);
    const selectedTextColor = resolveSelectedTextColor(control);
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
                backgroundColor: selectedColor,
                color: selectedTextColor,
                borderColor: selectedColor,
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

interface ControlToggleGroupProps {
    control: Control;
}

function ControlToggleGroup({ control }: ControlToggleGroupProps) {
    const { getItemProps } = useListNavigation({
        count: control.options.length,
        containerRole: 'group',
    });

    return (
        <ToggleButtonGroup
            value={control.value}
            exclusive
            onChange={(_e, newValue) => {
                if (newValue !== null) {
                    control.onChange(newValue as number);
                }
            }}
            size="small"
            aria-label={control.label}
            sx={getToggleButtonGroupStyles(control)}
        >
            {control.options.map((option, index) => (
                <ToggleButton
                    key={option.value}
                    value={option.value}
                    aria-label={`${control.label}: ${option.label}`}
                    {...getItemProps(index, option.value === control.value)}
                >
                    {option.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
}

export interface ResearchControlsProps {
    controls: Control[];
    onReset?: () => void;
    resetLabel?: string;
}

/**
 * Renders parameter toggle buttons and an optional reset button.
 *
 * Memoised because the control configs are typically stable between
 * renders and the component should not re-render when unrelated
 * parent state (e.g. chart data) changes.
 */
export const ResearchControls = React.memo(function ResearchControls({
    controls,
    onReset,
    resetLabel = 'Reset',
}: ResearchControlsProps) {
    if (controls.length === 0) return null;

    return (
        <Box sx={styles.rootContainer}>
            {onReset && (
                <Box sx={styles.resetButtonContainer}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={onReset}
                        sx={styles.resetButton}
                    >
                        {resetLabel}
                    </Button>
                </Box>
            )}

            <Grid container spacing={RESEARCH_STYLES.LAYOUT.CONTROLS_SPACING}>
                {controls.map((control, index) => (
                    <Grid key={control.label || index} size={{ xs: 12, md: 4 }}>
                        <Box sx={styles.controlCard}>
                            <Box sx={styles.iconLabelContainer}>
                                {control.icon && (
                                    <control.icon
                                        sx={getIconStyles(control.color)}
                                    />
                                )}
                                <Typography variant="body2" sx={styles.label}>
                                    {control.label}
                                </Typography>
                            </Box>
                            <ControlToggleGroup control={control} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
});
