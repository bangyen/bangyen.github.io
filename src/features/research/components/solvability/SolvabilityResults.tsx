import React from 'react';

import { AlgebraicMetrics } from './AlgebraicMetrics';
import { ImageMappingView } from './ImageMappingView';
import { KernelBasisView } from './KernelBasisView';
import { RESEARCH_STYLES } from '../../config/constants';

import { Box, Paper, Typography, Fade, alpha } from '@/components/mui';
import { COLORS, SPACING, TYPOGRAPHY } from '@/config/theme';

interface SolvabilityResultsProps {
    result: {
        rank: number;
        nullity: number;
        gridRank: number;
        solvablePercent: string;
        quietPatterns: string[];
        imageMapping: { state: string; toggle: string }[];
        isFullSubspace: boolean;
    };
}

export const SolvabilityResults: React.FC<SolvabilityResultsProps> = ({
    result,
}) => {
    return (
        <Fade in={true}>
            <Paper
                elevation={0}
                sx={{
                    height: '100%',
                    backgroundColor: RESEARCH_STYLES.GLASS.TRANSPARENT,
                    borderRadius: SPACING.borderRadius.md,
                    border: `1px solid ${alpha(
                        result.nullity === 0
                            ? COLORS.data.green
                            : COLORS.primary.main,
                        0.2,
                    )}`,
                    borderLeft: `4px solid ${
                        result.nullity === 0
                            ? COLORS.data.green
                            : COLORS.primary.main
                    }`,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <AlgebraicMetrics
                    nullity={result.nullity}
                    solvablePercent={result.solvablePercent}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5,
                        flexGrow: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        p: 2.25,
                        pt: 0,
                        '&::-webkit-scrollbar': {
                            width: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: RESEARCH_STYLES.GLASS.MEDIUM,
                            borderRadius: SPACING.borderRadius.xs,
                        },
                    }}
                >
                    <KernelBasisView quietPatterns={result.quietPatterns} />
                    <ImageMappingView
                        imageMapping={result.imageMapping}
                        isFullSubspace={result.isFullSubspace}
                    />
                </Box>
                {result.quietPatterns.length === 0 && (
                    <Box
                        sx={{
                            p: 1.5,
                            px: 2.25,
                            backgroundColor: RESEARCH_STYLES.GREEN.BG_SUBTLE,
                            borderTop: `1px solid ${RESEARCH_STYLES.GREEN.BORDER_SUBTLE}`,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                color: COLORS.data.green,
                                fontFamily: 'monospace',
                                fontSize: RESEARCH_STYLES.LAYOUT.FONT_SIZE_SM,
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                textTransform: 'uppercase',
                            }}
                        >
                            fully solvable (Nullity = 0)
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Fade>
    );
};
