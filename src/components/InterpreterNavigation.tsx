import React from 'react';
import { ToggleButton, ToggleButtonGroup } from './mui';
import { COLORS, SPACING } from '../config/theme';

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
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: SPACING.borderRadius.full,
                p: 0.5,
                '& .MuiToggleButton-root': {
                    borderRadius: SPACING.borderRadius.full,
                    px: 3,
                    py: 1,
                    border: 'none',
                    color: COLORS.text.secondary,
                    fontSize: '0.9rem',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&.Mui-selected': {
                        backgroundColor: COLORS.primary.main,
                        color: COLORS.text.primary,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        '&:hover': {
                            backgroundColor: COLORS.primary.light,
                        },
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                },
            }}
        >
            <ToggleButton value="Stun_Step">Stun Step</ToggleButton>
            <ToggleButton value="Suffolk">Suffolk</ToggleButton>
            <ToggleButton value="WII2D">WII2D</ToggleButton>
            <ToggleButton value="Back">Back</ToggleButton>
        </ToggleButtonGroup>
    );
};
