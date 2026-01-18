import React, { useEffect } from 'react';
import { Grid, Box } from '../../../components/mui';

import { TooltipButton } from '../../../components/ui/Controls';
import { MenuButton } from '../components/ProjectMenu';
import { HeroSection } from '../components/HeroSection';
import { FeaturedWork } from '../components/FeaturedWork';
import { URLS, PAGE_TITLES } from '../../../config/constants';
import { COLORS } from '../../../config/theme';
import { GitHub } from '../../../components/icons';

export default function Home(): React.ReactElement {
    useEffect(() => {
        document.title = PAGE_TITLES.home;
    }, []);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                background: COLORS.surface.background,
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: { xs: '0.5rem', md: '1.5rem' },
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '100%',
                    overflowX: 'hidden',
                }}
            >
                <MenuButton />
                <TooltipButton
                    component="a"
                    href={URLS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    Icon={GitHub}
                />
            </Box>

            <Box
                sx={{
                    height: { xs: '10rem', md: '5rem' },
                }}
            />

            <HeroSection />

            <FeaturedWork />
        </Grid>
    );
}
