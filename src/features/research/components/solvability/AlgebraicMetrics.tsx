import { Box, Typography } from '@mui/material';
import React from 'react';

import { RESEARCH_STYLES } from '../../config/constants';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

interface AlgebraicMetricsProps {
    nullity: number;
    solvablePercent: string;
}

export const AlgebraicMetrics: React.FC<AlgebraicMetricsProps> = ({
    nullity,
    solvablePercent,
}) => {
    return (
        <Box sx={{ p: 2.25, pb: 0 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    pb: 1.5,
                    borderBottom: `1px solid ${RESEARCH_STYLES.BORDER.SUBTLE}`,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: COLORS.primary.main,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                    }}
                >
                    Subspace Analysis
                </Typography>
                <Typography
                    sx={{
                        color:
                            nullity === 0
                                ? COLORS.data.green
                                : COLORS.text.primary,
                        fontFamily: 'monospace',
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_SM,
                    }}
                >
                    {solvablePercent}% Solvable
                </Typography>
            </Box>
        </Box>
    );
};
