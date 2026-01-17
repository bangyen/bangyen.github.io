import React from 'react';
import { Box, Typography, Fade } from '../mui';
import { Section } from '../Layout';
import { GlassCard } from '../common/GlassCard';
import { OpenInNew, GitHub } from '../icons';
import { PUBLICATIONS, PROJECTS } from '../../config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_VARIANTS,
} from '../../config/theme';

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
                                <Box
                                    component="a"
                                    href={publication.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        textDecoration: 'none',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        ...COMPONENT_VARIANTS.interactiveCard,
                                        '&:hover .glass-card': {
                                            backgroundColor:
                                                COLORS.interactive.selected,
                                        },
                                    }}
                                >
                                    <GlassCard
                                        sx={{
                                            border: 'none',
                                            height: '100%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: COLORS.primary.main,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize
                                                            .caption,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .medium,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.025em',
                                                }}
                                            >
                                                Research
                                            </Typography>
                                            <OpenInNew
                                                sx={{
                                                    color: COLORS.primary.main,
                                                }}
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: COLORS.text.primary,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize
                                                        .subheading,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semibold,
                                                marginBottom: 2,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {publication.title}
                                        </Typography>

                                        <Box sx={{ marginBottom: 2 }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    backgroundColor:
                                                        COLORS.surface.success,
                                                    padding: '4px 12px',
                                                    borderRadius:
                                                        SPACING.borderRadius
                                                            .full,
                                                    border: `1px solid ${COLORS.surface.success}`,
                                                    display: 'inline-block',
                                                }}
                                            >
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        color: COLORS.data
                                                            .green,
                                                        fontSize: '0.7rem',
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .medium,
                                                        textTransform:
                                                            'uppercase',
                                                        letterSpacing:
                                                            '0.025em',
                                                    }}
                                                >
                                                    {publication.conference}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.body,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {publication.description}
                                        </Typography>
                                    </GlassCard>
                                </Box>
                            </Fade>
                        ))}
                        {PROJECTS.map((project, index) => (
                            <Fade
                                in
                                timeout={2000 + index * 200}
                                key={project.title}
                            >
                                <Box
                                    component="a"
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        textDecoration: 'none',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        ...COMPONENT_VARIANTS.interactiveCard,
                                        '&:hover .glass-card': {
                                            backgroundColor:
                                                COLORS.interactive.selected,
                                        },
                                    }}
                                >
                                    <GlassCard
                                        sx={{
                                            border: 'none',
                                            height: '100%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: COLORS.primary.main,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize
                                                            .caption,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .medium,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.025em',
                                                }}
                                            >
                                                Engineering
                                            </Typography>
                                            <GitHub
                                                sx={{
                                                    color: COLORS.primary.main,
                                                }}
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: COLORS.text.primary,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize
                                                        .subheading,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semibold,
                                                marginBottom: 2,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {project.title}
                                        </Typography>

                                        <Box sx={{ marginBottom: 2 }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    backgroundColor:
                                                        COLORS.interactive
                                                            .selected,
                                                    padding: '4px 12px',
                                                    borderRadius:
                                                        SPACING.borderRadius
                                                            .full,
                                                    border: `1px solid ${COLORS.interactive.selected}`,
                                                    display: 'inline-block',
                                                }}
                                            >
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        color: COLORS.primary
                                                            .main,
                                                        fontSize: '0.7rem',
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .medium,
                                                        textTransform:
                                                            'uppercase',
                                                        letterSpacing:
                                                            '0.025em',
                                                    }}
                                                >
                                                    {project.technology}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: COLORS.text.secondary,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.body,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {project.description}
                                        </Typography>
                                    </GlassCard>
                                </Box>
                            </Fade>
                        ))}
                    </Box>
                </Box>
            </Fade>
        </Section>
    );
}
