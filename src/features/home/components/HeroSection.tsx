import { Grid, Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { ConnectSection } from './HeroSection/ConnectSection';
import { TechStack } from './HeroSection/TechStack';
import { HeroContainer } from './Layout';
import { HOME_TEXT } from '../config/constants';

import { LocationOn, ArrowForward } from '@/components/icons';
import { PERSONAL_INFO } from '@/config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
    SHADOWS,
} from '@/config/theme';

/** "Hello, I'm" greeting label. */
const heroGreetingSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    textAlign: { xs: 'center', md: 'left' },
    marginBottom: 3,
};

/** Full name heading. */
const heroNameSx: SxProps<Theme> = {
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
};

/** Role / title subtitle. */
const heroTitleSx: SxProps<Theme> = {
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
    opacity: 0,
    animation: 'fadeInUp 0.35s ease-out forwards',
    animationDelay: '0.04s',
};

/** Row containing the location icon + text. */
const heroLocationRowSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: { xs: 'center', md: 'flex-start' },
    marginBottom: 4,
    opacity: 0,
    animation: 'fadeInUp 0.35s ease-out forwards',
    animationDelay: '0.06s',
};

/** Location icon styling. */
const heroLocationIconSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: '1.25rem',
};

/** Location text label. */
const heroLocationTextSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.body,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
};

/** Wrapper for the CTA buttons row (desktop only). */
const heroCtaRowSx: SxProps<Theme> = {
    display: { xs: 'none', md: 'flex' },
    gap: 2,
    flexWrap: 'wrap',
    justifyContent: { xs: 'center', md: 'flex-start' },
    opacity: 0,
    animation: 'fadeInUp 0.35s ease-out forwards',
    animationDelay: '0.08s',
};

/** "View Work" pill button. */
const heroCtaButtonSx: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: `${SPACING.padding.sm} ${SPACING.padding.md}`,
    backgroundColor: COLORS.interactive.selected,
    borderRadius: SPACING.borderRadius.full,
    transition: ANIMATIONS.transition,
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: COLORS.interactive.focus,
        transform: 'scale(1.02) translateY(-1px)',
        boxShadow: SHADOWS.text,
    },
    '&:focus-visible': {
        outline: `2px solid ${COLORS.primary.main}`,
        outlineOffset: '2px',
    },
};

/** Text inside the CTA pill. */
const heroCtaTextSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.body,
};

/** Arrow icon inside the CTA pill. */
const heroCtaArrowSx: SxProps<Theme> = {
    color: COLORS.primary.main,
    fontSize: '1rem',
};

/** Right-column fade-in wrapper. */
const heroRightColumnSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
};

export function HeroSection(): React.ReactElement {
    return (
        <HeroContainer>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography sx={heroGreetingSx}>
                            {HOME_TEXT.hero.greeting}
                        </Typography>

                        <Typography sx={heroNameSx}>
                            {PERSONAL_INFO.name}
                        </Typography>

                        <Typography sx={heroTitleSx}>
                            {PERSONAL_INFO.title}
                        </Typography>

                        <Box sx={heroLocationRowSx}>
                            <LocationOn sx={heroLocationIconSx} />
                            <Typography sx={heroLocationTextSx}>
                                {PERSONAL_INFO.location}
                            </Typography>
                        </Box>

                        <Box sx={heroCtaRowSx}>
                            <Box
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    document
                                        .querySelector('#featured-work')
                                        ?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start',
                                            inline: 'nearest',
                                        });
                                }}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        document
                                            .querySelector('#featured-work')
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                                inline: 'nearest',
                                            });
                                    }
                                }}
                                aria-label="View featured work"
                                sx={heroCtaButtonSx}
                            >
                                <Typography sx={heroCtaTextSx}>
                                    {HOME_TEXT.hero.ctaLabel}
                                </Typography>
                                <ArrowForward sx={heroCtaArrowSx} />
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid
                    size={{ xs: 12, md: 6 }}
                    sx={{ display: { xs: 'none', md: 'block' } }}
                >
                    <Box sx={heroRightColumnSx}>
                        <Box
                            sx={{
                                opacity: 0,
                                animation: 'fadeInUp 0.35s ease-out forwards',
                                animationDelay: '0.06s',
                            }}
                        >
                            <TechStack />
                        </Box>
                        <Box
                            sx={{
                                opacity: 0,
                                animation: 'fadeInUp 0.35s ease-out forwards',
                                animationDelay: '0.1s',
                            }}
                        >
                            <ConnectSection />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </HeroContainer>
    );
}
