import React from 'react';
import { Box, Typography, Fade } from '../../../components/mui';
import { Section } from '../../../components/layout/Layout';
import { PUBLICATIONS, PROJECTS } from '../../../config/constants';
import { COLORS, TYPOGRAPHY } from '../../../config/theme';
import { PublicationCard } from './FeaturedWork/PublicationCard';
import { ProjectCard } from './FeaturedWork/ProjectCard';

interface AnimatedCardProps {
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
        <Fade in timeout={baseTimeout + index * 200}>
            <div>{children}</div>
        </Fade>
    );
}

export function FeaturedWork(): React.ReactElement {
    return (
        <Section id="featured-work">
            <Fade in timeout={1400}>
                <Box>
                    <Typography
                        sx={{
                            color: COLORS.text.primary,
                            fontSize: TYPOGRAPHY.fontSize.h2,
                            fontWeight: TYPOGRAPHY.fontWeight.semibold,
                            textAlign: 'center',
                            marginBottom: 6,
                        }}
                    >
                        Featured Work
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, 1fr)',
                            },
                            gap: 4,
                        }}
                    >
                        {PUBLICATIONS.map((publication, index) => (
                            <AnimatedCard
                                key={publication.title}
                                index={index}
                                baseTimeout={1600}
                            >
                                <PublicationCard publication={publication} />
                            </AnimatedCard>
                        ))}
                        {PROJECTS.map((project, index) => (
                            <AnimatedCard
                                key={project.title}
                                index={index}
                                baseTimeout={2000}
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
