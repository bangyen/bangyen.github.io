import { Box } from '@mui/material';
import React from 'react';

import { SLANT_STYLES } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD } from '../types';

import { COLORS } from '@/config/theme';

export function slashLineSx(angle: string, size: number) {
    return {
        position: 'absolute' as const,
        width: '115%',
        height: `${String(Math.max(2, size))}px`,
        backgroundColor: COLORS.text.primary,
        borderRadius: '99px',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${angle})`,
        boxShadow: SLANT_STYLES.SHADOWS.LINE,
        pointerEvents: 'none' as const,
    };
}

export function makeBackProps(grid: CellState[][], size: number) {
    return (r: number, c: number) => {
        const value = grid[r]?.[c];

        return {
            sx: {
                border: `2px solid ${COLORS.border.subtle}`,
                position: 'relative',
                backgroundColor: SLANT_STYLES.ANALYSIS.BG_SUBTLE,
            },
            children: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {value === FORWARD && (
                        <Box sx={slashLineSx('-45deg', size)} />
                    )}
                    {value === BACKWARD && (
                        <Box sx={slashLineSx('45deg', size)} />
                    )}
                </Box>
            ),
        };
    };
}

export function makeFrontProps(
    numbers: (number | null)[][],
    numberSize: number,
) {
    return (r: number, c: number) => {
        const value = numbers[r]?.[c];

        return {
            sx: { pointerEvents: 'none' },
            children: (
                <Box
                    sx={{
                        borderRadius: '50%',
                        backgroundColor: COLORS.surface.background,
                        border:
                            value == null
                                ? 'none'
                                : `2px solid ${COLORS.border.subtle}`,
                        fontSize: `${String(numberSize * 0.5)}rem`,
                        fontWeight: '800',
                        color: COLORS.text.primary,
                        boxShadow:
                            value == null ? 'none' : SLANT_STYLES.SHADOWS.HINT,
                        zIndex: 5,
                        opacity: value == null ? 0 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '0.05rem',
                        lineHeight: 1,
                        width: `${String(numberSize)}rem`,
                        height: `${String(numberSize)}rem`,
                    }}
                >
                    {value ?? ''}
                </Box>
            ),
        };
    };
}
