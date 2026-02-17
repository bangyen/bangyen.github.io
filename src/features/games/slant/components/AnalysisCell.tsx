import { Box } from '@mui/material';
import React from 'react';

import { SLANT_STYLES } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD } from '../types';

import { ANIMATIONS, SPACING } from '@/config/theme';

export interface AnalysisCellProps {
    value: CellState;
    color: string;
    /** Cell size in rem, used to scale slash thickness to match the main board. */
    size: number;
}

export const AnalysisCell = React.memo(function AnalysisCell({
    value,
    color,
    size,
}: AnalysisCellProps) {
    const thickness = `${String(Math.max(2, size))}px`;

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
                        width: '115%',
                        height: thickness,
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
                        width: '115%',
                        height: thickness,
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
