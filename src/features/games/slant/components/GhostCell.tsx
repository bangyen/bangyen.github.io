import React from 'react';
import { Box } from '@mui/material';
import { FORWARD, BACKWARD, CellState } from '../utils/types';
import { ANIMATIONS, SPACING } from '@/config/theme';
import { SLANT_STYLES, LAYOUT_CONSTANTS } from '../utils/constants';

interface GhostCellProps {
    value: CellState;
    color: string;
}

export const GhostCell: React.FC<GhostCellProps> = ({ value, color }) => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
        >
            {value === FORWARD && (
                <Box
                    sx={{
                        position: 'absolute',
                        width: LAYOUT_CONSTANTS.LINE_WIDTH,
                        height: LAYOUT_CONSTANTS.LINE_THICKNESS,
                        backgroundColor: color,
                        borderRadius: SPACING.borderRadius.full,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(-45deg)',
                        boxShadow: SLANT_STYLES.SHADOWS.LINE,
                        transition: ANIMATIONS.transition,
                        pointerEvents: 'none',
                    }}
                />
            )}
            {value === BACKWARD && (
                <Box
                    sx={{
                        position: 'absolute',
                        width: LAYOUT_CONSTANTS.LINE_WIDTH,
                        height: LAYOUT_CONSTANTS.LINE_THICKNESS,
                        backgroundColor: color,
                        borderRadius: SPACING.borderRadius.full,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(45deg)',
                        boxShadow: SLANT_STYLES.SHADOWS.LINE,
                        transition: ANIMATIONS.transition,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </Box>
    );
};
