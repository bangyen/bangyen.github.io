import React from 'react';
import { Box, Typography, Fade } from '../mui';
import { Section } from '../Layout';
import { PUBLICATIONS, PROJECTS } from '../../config/constants';
import { COLORS, TYPOGRAPHY } from '../../config/theme';
import { PublicationCard } from './FeaturedWork/PublicationCard';
import { ProjectCard } from './FeaturedWork/ProjectCard';

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
                            <Fade
                                in
                                timeout={1600 + index * 200}
                                key={publication.title}
                            >
                                <div>
                                    <PublicationCard
                                        publication={publication}
                                    />
                                </div>
                            </Fade>
                        ))}
                        {PROJECTS.map((project, index) => (
                            <Fade
                                in
                                timeout={2000 + index * 200}
                                key={project.title}
                            >
                                <div>
                                    <ProjectCard project={project} />
                                </div>
                            </Fade>
                        ))}
                    </Box>
                </Box>
            </Fade>
        </Section>
    );
}
