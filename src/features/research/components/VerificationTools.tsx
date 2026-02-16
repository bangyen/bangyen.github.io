import { Box, Typography, Grid } from '@mui/material';
import React from 'react';

import { RESEARCH_STYLES } from '../config/constants';

import { GlassCard } from '@/components/ui/GlassCard';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { COLORS, TYPOGRAPHY } from '@/config/theme';
import { lazyNamed } from '@/utils/lazyNamed';

const PeriodicityCalculator = lazyNamed(
    () => import('./PeriodicityCalculator'),
    'PeriodicityCalculator',
);
const SolvabilityAnalyzer = lazyNamed(
    () => import('./SolvabilityAnalyzer'),
    'SolvabilityAnalyzer',
);

export const VerificationTools: React.FC = () => {
    return (
        <Box sx={{ mt: 4, mb: 10 }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    color: COLORS.text.primary,
                }}
            >
                Verification Tools
            </Typography>
            <LazySuspense message="Loading tools..." height="auto">
                <Grid
                    container={true}
                    spacing={4}
                    sx={{ alignItems: 'stretch' }}
                >
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                        <GlassCard
                            sx={{
                                p: 3,
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: RESEARCH_STYLES.GLASS.SUBTLE,
                            }}
                        >
                            <PeriodicityCalculator />
                        </GlassCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex' }}>
                        <GlassCard
                            sx={{
                                p: 3,
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: RESEARCH_STYLES.GLASS.SUBTLE,
                            }}
                        >
                            <SolvabilityAnalyzer />
                        </GlassCard>
                    </Grid>
                </Grid>
            </LazySuspense>
        </Box>
    );
};
