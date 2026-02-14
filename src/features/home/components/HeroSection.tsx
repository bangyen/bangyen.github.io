import { Grid, Box, Typography, Fade } from '@mui/material';
import React from 'react';

import { ConnectSection } from './HeroSection/ConnectSection';
import { TechStack } from './HeroSection/TechStack';

import { LocationOn, ArrowForward } from '@/components/icons';
import { HeroContainer } from '@/components/layout/Layout';
import { PERSONAL_INFO } from '@/config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
    SHADOWS,
} from '@/config/theme';

export function HeroSection(): React.ReactElement {
    return (
        <HeroContainer>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography
                            sx={{
                                color: COLORS.primary.main,
                                fontSize: TYPOGRAPHY.fontSize.body,
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                textTransform: 'uppercase',
                                letterSpacing: '0.025em',
                                textAlign: { xs: 'center', md: 'left' },
                                marginBottom: 3,
                            }}
                        >
                            Hello, I&apos;m
                        </Typography>

                        <Typography
                            sx={{
                                color: COLORS.text.primary,
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                fontSize: {
                                    xs: 'clamp(2rem, 8vw, 2.5rem)',
                                    md: 'clamp(3rem, 6vw, 5rem)',
                                },
                                lineHeight: 1.4,
                                letterSpacing: '0',
                                marginBottom: 2,
                                wordBreak: 'keep-all',
                                hyphens: 'none',
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            {PERSONAL_INFO.name}
                        </Typography>

                        <Typography
                            sx={{
                                color: COLORS.text.secondary,
                                fontSize: {
                                    xs: 'clamp(0.875rem, 4vw, 1.125rem)',
                                    md: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                                },
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                marginBottom: 4,
                                lineHeight: 1.4,
                                wordBreak: 'keep-all',
                                hyphens: 'none',
                                textAlign: { xs: 'center', md: 'left' },
                            }}
                        >
                            {PERSONAL_INFO.title}
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: {
                                    xs: 'center',
                                    md: 'flex-start',
                                },
                                marginBottom: 4,
                            }}
                        >
                            <LocationOn
                                sx={{
                                    color: COLORS.text.secondary,
                                    fontSize: '1.25rem',
                                }}
                            />
                            <Typography
                                sx={{
                                    color: COLORS.text.secondary,
                                    fontSize: TYPOGRAPHY.fontSize.body,
                                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                                }}
                            >
                                {PERSONAL_INFO.location}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 2,
                                flexWrap: 'wrap',
                                justifyContent: {
                                    xs: 'center',
                                    md: 'flex-start',
                                },
                            }}
                        >
                            <Box
                                onClick={() => {
                                    const element =
                                        document.querySelector(
                                            '#featured-work',
                                        );
                                    if (element) {
                                        element.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                            inline: 'nearest',
                                        });
                                    }
                                }}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    padding: `${SPACING.padding.sm} ${SPACING.padding.md}`,
                                    backgroundColor:
                                        COLORS.interactive.selected,
                                    borderRadius: SPACING.borderRadius.full,
                                    transition: ANIMATIONS.transition,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor:
                                            COLORS.interactive.focus,
                                        transform:
                                            'scale(1.02) translateY(-1px)',
                                        boxShadow: SHADOWS.text,
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                        fontSize: TYPOGRAPHY.fontSize.body,
                                    }}
                                >
                                    View Work
                                </Typography>
                                <ArrowForward
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize: '1rem',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{ display: { xs: 'none', md: 'block' } }}
                >
                    <Fade in timeout={ANIMATIONS.durations.long}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                            }}
                        >
                            <TechStack />
                            <ConnectSection />
                        </Box>
                    </Fade>
                </Grid>
            </Grid>
        </HeroContainer>
    );
}
