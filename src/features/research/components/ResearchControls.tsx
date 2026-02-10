import React from 'react';

import { RESEARCH_STYLES } from '../constants';
import { Control } from '../types';

import { Refresh } from '@/components/icons';
import {
    Box,
    Button,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from '@/components/mui';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    SHADOWS,
    ANIMATIONS,
} from '@/config/theme';

interface ResearchControlsProps {
    controls: Control[];
    onReset?: () => void;
    resetLabel?: string;
}

const ResearchControls: React.FC<ResearchControlsProps> = ({
    controls,
    onReset,
    resetLabel = 'Reset',
}) => {
    if (controls.length === 0) return null;

    return (
        <Box
            sx={{
                marginBottom: 0,
                width: '100%',
                boxSizing: 'border-box',
                paddingBottom: SPACING.padding.md,
            }}
        >
            {onReset && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        mb: RESEARCH_STYLES.LAYOUT.CONTROLS_SPACING,
                    }}
                >
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={onReset}
                        sx={{
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
                        }}
                    >
                        {resetLabel}
                    </Button>
                </Box>
            )}

            <Grid container spacing={RESEARCH_STYLES.LAYOUT.CONTROLS_SPACING}>
                {controls.map((control, index) => (
                    <Grid key={control.label || index} size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                marginBottom: 0,
                                padding: RESEARCH_STYLES.LAYOUT.INNER_PADDING,
                                backgroundColor: COLORS.interactive.disabled,
                                borderRadius: SPACING.borderRadius.lg,
                                border: `1px solid ${COLORS.border.subtle}`,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    mb: 2,
                                }}
                            >
                                {control.icon && (
                                    <control.icon
                                        sx={{
                                            color:
                                                control.color ??
                                                COLORS.primary.light,
                                            fontSize: '1.1rem',
                                        }}
                                    />
                                )}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.medium,
                                    }}
                                >
                                    {control.label}
                                </Typography>
                            </Box>
                            <ToggleButtonGroup
                                value={control.value}
                                exclusive
                                onChange={(e, newValue) => {
                                    if (newValue !== null) {
                                        control.onChange(newValue as number);
                                    }
                                }}
                                size="small"
                                sx={{
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
                                        padding:
                                            RESEARCH_STYLES.LAYOUT
                                                .INNER_PADDING_SM,
                                        flex: 1,
                                        fontSize:
                                            RESEARCH_STYLES.LAYOUT.FONT_SIZE_MD,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.medium,
                                        borderRadius: 0,
                                        transition:
                                            ANIMATIONS.transitions.standard,
                                        '&.Mui-selected': {
                                            backgroundColor:
                                                control.color ??
                                                COLORS.primary.main,
                                            color: COLORS.text.primary,
                                            borderColor:
                                                control.color ??
                                                COLORS.primary.main,
                                            '&:hover': {
                                                backgroundColor:
                                                    control.hoverColor ??
                                                    (control.color ===
                                                    COLORS.primary.main
                                                        ? COLORS.primary.dark
                                                        : control.color ===
                                                            COLORS.data.green
                                                          ? RESEARCH_STYLES
                                                                .GREEN.HOVER
                                                          : control.color ===
                                                              COLORS.data.amber
                                                            ? RESEARCH_STYLES
                                                                  .AMBER.HOVER
                                                            : (control.color ??
                                                              COLORS.primary
                                                                  .dark)),
                                                borderColor:
                                                    control.hoverColor ??
                                                    (control.color ===
                                                    COLORS.primary.main
                                                        ? COLORS.primary.dark
                                                        : control.color ===
                                                            COLORS.data.green
                                                          ? RESEARCH_STYLES
                                                                .GREEN.HOVER
                                                          : control.color ===
                                                              COLORS.data.amber
                                                            ? RESEARCH_STYLES
                                                                  .AMBER.HOVER
                                                            : (control.color ??
                                                              COLORS.primary
                                                                  .dark)),
                                                transform: 'translateY(-1px)',
                                                boxShadow: SHADOWS.sm,
                                            },
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.interactive.hover,
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                {control.options.map(option => (
                                    <ToggleButton
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ResearchControls;
