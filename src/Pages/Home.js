import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';

import { TooltipButton } from '../helpers';
import { pages } from './';
import {
    PERSONAL_INFO,
    URLS,
    SKILLS,
    PUBLICATIONS,
    PROJECTS,
    PAGE_TITLES,
} from '../config/constants';
import { COLORS, SPACING, TYPOGRAPHY, ANIMATIONS } from '../config/theme';
import { COMPONENTS } from '../config/components';

import {
    MenuRounded,
    GitHub,
    Code,
    Cloud,
    Psychology,
    Work,
    LocationOn,
    OpenInNew,
    ArrowForward,
} from '@mui/icons-material';

import {
    Typography,
    Box,
    Menu,
    MenuItem,
    Fade,
    Container,
} from '@mui/material';

function dropdown(name, routes) {
    const padHeight = COMPONENTS.menu.padding.vertical;
    const padWidth = COMPONENTS.menu.padding.horizontal;

    return (
        <Box>
            {Object.entries(routes).map(([routeName, routePath]) => (
                <MenuItem
                    sx={{
                        paddingBottom: padHeight,
                        paddingTop: padHeight,
                        paddingLeft: padWidth,
                        paddingRight: padWidth,
                        borderRadius: SPACING.borderRadius.md,
                        margin: '0.25rem 0.5rem',
                        transition: ANIMATIONS.transitions.fast,
                        '&:hover': ANIMATIONS.hover.modern,
                    }}
                    key={routeName}
                    component={Link}
                    to={routePath}
                >
                    <Typography
                        sx={{
                            fontWeight: TYPOGRAPHY.fontWeight.medium,
                            fontSize: TYPOGRAPHY.fontSize.sm.body,
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
                        ...COMPONENTS.menu,
                        boxShadow: COLORS.shadows.lg,
                    },
                }}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    sx: { padding: 1 },
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
                    padding: {
                        xs: SPACING.padding.xs, // Smaller padding on mobile
                        sm: SPACING.padding.sm,
                        md: SPACING.padding.md,
                    },
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

            {/* Hero Section */}
            <Container
                maxWidth={false}
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 0, // No gap needed with relative nav
                    paddingBottom: '4rem',
                    paddingX: {
                        xs: SPACING.padding.xs, // Smaller padding on mobile
                        sm: SPACING.padding.sm,
                        md: SPACING.padding.md,
                    },
                    maxWidth: '100%', // Prevent container from exceeding viewport
                    overflowX: 'hidden', // Hide any horizontal overflow
                }}
            >
                <Grid
                    container
                    spacing={SPACING.layout.containerSpacing}
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
                                            xs: 'clamp(2rem, 8vw, 2.5rem)', // Smaller on mobile, prevents wrapping under 500px
                                            sm: 'clamp(2.5rem, 7vw, 3.5rem)', // Medium sizing
                                            md: 'clamp(3rem, 6vw, 5rem)', // Large sizing
                                        },
                                        lineHeight: TYPOGRAPHY.lineHeight.tight,
                                        letterSpacing:
                                            TYPOGRAPHY.letterSpacing.tight,
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
                                            xs: 'clamp(0.875rem, 4vw, 1.125rem)', // Prevents wrapping under 400px
                                            sm: 'clamp(1rem, 3vw, 1.25rem)', // Medium sizing, prevents wrapping between 900-1200px
                                            md: 'clamp(1.125rem, 2.5vw, 1.5rem)', // Large sizing
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
                                            padding:
                                                SPACING.components.medium
                                                    .padding,
                                            backgroundColor:
                                                COLORS.interactive.selected,
                                            borderRadius:
                                                SPACING.borderRadius.full,
                                            transition:
                                                ANIMATIONS.transitions.normal,
                                            cursor: 'pointer',
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
                                            View Work
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
                                            COMPONENTS.menu.backdropFilter,
                                        border: COMPONENTS.menu.border,
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

                                    {/* Responsive Skills Grid */}
                                    <Box
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr', // Single column on mobile
                                                sm: 'repeat(2, 1fr)', // 2 columns on small screens and up
                                                md: 'repeat(3, 1fr)', // 3 columns on medium screens and up
                                            },
                                            gap: {
                                                xs: 1.5, // Smaller gap on mobile
                                                sm: 2,
                                            },
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
                                                            padding: {
                                                                xs: '12px', // Smaller padding on mobile
                                                                sm: '16px',
                                                            },
                                                            display: 'flex',
                                                            alignItems:
                                                                'center',
                                                            gap: {
                                                                xs: 1, // Smaller gap on mobile
                                                                sm: 1.5,
                                                            },
                                                            transition:
                                                                ANIMATIONS
                                                                    .transitions
                                                                    .normal,
                                                            cursor: 'pointer',
                                                            minWidth: 0, // Allow shrinking
                                                            overflow: 'hidden', // Prevent text overflow
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    COLORS
                                                                        .interactive
                                                                        .pressed,
                                                                transform:
                                                                    ANIMATIONS
                                                                        .hover
                                                                        .lift
                                                                        .transform,
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
                                                                    TYPOGRAPHY
                                                                        .fontSize
                                                                        .sm
                                                                        .body,
                                                            }}
                                                        />
                                                        <Typography
                                                            sx={{
                                                                color: COLORS
                                                                    .text
                                                                    .accent,
                                                                fontSize: {
                                                                    xs: TYPOGRAPHY
                                                                        .fontSize
                                                                        .xs
                                                                        .body, // Smaller on mobile
                                                                    sm: TYPOGRAPHY
                                                                        .fontSize
                                                                        .sm
                                                                        .body,
                                                                },
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
                                </Box>

                                {/* Contact & Action Section */}
                                <Box
                                    sx={{
                                        backgroundColor: COLORS.surface.glass,
                                        backdropFilter:
                                            COMPONENTS.menu.backdropFilter,
                                        border: COMPONENTS.menu.border,
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
                                            href={URLS.githubProfile}
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
                                            href="mailto:bangyenp@gmail.com?subject=Project%20Collaboration"
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
                        <Box
                            id="featured-work"
                            className="featured-work-section"
                        >
                            <Typography
                                sx={{
                                    color: COLORS.text.primary,
                                    fontSize: TYPOGRAPHY.fontSize.lg.h3,
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
                                        lg: 'repeat(2, 1fr)', // Changed from 3 to 2 columns
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
                                                    COMPONENTS.menu
                                                        .backdropFilter,
                                                border: COMPONENTS.menu.border,
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
                                                        'translateY(-2px)',
                                                    boxShadow:
                                                        COLORS.shadows.lg,
                                                    backgroundColor:
                                                        COLORS.interactive
                                                            .selected,
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
                                                                .xs.caption,
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
                                                            'hsla(141, 64%, 49%, 0.1)', // 10% opacity
                                                        color: COLORS.accent
                                                            .success,
                                                        border: '1px solid hsla(141, 64%, 49%, 0.2)', // 20% opacity
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
                                                    COMPONENTS.menu
                                                        .backdropFilter,
                                                border: COMPONENTS.menu.border,
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
                                                        'translateY(-2px)',
                                                    boxShadow:
                                                        COLORS.shadows.lg,
                                                    backgroundColor:
                                                        COLORS.interactive
                                                            .selected,
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
                                                                .xs.caption,
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
