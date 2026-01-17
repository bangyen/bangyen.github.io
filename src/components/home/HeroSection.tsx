import React from 'react';
import { Grid, Box, Typography, Fade, Button } from '../mui';
import { HeroContainer } from '../Layout';
import { GlassCard } from '../common/GlassCard';
import { LocationOn, ArrowForward, GitHub, Work } from '../icons';
import { ICON_MAP } from '../common/Controls';
import { PERSONAL_INFO, URLS, SKILLS } from '../../config/constants';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    ANIMATIONS,
    SHADOWS,
    COMPONENT_VARIANTS,
} from '../../config/theme';

export function HeroSection(): React.ReactElement {
    return (
        <HeroContainer>
            <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                    <Fade in timeout={800}>
                        <Box>
                            <Typography
                                sx={{
                                    color: COLORS.primary.main,
                                    fontSize: TYPOGRAPHY.fontSize.body,
                                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.025em',
                                    marginBottom: 3,
                                }}
                            >
                                Hello, I&apos;m
                            </Typography>

                            <Typography
                                sx={{
                                    color: COLORS.text.primary,
                                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                                    fontSize: {
                                        xs: 'clamp(2rem, 8vw, 2.5rem)',
                                        md: 'clamp(3rem, 6vw, 5rem)',
                                    },
                                    lineHeight: 1.4,
                                    letterSpacing: '0',
                                    marginBottom: 2,
                                    wordBreak: 'keep-all',
                                    hyphens: 'none',
                                }}
                            >
                                {PERSONAL_INFO.name}
                            </Typography>

                            <Typography
                                sx={{
                                    color: COLORS.text.secondary,
                                    fontSize: {
                                        xs: 'clamp(0.875rem, 4vw, 1.125rem)',
                                        md: 'clamp(1.125rem, 2.5vw, 1.5rem)',
                                    },
                                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                    marginBottom: 4,
                                    lineHeight: 1.4,
                                    wordBreak: 'keep-all',
                                    hyphens: 'none',
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
                                        color: COLORS.text.secondary,
                                        fontSize: '1.25rem',
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontSize: TYPOGRAPHY.fontSize.body,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.medium,
                                    }}
                                >
                                    {PERSONAL_INFO.location}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Box
                                    onClick={() => {
                                        const element =
                                            document.getElementById(
                                                'featured-work'
                                            );
                                        if (element) {
                                            element.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start',
                                                inline: 'nearest',
                                            });
                                        }
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: '12px 20px',
                                        backgroundColor:
                                            COLORS.interactive.selected,
                                        borderRadius: SPACING.borderRadius.full,
                                        transition: ANIMATIONS.transition,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor:
                                                COLORS.interactive.focus,
                                            transform:
                                                'scale(1.02) translateY(-1px)',
                                            boxShadow: SHADOWS.text,
                                        },
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: COLORS.primary.main,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.semibold,
                                            fontSize: TYPOGRAPHY.fontSize.body,
                                        }}
                                    >
                                        View Work
                                    </Typography>
                                    <ArrowForward
                                        sx={{
                                            color: COLORS.primary.main,
                                            fontSize: '1rem',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Fade in timeout={1000}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                            }}
                        >
                            <GlassCard>
                                <Typography
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize:
                                            TYPOGRAPHY.fontSize.subheading,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                        marginBottom: 3,
                                    }}
                                >
                                    Tech Stack
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: {
                                            xs: '1fr',
                                            md: 'repeat(3, 1fr)',
                                        },
                                        gap: {
                                            xs: 1.5,
                                            md: 2,
                                        },
                                        marginBottom: 3,
                                    }}
                                >
                                    {SKILLS.map((skill, index) => {
                                        const IconComponent =
                                            ICON_MAP[skill.icon] || Work;

                                        return (
                                            <Fade
                                                in
                                                timeout={1200 + index * 150}
                                                key={skill.name}
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor:
                                                            COLORS.interactive
                                                                .selected,
                                                        border: `1px solid ${COLORS.interactive.selected}`,
                                                        borderRadius:
                                                            SPACING.borderRadius
                                                                .md,
                                                        padding: {
                                                            xs: '12px',
                                                            md: '16px',
                                                        },
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: {
                                                            xs: 1,
                                                            md: 1.5,
                                                        },
                                                        transition:
                                                            ANIMATIONS.transition,
                                                        cursor: 'pointer',
                                                        minWidth: 0,
                                                        overflow: 'hidden',
                                                        '&:hover': {
                                                            backgroundColor:
                                                                COLORS
                                                                    .interactive
                                                                    .hover,
                                                            transform:
                                                                'translateY(-2px) scale(1.01)',
                                                        },
                                                    }}
                                                >
                                                    <IconComponent
                                                        sx={{
                                                            color: COLORS
                                                                .primary.main,
                                                            fontSize:
                                                                TYPOGRAPHY
                                                                    .fontSize
                                                                    .body,
                                                        }}
                                                    />
                                                    <Typography
                                                        sx={{
                                                            color: COLORS
                                                                .primary.main,
                                                            fontSize:
                                                                TYPOGRAPHY
                                                                    .fontSize
                                                                    .body,
                                                            fontWeight:
                                                                TYPOGRAPHY
                                                                    .fontWeight
                                                                    .medium,
                                                            whiteSpace:
                                                                'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow:
                                                                'ellipsis',
                                                            flexShrink: 1,
                                                        }}
                                                    >
                                                        {skill.name}
                                                    </Typography>
                                                </Box>
                                            </Fade>
                                        );
                                    })}
                                </Box>
                            </GlassCard>

                            <GlassCard>
                                <Typography
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize:
                                            TYPOGRAPHY.fontSize.subheading,
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
                                        fontSize: TYPOGRAPHY.fontSize.body,
                                        lineHeight: 1.5,
                                        marginBottom: 4,
                                    }}
                                >
                                    Open to opportunities in backend
                                    development, ML engineering, and research
                                    collaboration.
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Button
                                        component="a"
                                        href={URLS.githubProfile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="outlined"
                                        startIcon={<GitHub />}
                                        sx={{
                                            textDecoration: 'none',
                                        }}
                                    >
                                        View GitHub
                                    </Button>

                                    <Button
                                        component="a"
                                        href="mailto:bangyenp@gmail.com?subject=Project%20Collaboration"
                                        variant="text"
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            textDecoration: 'none',
                                            color: COLORS.text.secondary,
                                            '&:hover': {
                                                color: COLORS.text.primary,
                                                backgroundColor:
                                                    COLORS.interactive.hover,
                                            },
                                        }}
                                    >
                                        Available for Projects
                                    </Button>
                                </Box>
                            </GlassCard>
                        </Box>
                    </Fade>
                </Grid>
            </Grid>
        </HeroContainer>
    );
}
