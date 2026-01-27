import React, { useEffect } from 'react';
import { Grid, Box } from '../../../components/mui';
import { HeroSection } from '../components/HeroSection';
import { FeaturedWork } from '../components/FeaturedWork';
import { PAGE_TITLES } from '../../../config/constants';
import { COLORS } from '../../../config/theme';
import { GlobalHeader } from '../../../components/layout/GlobalHeader';

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
            <GlobalHeader />

            <Box component="main" sx={{ width: '100%', flex: 1 }}>
                <Box
                    sx={{
                        height: { xs: '10rem', md: '5rem' },
                    }}
                />

                <HeroSection />

                <FeaturedWork />
            </Box>
        </Grid>
    );
}
