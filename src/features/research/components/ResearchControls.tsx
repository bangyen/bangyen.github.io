import React from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from '../../../components/mui';
import { Refresh } from '../../../components/icons';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../../config/theme';
import { Control } from '../types';

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
                        marginBottom: 2.5,
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
                            padding: '0.25rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            transition: 'all 0.2s ease-in-out',
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

            <Grid container spacing={2.5}>
                {controls.map((control, index) => (
                    <Grid key={control.label || index} size={{ xs: 12, md: 4 }}>
                        <Box
                            sx={{
                                marginBottom: 0,
                                padding: '1rem',
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
                                                control.color ||
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
                                        control.onChange(newValue);
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
                                        padding: '0.6rem 0.8rem',
                                        flex: 1,
                                        fontSize: '0.85rem',
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.medium,
                                        borderRadius: 0,
                                        transition: 'all 0.2s ease-in-out',
                                        '&.Mui-selected': {
                                            backgroundColor:
                                                control.color ||
                                                COLORS.primary.main,
                                            color: '#fff',
                                            borderColor:
                                                control.color ||
                                                COLORS.primary.main,
                                            '&:hover': {
                                                backgroundColor:
                                                    control.hoverColor ||
                                                    (control.color ===
                                                    COLORS.primary.main
                                                        ? COLORS.primary.dark
                                                        : control.color ===
                                                            COLORS.data.green
                                                          ? 'hsl(141, 64%, 39%)'
                                                          : control.color ===
                                                              COLORS.data.amber
                                                            ? 'hsl(34, 95%, 48%)'
                                                            : control.color ||
                                                              COLORS.primary
                                                                  .dark),
                                                borderColor:
                                                    control.hoverColor ||
                                                    (control.color ===
                                                    COLORS.primary.main
                                                        ? COLORS.primary.dark
                                                        : control.color ===
                                                            COLORS.data.green
                                                          ? 'hsl(141, 64%, 39%)'
                                                          : control.color ===
                                                              COLORS.data.amber
                                                            ? 'hsl(34, 95%, 48%)'
                                                            : control.color ||
                                                              COLORS.primary
                                                                  .dark),
                                                transform: 'translateY(-1px)',
                                                boxShadow: SHADOWS.sm,
                                            },
                                        },
                                        '&:hover': {
                                            backgroundColor:
                                                COLORS.interactive.hover,
                                            transform: 'translateY(-1px)',
                                        },
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
