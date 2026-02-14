import { Box, Typography } from '@mui/material';
import React from 'react';

import { RESEARCH_STYLES } from '../../config/constants';

import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

interface KernelBasisViewProps {
    quietPatterns: string[];
}

export const KernelBasisView: React.FC<KernelBasisViewProps> = ({
    quietPatterns,
}) => {
    if (quietPatterns.length === 0) return null;

    return (
        <Box sx={{ minWidth: 0, mb: 1.5 }}>
            <Typography
                variant="caption"
                sx={{
                    color: COLORS.primary.main,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    display: 'block',
                    mb: 0.5,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_XS,
                }}
            >
                Quiet Patterns (Kernel)
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    pr: 1,
                }}
            >
                {quietPatterns.map(p => (
                    <Box
                        key={p}
                        sx={{
                            fontFamily: 'monospace',
                            fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_XS,
                            px: 1.25,
                            py: 0.5,
                            backgroundColor: RESEARCH_STYLES.GLASS.DARK,
                            borderRadius: SPACING.borderRadius.xs,
                            color: COLORS.primary.main,
                            letterSpacing: 1,
                            border: `1px solid ${RESEARCH_STYLES.BORDER.VERY_SUBTLE}`,
                            wordBreak: 'break-all',
                        }}
                    >
                        {p}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
