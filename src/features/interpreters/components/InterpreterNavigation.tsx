import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '../../../components/mui';
import { COLORS, SPACING, SHADOWS } from '../../../config/theme';

interface InterpreterNavigationProps {
    active: string;
    onChange: (newValue: string) => void;
}

export const InterpreterNavigation: React.FC<InterpreterNavigationProps> = ({
    active,
    onChange,
}) => {
    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null
    ) => {
        if (newAlignment !== null) {
            onChange(newAlignment);
        }
    };

    return (
        <ToggleButtonGroup
            value={active}
            exclusive
            onChange={handleChange}
            aria-label="interpreter selector"
            sx={{
                backgroundColor: COLORS.interactive.disabled,
                borderRadius: SPACING.borderRadius.full,
                p: 0.5,
                '& .MuiToggleButton-root': {
                    borderRadius: SPACING.borderRadius.full,
                    border: 'none',
                    color: COLORS.text.secondary,
                    fontSize: '0.85rem',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    px: { xs: 1.5, sm: 3 },
                    py: 0.5,
                    '&.Mui-selected': {
                        backgroundColor: COLORS.primary.main,
                        color: COLORS.text.primary,
                        boxShadow: SHADOWS.md,
                        '&:hover': {
                            backgroundColor: COLORS.primary.light,
                        },
                    },
                    '&:hover': {
                        backgroundColor: COLORS.interactive.hover,
                    },
                },
            }}
        >
            <ToggleButton value="stun-step">Stun Step</ToggleButton>
            <ToggleButton value="suffolk">Suffolk</ToggleButton>
            <ToggleButton value="wii2d">WII2D</ToggleButton>
            <ToggleButton value="back">Back</ToggleButton>
        </ToggleButtonGroup>
    );
};
