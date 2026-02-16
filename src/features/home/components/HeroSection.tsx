import { Grid, Box, Typography, Fade } from '@mui/material';
import React from 'react';

import { ConnectSection } from './HeroSection/ConnectSection';
import { TechStack } from './HeroSection/TechStack';
import {
    heroGreetingSx,
    heroNameSx,
    heroTitleSx,
    heroLocationRowSx,
    heroLocationIconSx,
    heroLocationTextSx,
    heroCtaRowSx,
    heroCtaButtonSx,
    heroCtaTextSx,
    heroCtaArrowSx,
    heroRightColumnSx,
} from './HeroSection.styles';
import { HeroContainer } from './Layout';

import { LocationOn, ArrowForward } from '@/components/icons';
import { PERSONAL_INFO } from '@/config/constants';
import { ANIMATIONS } from '@/config/theme';
import { scrollToElement } from '@/utils/domUtils';

export function HeroSection(): React.ReactElement {
    return (
        <HeroContainer>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box>
                        <Typography sx={heroGreetingSx}>
                            Hello, I&apos;m
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
                                    scrollToElement('#featured-work');
                                }}
                                onKeyDown={(e: React.KeyboardEvent) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        scrollToElement('#featured-work');
                                    }
                                }}
                                aria-label="View featured work"
                                sx={heroCtaButtonSx}
                            >
                                <Typography sx={heroCtaTextSx}>
                                    View Work
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
                    <Fade in timeout={ANIMATIONS.durations.long}>
                        <Box sx={heroRightColumnSx}>
                            <TechStack />
                            <ConnectSection />
                        </Box>
                    </Fade>
                </Grid>
            </Grid>
        </HeroContainer>
    );
}
