import { Box } from '@mui/material';
import React from 'react';

import { SLANT_STYLES, LAYOUT_CONSTANTS } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD } from '../types';

import { ANIMATIONS, SPACING } from '@/config/theme';

export interface AnalysisCellProps {
    value: CellState;
    color: string;
}

export const AnalysisCell = React.memo(function AnalysisCell({
    value,
    color,
}: AnalysisCellProps) {
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
                        '--slant-base-transform':
                            'translate(-50%, -50%) rotate(-45deg)',
                        transform: 'var(--slant-base-transform)',
                        boxShadow: SLANT_STYLES.SHADOWS.LINE,
                        transition: ANIMATIONS.transition,
                        animation: SLANT_STYLES.ANIMATIONS.POP_IN_STYLE,
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
                        '--slant-base-transform':
                            'translate(-50%, -50%) rotate(45deg)',
                        transform: 'var(--slant-base-transform)',
                        boxShadow: SLANT_STYLES.SHADOWS.LINE,
                        transition: ANIMATIONS.transition,
                        animation: SLANT_STYLES.ANIMATIONS.POP_IN_STYLE,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </Box>
    );
});
