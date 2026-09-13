import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { ProjectCard } from './FeaturedWork/ProjectCard';
import { PublicationCard } from './FeaturedWork/PublicationCard';
import { Section } from './Layout';
import { HOME_TEXT } from '../config/constants';

import { PUBLICATIONS, PROJECTS } from '@/config/constants';
import { COLORS, TYPOGRAPHY, ANIMATIONS } from '@/config/theme';

/** Section heading that reads "Featured Work". */
const sectionTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    letterSpacing: '-0.03em',
    marginBottom: 1,
};

const sectionIntroSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.body,
    lineHeight: 1.6,
    maxWidth: '38rem',
    marginBottom: 5,
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
                    ...ANIMATIONS.motion.fadeInUp(0.2),
                }}
            >
                <Typography sx={sectionTitleSx}>
                    {HOME_TEXT.featuredWork.sectionTitle}
                </Typography>
                <Typography sx={sectionIntroSx}>
                    Selected research and engineering work spanning distributed
                    systems, machine learning, and computational modeling.
                </Typography>

                <Box sx={cardGridSx}>
                    {PUBLICATIONS.map((publication, index) => (
                        <Box
                            key={publication.title}
                            sx={{
                                opacity: 0,
                                ...ANIMATIONS.motion.fadeInUp(
                                    0.25 + index * 0.04,
                                ),
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
                                ...ANIMATIONS.motion.fadeInUp(
                                    0.35 + index * 0.04,
                                ),
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
