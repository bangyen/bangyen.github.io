import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid2';

import {
    PERSONAL_INFO,
    URLS,
    SKILLS,
    PUBLICATIONS,
    PROJECTS,
    COLORS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
    COMPONENTS,
} from '../config/constants';

import {
    GitHub,
    Code,
    Cloud,
    Psychology,
    Work,
    LocationOn,
    OpenInNew,
    ArrowForward,
} from '@mui/icons-material';

import { Typography, Box, Fade, Container } from '@mui/material';

export default function Home() {
    useEffect(() => {
        document.title = `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`;
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
            {/* Modern Navigation */}
            <Box
                sx={{
                    position: 'fixed',
                    top: SPACING.padding.md,
                    left: SPACING.padding.md,
                    right: SPACING.padding.md,
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        color: COLORS.text.primary,
                        fontSize: TYPOGRAPHY.fontSize.md.body,
                        fontWeight: TYPOGRAPHY.fontWeight.semibold,
                        letterSpacing: TYPOGRAPHY.letterSpacing.normal,
                    }}
                >
                    {PERSONAL_INFO.name.split(' ')[0]}
                </Typography>
            </Box>

            {/* Hero Section */}
            <Container
                maxWidth={false}
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '8rem', // Space for fixed nav
                    paddingBottom: '4rem',
                    paddingX: SPACING.padding.md,
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 4, md: 8 }}
                    alignItems="center"
                    sx={{ maxWidth: SPACING.maxWidth.lg }}
                >
                    {/* Left Side - Introduction */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Fade in timeout={800}>
                            <Box>
                                <Typography
                                    sx={{
                                        color: COLORS.text.accent,
                                        fontSize: TYPOGRAPHY.fontSize.md.body,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                        textTransform: 'uppercase',
                                        letterSpacing:
                                            TYPOGRAPHY.letterSpacing.wider,
                                        marginBottom: 3,
                                    }}
                                >
                                    Hello, I&apos;m
                                </Typography>

                                <Typography
                                    sx={{
                                        color: COLORS.text.primary,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.extrabold,
                                        fontSize: {
                                            xs: TYPOGRAPHY.fontSize.lg.display,
                                            md: 'clamp(3rem, 6vw, 5rem)',
                                        },
                                        lineHeight: TYPOGRAPHY.lineHeight.tight,
                                        letterSpacing:
                                            TYPOGRAPHY.letterSpacing.tight,
                                        marginBottom: 2,
                                    }}
                                >
                                    {PERSONAL_INFO.name}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontSize: {
                                            xs: TYPOGRAPHY.fontSize.md.h4,
                                            md: TYPOGRAPHY.fontSize.lg.h3,
                                        },
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                        marginBottom: 4,
                                        lineHeight:
                                            TYPOGRAPHY.lineHeight.normal,
                                    }}
                                >
                                    {PERSONAL_INFO.title}
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        marginBottom: 4,
                                    }}
                                >
                                    <LocationOn
                                        sx={{
                                            color: COLORS.text.muted,
                                            fontSize: '1.25rem',
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            color: COLORS.text.muted,
                                            fontSize:
                                                TYPOGRAPHY.fontSize.md.body,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.medium,
                                        }}
                                    >
                                        {PERSONAL_INFO.location}
                                    </Typography>
                                </Box>

                                <Typography
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontSize: TYPOGRAPHY.fontSize.md.body,
                                        lineHeight:
                                            TYPOGRAPHY.lineHeight.relaxed,
                                        marginBottom: 4,
                                        maxWidth: '90%',
                                    }}
                                >
                                    Backend Developer & AI/ML Engineer
                                    specializing in cloud architecture, HPC
                                    systems, and machine learning research.
                                    Northwestern MS Computer Science graduate
                                    with experience at Volta Health and Center
                                    for Nuclear Femtography.
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <Box
                                        component="a"
                                        href="#featured-work"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            padding: '12px 20px',
                                            backgroundColor:
                                                COLORS.interactive.selected,
                                            borderRadius:
                                                SPACING.borderRadius.full,
                                            transition:
                                                ANIMATIONS.transitions.normal,
                                            textDecoration: 'none',
                                            '&:hover': ANIMATIONS.hover.modern,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: COLORS.text.accent,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semibold,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.sm.body,
                                            }}
                                        >
                                            Projects & Work
                                        </Typography>
                                        <ArrowForward
                                            sx={{
                                                color: COLORS.text.accent,
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    </Grid>

                    {/* Right Side - Skills & Contact */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Fade in timeout={1000}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 4,
                                }}
                            >
                                {/* Compact Skills Section */}
                                <Box
                                    sx={{
                                        backgroundColor: COLORS.surface.glass,
                                        backdropFilter:
                                            'blur(20px) saturate(180%)',
                                        border: `1px solid hsla(0, 0%, 100%, 0.1)`,
                                        borderRadius: SPACING.borderRadius.xl,
                                        padding:
                                            SPACING.components.card.padding,
                                        boxShadow: COLORS.shadows.md,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: COLORS.text.accent,
                                            fontSize: TYPOGRAPHY.fontSize.md.h5,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.semibold,
                                            marginBottom: 3,
                                        }}
                                    >
                                        Tech Stack
                                    </Typography>

                                    {/* Compact Grid Layout */}
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                'repeat(2, 1fr)',
                                            gap: 2,
                                            marginBottom: 3,
                                        }}
                                    >
                                        {SKILLS.map((skill, index) => {
                                            const IconComponent =
                                                skill.icon === 'Code'
                                                    ? Code
                                                    : skill.icon ===
                                                        'Psychology'
                                                      ? Psychology
                                                      : skill.icon === 'Cloud'
                                                        ? Cloud
                                                        : Work;

                                            return (
                                                <Fade
                                                    in
                                                    timeout={1200 + index * 150}
                                                    key={skill.name}
                                                >
                                                    <Box
                                                        sx={{
                                                            backgroundColor:
                                                                COLORS
                                                                    .interactive
                                                                    .selected,
                                                            border: `1px solid hsla(217, 91%, 60%, 0.2)`,
                                                            borderRadius:
                                                                SPACING
                                                                    .borderRadius
                                                                    .md,
                                                            padding: '16px',
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: 1.5,
                                                            transition:
                                                                ANIMATIONS
                                                                    .transitions
                                                                    .normal,
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    COLORS
                                                                        .interactive
                                                                        .pressed,
                                                                transform:
                                                                    'translateY(-2px)',
                                                                boxShadow:
                                                                    COLORS
                                                                        .shadows
                                                                        .md,
                                                            },
                                                        }}
                                                    >
                                                        <IconComponent
                                                            sx={{
                                                                color: COLORS
                                                                    .text
                                                                    .accent,
                                                                fontSize:
                                                                    '1.5rem',
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                color: COLORS
                                                                    .text
                                                                    .accent,
                                                                fontSize:
                                                                    TYPOGRAPHY
                                                                        .fontSize
                                                                        .sm
                                                                        .body,
                                                                fontWeight:
                                                                    TYPOGRAPHY
                                                                        .fontWeight
                                                                        .medium,
                                                            }}
                                                        >
                                                            {skill.name}
                                                        </Typography>
                                                    </Box>
                                                </Fade>
                                            );
                                        })}
                                    </Box>
                                </Box>

                                {/* Contact & Action Section */}
                                <Box
                                    sx={{
                                        backgroundColor: COLORS.surface.glass,
                                        backdropFilter:
                                            'blur(20px) saturate(180%)',
                                        border: `1px solid hsla(0, 0%, 100%, 0.1)`,
                                        borderRadius: SPACING.borderRadius.xl,
                                        padding:
                                            SPACING.components.card.padding,
                                        boxShadow: COLORS.shadows.md,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: COLORS.text.accent,
                                            fontSize: TYPOGRAPHY.fontSize.md.h5,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.semibold,
                                            marginBottom: 3,
                                        }}
                                    >
                                        Let&apos;s Connect
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: COLORS.text.secondary,
                                            fontSize:
                                                TYPOGRAPHY.fontSize.md.body,
                                            lineHeight:
                                                TYPOGRAPHY.lineHeight.relaxed,
                                            marginBottom: 4,
                                        }}
                                    >
                                        Open to opportunities in backend
                                        development, ML engineering, and
                                        research collaboration.
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 2,
                                        }}
                                    >
                                        <Box
                                            component="a"
                                            href={URLS.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                ...COMPONENTS.button.secondary,
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <GitHub
                                                sx={{ fontSize: '1.25rem' }}
                                            />
                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                }}
                                            >
                                                View GitHub
                                            </Typography>
                                        </Box>

                                        <Box
                                            component="a"
                                            href="mailto:bangyen.pham@example.com?subject=Project%20Collaboration"
                                            sx={{
                                                ...COMPONENTS.button.ghost,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 1,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                }}
                                            >
                                                Available for Projects
                                            </Typography>
                                            <ArrowForward
                                                sx={{ fontSize: '1rem' }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Fade>
                    </Grid>
                </Grid>
            </Container>

            {/* Featured Work Section */}
            <Container
                maxWidth={false}
                sx={{
                    paddingY: SPACING.margin.section,
                    paddingX: SPACING.padding.md,
                }}
            >
                <Box sx={{ maxWidth: SPACING.maxWidth.lg, margin: '0 auto' }}>
                    <Fade in timeout={1400}>
                        <Box id="featured-work">
                            <Typography
                                sx={{
                                    color: COLORS.text.primary,
                                    fontSize: TYPOGRAPHY.fontSize.lg.h2,
                                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                                    textAlign: 'center',
                                    marginBottom: 6,
                                }}
                            >
                                Featured Work & Research
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: 'repeat(2, 1fr)',
                                        lg: 'repeat(3, 1fr)',
                                    },
                                    gap: 4,
                                }}
                            >
                                {/* Publications */}
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
                                                backgroundColor:
                                                    COLORS.surface.glass,
                                                backdropFilter:
                                                    'blur(20px) saturate(180%)',
                                                border: `1px solid hsla(0, 0%, 100%, 0.1)`,
                                                borderRadius:
                                                    SPACING.borderRadius.xl,
                                                padding:
                                                    SPACING.components.card
                                                        .padding,
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                                transition:
                                                    ANIMATIONS.transitions
                                                        .normal,
                                                boxShadow: COLORS.shadows.md,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    transform:
                                                        'translateY(-8px) scale(1.02)',
                                                    boxShadow:
                                                        COLORS.shadows.xl,
                                                },
                                                '&:focus':
                                                    ANIMATIONS.focus.ring,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    marginBottom: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: COLORS.text
                                                            .accent,
                                                        fontSize:
                                                            TYPOGRAPHY.fontSize
                                                                .md.h5,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semibold,
                                                        textTransform:
                                                            'uppercase',
                                                        letterSpacing:
                                                            TYPOGRAPHY
                                                                .letterSpacing
                                                                .wider,
                                                    }}
                                                >
                                                    Research
                                                </Typography>
                                                <OpenInNew
                                                    sx={{
                                                        color: COLORS.text
                                                            .accent,
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.md
                                                            .h4,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .normal,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {publication.title}
                                            </Typography>

                                            <Box sx={{ marginBottom: 3 }}>
                                                <Box
                                                    sx={{
                                                        ...COMPONENTS.badge
                                                            .primary,
                                                        backgroundColor:
                                                            'hsla(141, 64%, 49%, 0.1)',
                                                        color: 'hsl(141, 64%, 49%)',
                                                        border: '1px solid hsla(141, 64%, 49%, 0.2)',
                                                    }}
                                                >
                                                    {publication.conference}
                                                </Box>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    color: COLORS.text
                                                        .secondary,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.md
                                                            .body,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                }}
                                            >
                                                {publication.description}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                ))}

                                {/* Projects */}
                                {PROJECTS.map((project, index) => (
                                    <Fade
                                        in
                                        timeout={1600 + (index + 2) * 200}
                                        key={project.title}
                                    >
                                        <Box
                                            component="a"
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                backgroundColor:
                                                    COLORS.surface.glass,
                                                backdropFilter:
                                                    'blur(20px) saturate(180%)',
                                                border: `1px solid hsla(0, 0%, 100%, 0.1)`,
                                                borderRadius:
                                                    SPACING.borderRadius.xl,
                                                padding:
                                                    SPACING.components.card
                                                        .padding,
                                                textDecoration: 'none',
                                                cursor: 'pointer',
                                                transition:
                                                    ANIMATIONS.transitions
                                                        .normal,
                                                boxShadow: COLORS.shadows.md,
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    transform:
                                                        'translateY(-8px) scale(1.02)',
                                                    boxShadow:
                                                        COLORS.shadows.xl,
                                                },
                                                '&:focus':
                                                    ANIMATIONS.focus.ring,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent:
                                                        'space-between',
                                                    marginBottom: 3,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: COLORS.text
                                                            .accent,
                                                        fontSize:
                                                            TYPOGRAPHY.fontSize
                                                                .md.h5,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .semibold,
                                                        textTransform:
                                                            'uppercase',
                                                        letterSpacing:
                                                            TYPOGRAPHY
                                                                .letterSpacing
                                                                .wider,
                                                    }}
                                                >
                                                    Project
                                                </Typography>
                                                <GitHub
                                                    sx={{
                                                        color: COLORS.text
                                                            .accent,
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                sx={{
                                                    color: COLORS.text.primary,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.md
                                                            .h4,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .normal,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {project.title}
                                            </Typography>

                                            <Box sx={{ marginBottom: 3 }}>
                                                <Box
                                                    sx={{
                                                        ...COMPONENTS.badge
                                                            .primary,
                                                    }}
                                                >
                                                    {project.technology}
                                                </Box>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    color: COLORS.text
                                                        .secondary,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize.md
                                                            .body,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                }}
                                            >
                                                {project.description}
                                            </Typography>
                                        </Box>
                                    </Fade>
                                ))}
                            </Box>
                        </Box>
                    </Fade>
                </Box>
            </Container>
        </Grid>
    );
}
