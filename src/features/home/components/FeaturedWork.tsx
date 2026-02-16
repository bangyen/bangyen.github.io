import { Box, Typography, Fade } from '@mui/material';
import React from 'react';

import { ProjectCard } from './FeaturedWork/ProjectCard';
import { PublicationCard } from './FeaturedWork/PublicationCard';
import { sectionTitleSx, cardGridSx } from './FeaturedWork.styles';
import { Section } from './Layout';
import { HOME_TEXT } from '../config/constants';

import { PUBLICATIONS, PROJECTS } from '@/config/constants';
import { ANIMATIONS } from '@/config/theme';

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
            <Fade in timeout={ANIMATIONS.durations.long + 400}>
                <Box>
                    <Typography sx={sectionTitleSx}>
                        {HOME_TEXT.featuredWork.sectionTitle}
                    </Typography>

                    <Box sx={cardGridSx}>
                        {PUBLICATIONS.map((publication, index) => (
                            <AnimatedCard
                                key={publication.title}
                                index={index}
                                baseTimeout={ANIMATIONS.durations.long + 600}
                            >
                                <PublicationCard publication={publication} />
                            </AnimatedCard>
                        ))}
                        {PROJECTS.map((project, index) => (
                            <AnimatedCard
                                key={project.title}
                                index={index}
                                baseTimeout={ANIMATIONS.durations.long + 1000}
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
