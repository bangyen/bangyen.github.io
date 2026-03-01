import { Box, Typography, Fade } from '@mui/material';
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

export interface AnimatedCardProps {
    index: number;
    baseTimeout: number;
    children: React.ReactNode;
}

function AnimatedCard({
    index,
    baseTimeout,
    children,
}: AnimatedCardProps): React.ReactElement {
    return (
        <Fade in timeout={baseTimeout + index * ANIMATIONS.durations.stagger}>
            <div>{children}</div>
        </Fade>
    );
}

export function FeaturedWork(): React.ReactElement {
    return (
        <Section id="featured-work">
            <Fade in timeout={ANIMATIONS.durations.long + 800}>
                <Box>
                    <Typography sx={sectionTitleSx}>
                        {HOME_TEXT.featuredWork.sectionTitle}
                    </Typography>

                    <Box sx={cardGridSx}>
                        {PUBLICATIONS.map((publication, index) => (
                            <AnimatedCard
                                key={publication.title}
                                index={index}
                                baseTimeout={ANIMATIONS.durations.long + 1000}
                            >
                                <PublicationCard publication={publication} />
                            </AnimatedCard>
                        ))}
                        {PROJECTS.map((project, index) => (
                            <AnimatedCard
                                key={project.title}
                                index={index}
                                baseTimeout={ANIMATIONS.durations.long + 1400}
                            >
                                <ProjectCard project={project} />
                            </AnimatedCard>
                        ))}
                    </Box>
                </Box>
            </Fade>
        </Section>
    );
}
