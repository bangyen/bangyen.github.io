import React, { useEffect } from 'react';

import { FeaturedWork } from '../components/FeaturedWork';
import { HeroSection } from '../components/HeroSection';

import { PageLayout } from '@/components/layout/PageLayout';
import { Box } from '@/components/mui';
import { PAGE_TITLES } from '@/config/constants';

export default function Home(): React.ReactElement {
    useEffect(() => {
        document.title = PAGE_TITLES.home;
    }, []);

    return (
        <PageLayout>
            <Box
                sx={{
                    height: { xs: '10rem', md: '5rem' },
                }}
            />

            <HeroSection />

            <FeaturedWork />
        </PageLayout>
    );
}
