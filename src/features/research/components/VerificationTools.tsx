import React from 'react';

import { RESEARCH_STYLES } from '../constants';

import { Box, Typography, Grid } from '@/components/mui';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';
const PeriodicityCalculator = React.lazy(() =>
    import('./PeriodicityCalculator').then(m => ({
        default: m.PeriodicityCalculator,
    }))
);
const SolvabilityAnalyzer = React.lazy(() =>
    import('./SolvabilityAnalyzer').then(m => ({
        default: m.SolvabilityAnalyzer,
    }))
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
            <React.Suspense
                fallback={
                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', opacity: 0.6 }}
                    >
                        Loading tools...
                    </Typography>
                }
            >
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
            </React.Suspense>
        </Box>
    );
};
