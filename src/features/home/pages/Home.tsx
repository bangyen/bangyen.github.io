import { Box } from '@mui/material';
import React from 'react';

import { FeaturedWork } from '../components/FeaturedWork';
import { HeroSection } from '../components/HeroSection';

import { PageLayout } from '@/components/layout/PageLayout';
import { PAGE_TITLES } from '@/config/constants';

export function Home(): React.ReactElement {
    return (
        <PageLayout
            title={PAGE_TITLES.home}
            description="Bangyen Pham's backend engineering and AI/ML portfolio, featuring research, interactive visualizations, and algorithmic games."
            showHome={false}
            containerSx={{
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(circle at 18% 18%, hsla(217, 91%, 60%, 0.08), transparent 28rem), radial-gradient(circle at 88% 36%, hsla(217, 91%, 60%, 0.05), transparent 24rem)',
                },
            }}
        >
            <Box
                sx={{
                    height: { xs: '2.5rem', md: '4rem' },
                }}
            />

            <HeroSection />

            <FeaturedWork />
        </PageLayout>
    );
}
