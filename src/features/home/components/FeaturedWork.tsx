import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { ProjectCard } from './FeaturedWork/ProjectCard';
import { PublicationCard } from './FeaturedWork/PublicationCard';
import { Section } from './Layout';
import { HOME_TEXT } from '../config/constants';

import { PUBLICATIONS, PROJECTS } from '@/config/constants';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Section heading that reads "Featured Work". */
const sectionTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: 6,
};

/** Responsive 1/2-column grid for publication and project cards. */
const cardGridSx: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, 1fr)',
    },
    gap: 4,
};

export function FeaturedWork(): React.ReactElement {
    return (
        <Section id="featured-work">
            <Box
                sx={{
                    opacity: 0,
                    animation: 'fadeInUp 0.35s ease-out forwards',
                    animationDelay: '0.2s',
                }}
            >
                <Typography sx={sectionTitleSx}>
                    {HOME_TEXT.featuredWork.sectionTitle}
                </Typography>

                <Box sx={cardGridSx}>
                    {PUBLICATIONS.map((publication, index) => (
                        <Box
                            key={publication.title}
                            sx={{
                                opacity: 0,
                                animation: 'fadeInUp 0.35s ease-out forwards',
                                animationDelay: `${(0.25 + index * 0.04).toFixed(2)}s`,
                            }}
                        >
                            <PublicationCard publication={publication} />
                        </Box>
                    ))}
                    {PROJECTS.map((project, index) => (
                        <Box
                            key={project.title}
                            sx={{
                                opacity: 0,
                                animation: 'fadeInUp 0.35s ease-out forwards',
                                animationDelay: `${(0.35 + index * 0.04).toFixed(2)}s`,
                            }}
                        >
                            <ProjectCard project={project} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Section>
    );
}
