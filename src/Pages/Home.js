import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Grid,
    Typography,
    Box,
    Menu,
    MenuItem,
    Fade,
    Button,
} from '../components/mui';

import { TooltipButton, GlassCard, ICON_MAP } from '../helpers';
import { Section, HeroContainer } from '../components/Layout';
import { pages } from './';
import {
    PERSONAL_INFO,
    URLS,
    SKILLS,
    PUBLICATIONS,
    PROJECTS,
    PAGE_TITLES,
} from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
    COMPONENT_VARIANTS,
} from '../config/theme';

import {
    MenuRounded,
    GitHub,
    Work,
    LocationOn,
    OpenInNew,
    ArrowForward,
} from '../components/icons';

function dropdown(name, routes) {
    return (
        <Box>
            {Object.entries(routes).map(([routeName, routePath]) => (
                <MenuItem
                    sx={{
                        padding: '12px 16px',
                        borderRadius: SPACING.borderRadius.md,
                        margin: '0.25rem 0.5rem',
                        transition: ANIMATIONS.transition,
                        '&:hover': ANIMATIONS.presets.interactiveHover,
                    }}
                    key={routeName}
                    component={Link}
                    to={routePath}
                >
                    <Typography
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            fontSize: TYPOGRAPHY.fontSize.body,
                            color: COLORS.text.primary,
                        }}
                    >
                        {routeName.replace('_', ' ')}
                    </Typography>
                </MenuItem>
            ))}
        </Box>
    );
}

function clickHandler(setAnchor) {
    return event => {
        setAnchor(event.currentTarget);
    };
}

function closeHandler(setAnchor) {
    return () => {
        setAnchor(null);
    };
}

function MenuButton({ children }) {
    const [anchor, setAnchor] = useState(null);
    const handleClick = clickHandler(setAnchor);
    const handleClose = closeHandler(setAnchor);
    const open = Boolean(anchor);

    const define = value => {
        return open ? value : undefined;
    };

    return (
        <Box>
            <TooltipButton
                title="Menu"
                id="basic-button"
                Icon={MenuRounded}
                aria-controls={define('basic-menu')}
                aria-expanded={define('true')}
                aria-haspopup="true"
                onClick={handleClick}
            />
            <Menu
                id="basic-menu"
                open={open}
                anchorEl={anchor}
                sx={{
                    marginLeft: 1,
                    marginTop: 1,
                    '& .MuiPaper-root': {
                        height: 'fit-content',
                        minHeight: 'auto',
                        maxHeight: 'fit-content',
                    },
                }}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    sx: {
                        padding: 0,
                        height: 'fit-content',
                        minHeight: 'auto',
                    },
                }}
            >
                {children}
            </Menu>
        </Box>
    );
}

export default function Home() {
    useEffect(() => {
        document.title = PAGE_TITLES.home;
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
                    position: 'relative',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: SPACING.responsive.padding,
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '100%', // Prevent overflow
                    overflowX: 'hidden', // Hide any overflow
                }}
            >
                <MenuButton>{dropdown('Projects', pages)}</MenuButton>
                <TooltipButton
                    component="a"
                    href={URLS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    Icon={GitHub}
                />
            </Box>

            {/* Spacing between nav and hero */}
            <Box
                sx={{
                    height: SPACING.responsive.margin,
                }}
            />

            {/* Hero Section */}
            <HeroContainer>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                    {/* Left Side - Introduction */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Fade in timeout={800}>
                            <Box>
                                <Typography
                                    sx={{
                                        color: COLORS.primary.main,
                                        fontSize: TYPOGRAPHY.fontSize.body,
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
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
                                            xs: 'clamp(2rem, 8vw, 2.5rem)', // Mobile sizing
                                            md: 'clamp(3rem, 6vw, 5rem)', // Desktop sizing
                                        },
                                        lineHeight:
                                            TYPOGRAPHY.lineHeight.normal,
                                        letterSpacing:
                                            TYPOGRAPHY.letterSpacing.normal,
                                        marginBottom: 2,
                                        // Allow controlled wrapping, but prevent breaks in names
                                        wordBreak: 'keep-all', // Prevent breaking within words
                                        hyphens: 'none', // Disable hyphenation
                                    }}
                                >
                                    {PERSONAL_INFO.name}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: COLORS.text.secondary,
                                        fontSize: {
                                            xs: 'clamp(0.875rem, 4vw, 1.125rem)', // Mobile sizing
                                            md: 'clamp(1.125rem, 2.5vw, 1.5rem)', // Desktop sizing
                                        },
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
                                        marginBottom: 4,
                                        lineHeight:
                                            TYPOGRAPHY.lineHeight.normal,
                                        // Control how text breaks, allowing smart wrapping
                                        wordBreak: 'keep-all', // Prevent breaking within words
                                        hyphens: 'none', // Disable hyphenation
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
                                            borderRadius:
                                                SPACING.borderRadius.full,
                                            transition: ANIMATIONS.transition,
                                            cursor: 'pointer',
                                            '&:hover':
                                                ANIMATIONS.presets.scaleHover,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: COLORS.primary.main,
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semibold,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.body,
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

                                    {/* Responsive Skills Grid */}
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr', // Single column on mobile
                                                md: 'repeat(3, 1fr)', // 3 columns on desktop
                                            },
                                            gap: {
                                                xs: 1.5, // Smaller gap on mobile
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
                                                                COLORS
                                                                    .interactive
                                                                    .selected,
                                                            border: `1px solid hsla(217, 91%, 60%, 0.2)`,
                                                            borderRadius:
                                                                SPACING
                                                                    .borderRadius
                                                                    .md,
                                                            padding: {
                                                                xs: '12px',
                                                                md: '16px',
                                                            },
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
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
                                                                ...ANIMATIONS
                                                                    .presets
                                                                    .cardHover,
                                                                transform:
                                                                    'translateY(-2px) scale(1.01)',
                                                            },
                                                        }}
                                                    >
                                                        <IconComponent
                                                            sx={{
                                                                color: COLORS
                                                                    .primary
                                                                    .main,
                                                                fontSize:
                                                                    TYPOGRAPHY
                                                                        .fontSize
                                                                        .body,
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                color: COLORS
                                                                    .primary
                                                                    .main,
                                                                fontSize:
                                                                    TYPOGRAPHY
                                                                        .fontSize
                                                                        .body,
                                                                fontWeight:
                                                                    TYPOGRAPHY
                                                                        .fontWeight
                                                                        .medium,
                                                                whiteSpace:
                                                                    'nowrap', // Prevent wrapping
                                                                overflow:
                                                                    'hidden', // Hide overflow
                                                                textOverflow:
                                                                    'ellipsis', // Show ellipsis if too long
                                                                flexShrink: 1, // Allow text to shrink
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

                                {/* Contact & Action Section */}
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
                                        <Button
                                            component="a"
                                            href={URLS.githubProfile}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            variant="secondary"
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
                                            variant="ghost"
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                textDecoration: 'none',
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

            {/* Featured Work Section */}
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
                                            textDecoration: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            height: '100%',
                                            display: 'flex',
                                            ...COMPONENT_VARIANTS.card,
                                            '&:hover .glass-card': {
                                                backgroundColor:
                                                    COLORS.interactive.selected,
                                            },
                                        }}
                                    >
                                        <GlassCard>
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
                                                        color: COLORS.primary
                                                            .main,
                                                        fontSize:
                                                            TYPOGRAPHY.fontSize
                                                                .caption,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .medium,
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
                                                        color: COLORS.primary
                                                            .main,
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
                                                        TYPOGRAPHY.fontSize
                                                            .subheading,
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
                                                        borderRadius: '20px',
                                                        fontSize:
                                                            'clamp(0.7rem, 0.8vw, 0.75rem)',
                                                        fontWeight: 500,
                                                        padding: '4px 12px',
                                                        minHeight: '24px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        transition:
                                                            'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
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
                                                        TYPOGRAPHY.fontSize
                                                            .body,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                    flex: 1,
                                                }}
                                            >
                                                {publication.description}
                                            </Typography>
                                        </GlassCard>
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
                                            textDecoration: 'none',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            height: '100%',
                                            display: 'flex',
                                            ...COMPONENT_VARIANTS.card,
                                            '&:hover .glass-card': {
                                                backgroundColor:
                                                    COLORS.interactive.selected,
                                            },
                                        }}
                                    >
                                        <GlassCard>
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
                                                        color: COLORS.primary
                                                            .main,
                                                        fontSize:
                                                            TYPOGRAPHY.fontSize
                                                                .caption,
                                                        fontWeight:
                                                            TYPOGRAPHY
                                                                .fontWeight
                                                                .medium,
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
                                                        color: COLORS.primary
                                                            .main,
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
                                                        TYPOGRAPHY.fontSize
                                                            .subheading,
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
                                                        borderRadius: '20px',
                                                        fontSize:
                                                            'clamp(0.7rem, 0.8vw, 0.75rem)',
                                                        fontWeight: 500,
                                                        padding: '4px 12px',
                                                        minHeight: '24px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        transition:
                                                            'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                                        backgroundColor:
                                                            'hsla(217, 91%, 60%, 0.1)',
                                                        color: 'hsl(217, 91%, 60%)',
                                                        border: '1px solid hsla(217, 91%, 60%, 0.2)',
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
                                                        TYPOGRAPHY.fontSize
                                                            .body,
                                                    lineHeight:
                                                        TYPOGRAPHY.lineHeight
                                                            .relaxed,
                                                    flex: 1,
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

            {/* Bottom spacing */}
            <Box
                sx={{
                    height: SPACING.responsive.margin,
                }}
            />
        </Grid>
    );
}
