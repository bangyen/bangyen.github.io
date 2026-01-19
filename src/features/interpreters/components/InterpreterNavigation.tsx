import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import { COLORS, SPACING, TYPOGRAPHY } from '../../../config/theme';

interface InterpreterNavigationProps {
    active: string;
    onChange: (newValue: string) => void;
}

export const InterpreterNavigation: React.FC<InterpreterNavigationProps> = ({
    active,
    onChange,
}) => {
    const handleChange = (event: any) => {
        onChange(event.target.value);
    };

    return (
        <FormControl
            size="small"
            sx={{
                minWidth: { xs: 140, sm: 160 },
                '& .MuiOutlinedInput-root': {
                    backgroundColor: COLORS.surface.glass,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    borderRadius: SPACING.borderRadius.full,
                    color: COLORS.text.primary,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    transition: 'all 0.2s ease',
                    '& fieldset': {
                        border: `1px solid ${COLORS.border.subtle}`,
                    },
                    '&:hover fieldset': {
                        borderColor: COLORS.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: COLORS.primary.main,
                        boxShadow: `0 0 0 2px ${COLORS.primary.main}22`,
                    },
                },
                '& .MuiSelect-select': {
                    py: 1,
                    px: { xs: 2, sm: 3 },
                },
                '& .MuiSvgIcon-root': {
                    color: COLORS.text.secondary,
                },
            }}
        >
            <Select
                value={active}
                onChange={handleChange}
                MenuProps={{
                    autoFocus: false,
                    BackdropProps: {
                        sx: {
                            backdropFilter: 'none',
                            backgroundColor: 'transparent',
                        },
                    },
                    PaperProps: {
                        sx: {
                            backgroundColor: COLORS.surface.glass,
                            backdropFilter: 'blur(24px) saturate(180%)',
                            border: `1px solid ${COLORS.border.subtle}`,
                            borderRadius: SPACING.borderRadius.lg,
                            mt: 1,
                            '& .MuiMenuItem-root': {
                                color: COLORS.text.secondary,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    backgroundColor: COLORS.interactive.hover,
                                    color: COLORS.text.primary,
                                },
                                '&.Mui-selected': {
                                    backgroundColor:
                                        COLORS.interactive.selected,
                                    color: COLORS.primary.main,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.interactive.selected,
                                    },
                                },
                            },
                        },
                    },
                }}
            >
                <MenuItem value="stun-step">Stun Step</MenuItem>
                <MenuItem value="suffolk">Suffolk</MenuItem>
                <MenuItem value="wii2d">WII2D</MenuItem>
                <MenuItem value="back">Back</MenuItem>
            </Select>
        </FormControl>
    );
};
