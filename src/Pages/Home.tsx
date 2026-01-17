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
    GitHub,
    Work,
    LocationOn,
    OpenInNew,
    ArrowForward,
    Code,
    Psychology,
    GamepadRounded,
    ViewModuleRounded,
} from '../components/icons';

interface ProjectInfo {
    path: string;
    description: string;
    technology: string;
}

interface ProjectCategory {
    title: string;
    icon: React.ElementType;
    color: string;
    projects: Record<string, ProjectInfo>;
}

const PROJECT_CATEGORIES: Record<string, ProjectCategory> = {
    research: {
        title: 'Research',
        icon: Psychology,
        color: COLORS.data.green,
        projects: {
            ZSharp: {
                path: '/ZSharp',
                description: 'ML optimization method',
                technology: 'PyTorch',
            },
            Oligopoly: {
                path: '/Oligopoly',
                description: 'Market simulation model',
                technology: 'FastAPI',
            },
        },
    },
    games: {
        title: 'Games',
        icon: GamepadRounded,
        color: COLORS.primary.main,
        projects: {
            Snake: {
                path: '/Snake',
                description: 'Retro arcade gameplay',
                technology: 'JavaScript',
            },
            Lights_Out: {
                path: '/Lights_Out',
                description: 'Grid-based logic puzzle',
                technology: 'JavaScript',
            },
            CCTLD: {
                path: '/cctld',
                description: 'Country Code Mastery',
                technology: 'React',
            },
            Driving_Side: {
                path: '/driving_side',
                description: 'Left or Right?',
                technology: 'React',
            },
            Telephone_Code: {
                path: '/telephone_quiz',
                description: 'Calling code master',
                technology: 'React',
            },
            Vehicle_Registration: {
                path: '/vehicle_registration_quiz',
                description: 'Car code identifier',
                technology: 'React',
            },
        },
    },
    tools: {
        title: 'Tools',
        icon: Code,
        color: COLORS.data.amber,
        projects: {
            Interpreters: {
                path: '/Interpreters',
                description: 'Esoteric language demos',
                technology: 'JavaScript',
            },
        },
    },
};

function ProjectDropdown(): React.ReactElement {
    return (
        <Box sx={{ padding: '16px 16px 0 16px' }}>
            {Object.entries(PROJECT_CATEGORIES).map(
                ([categoryKey, category]) => {
                    const IconComponent = category.icon;
                    return (
                        <Box key={categoryKey} sx={{ marginBottom: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    padding: '8px 0 4px 0',
                                    marginBottom: 0.5,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '1px',
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.05)',
                                    },
                                }}
                            >
                                <IconComponent
                                    sx={{
                                        color: '#4C78FF',
                                        fontSize: '14px',
                                        opacity: 0.7,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: 'rgba(157, 163, 174, 0.7)',
                                        fontSize: '10px',
                                        fontWeight: 500,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.14em',
                                        fontFamily:
                                            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                                    }}
                                >
                                    {category.title}
                                </Typography>
                            </Box>

                            {Object.entries(category.projects).map(
                                ([projectName, project]) => (
                                    <MenuItem
                                        key={projectName}
                                        component={Link}
                                        to={project.path}
                                        sx={{
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            margin: '0',
                                            minHeight: '40px',
                                            transition: 'all 120ms ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            gap: '6px',
                                            '&:hover': {
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.06)',
                                                transform: 'translateY(-1px)',
                                            },
                                            '&:active': {
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.08)',
                                            },
                                            '&:focus-visible': {
                                                outline: 'none',
                                                ring: '1px solid rgba(255, 255, 255, 0.2)',
                                                ringOffset: '0',
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '15px',
                                                lineHeight: 1.6,
                                                color: '#EDEDED',
                                            }}
                                        >
                                            {projectName.replace('_', ' ')}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color: 'rgba(157, 163, 174, 0.8)',
                                                fontSize: '12px',
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            {project.description}
                                        </Typography>
                                    </MenuItem>
                                )
                            )}
                        </Box>
                    );
                }
            )}
        </Box>
    );
}

function clickHandler(setAnchor: (anchor: HTMLElement | null) => void) {
    return (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    };
}

function closeHandler(setAnchor: (anchor: null) => void) {
    return () => {
        setAnchor(null);
    };
}

function MenuButton(): React.ReactElement {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const handleClick = clickHandler(setAnchor);
    const handleClose = closeHandler(setAnchor);
    const open = Boolean(anchor);

    const define = (value: string | undefined) => {
        return open ? value : undefined;
    };

    return (
        <Box>
            <TooltipButton
                title="Projects Menu"
                id="projects-menu-button"
                Icon={ViewModuleRounded}
                aria-controls={define('projects-menu')}
                aria-expanded={define('true')}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{
                    '&:hover': {
                        backgroundColor: COLORS.interactive.hover,
                        transform: 'scale(1.05)',
                    },
                }}
            />
            <Menu
                id="projects-menu"
                open={open}
                anchorEl={anchor}
                disableAutoFocusItem={true}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'transparent',
                        backdropFilter: 'none',
                    },
                }}
                sx={{
                    marginLeft: 1,
                    marginTop: 1,
                    '& .MuiPaper-root': {
                        width: 'auto',
                        maxWidth: '300px',
                        height: 'auto !important',
                        backgroundColor: 'rgba(11, 11, 12, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: 0,
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
                        transition: 'all 140ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                        transform: open
                            ? 'translateY(0) scale(1)'
                            : 'translateY(8px) scale(0.98)',
                        opacity: open ? 1 : 0,
                    },
                }}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'projects-menu-button',
                    sx: {
                        padding: 0,
                        height: 'auto',
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <ProjectDropdown />
            </Menu>
        </Box>
    );
}

export default function Home(): React.ReactElement {
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
            <Box
                sx={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    right: 0,
                    padding: { xs: '0.5rem', md: '1.5rem' },
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '100%',
                    overflowX: 'hidden',
                }}
            >
                <MenuButton />
                <TooltipButton
                    component="a"
                    href={URLS.githubProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                    Icon={GitHub}
                />
            </Box>

            <Box
                sx={{
                    height: { xs: '2rem', md: '5rem' },
                }}
            />

            <HeroContainer>
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
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
                                        fontWeight:
                                            TYPOGRAPHY.fontWeight.semibold,
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
                                            borderRadius:
                                                SPACING.borderRadius.full,
                                            transition: ANIMATIONS.transition,
                                            cursor: 'pointer',
                                            '&:hover': {
                                                backgroundColor:
                                                    'hsla(217, 91%, 60%, 0.15)',
                                                transform:
                                                    'scale(1.02) translateY(-1px)',
                                                boxShadow:
                                                    '0 4px 20px hsla(0, 0%, 0%, 0.25)',
                                            },
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
                                                                    'nowrap',
                                                                overflow:
                                                                    'hidden',
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
                                                        COLORS.interactive
                                                            .hover,
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
                                                            '0.025em',
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
                                                    lineHeight: 1.4,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {publication.title}
                                            </Typography>

                                            <Box sx={{ marginBottom: 3 }}>
                                                <Box
                                                    sx={{
                                                        borderRadius:
                                                            SPACING.borderRadius
                                                                .full,
                                                        fontSize:
                                                            'clamp(0.7rem, 0.8vw, 0.75rem)',
                                                        fontWeight: 500,
                                                        padding: '4px 12px',
                                                        minHeight:
                                                            SPACING.padding.sm,
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
                                                    lineHeight: 1.5,
                                                    flex: 1,
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
                                                            '0.025em',
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
                                                    lineHeight: 1.4,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                {project.title}
                                            </Typography>

                                            <Box sx={{ marginBottom: 3 }}>
                                                <Box
                                                    sx={{
                                                        borderRadius:
                                                            SPACING.borderRadius
                                                                .full,
                                                        fontSize:
                                                            'clamp(0.7rem, 0.8vw, 0.75rem)',
                                                        fontWeight: 500,
                                                        padding: '4px 12px',
                                                        minHeight:
                                                            SPACING.padding.sm,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        transition:
                                                            'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                                        backgroundColor:
                                                            'hsla(217, 91%, 60%, 0.1)',
                                                        color: COLORS.primary
                                                            .main,
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
                                                    lineHeight: 1.5,
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

            <Box
                sx={{
                    height: { xs: '2rem', md: '5rem' },
                }}
            />
        </Grid>
    );
}
