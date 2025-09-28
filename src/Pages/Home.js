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
    COLORS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
    COMPONENTS,
} from '../config/constants';

import {
    MenuRounded,
    GitHub,
    Code,
    Cloud,
    Psychology,
    Work,
    LocationOn,
    OpenInNew,
} from '@mui/icons-material';

import { Typography, Box, Menu, MenuItem, Chip, Fade } from '@mui/material';

function dropdown(name, options) {
    const padHeight = COMPONENTS.menu.padding.height;
    const padWidth = COMPONENTS.menu.padding.width;

    return (
        <Box>
            {Object.keys(options).map(text => (
                <MenuItem
                    sx={{
                        paddingBottom: padHeight,
                        paddingTop: padHeight,
                        paddingLeft: padWidth,
                        paddingRight: padWidth,
                        borderRadius: SPACING.borderRadius.small,
                        margin: '0.25rem 0.5rem', // 4px 8px
                        transition: ANIMATIONS.menuHover.transition,
                        '&:hover': {
                            backgroundColor: COMPONENTS.overlays.light,
                            transform: ANIMATIONS.menuHover.transform,
                        },
                    }}
                    key={text}
                    component={Link}
                    to={text.toLowerCase()}
                >
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: TYPOGRAPHY.fontWeight.medium }}
                    >
                        {text.replace('_', ' ')}
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
                        borderRadius: SPACING.borderRadius.medium,
                        backdropFilter: COMPONENTS.menu.backdropFilter,
                        backgroundColor: COMPONENTS.menu.backgroundColor,
                        border: COMPONENTS.menu.border,
                        boxShadow: COMPONENTS.menu.boxShadow,
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
        document.title = `${PERSONAL_INFO.name} - ${PERSONAL_INFO.title}`;
    }, []);

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: {
                    xs: SPACING.padding.xs,
                    sm: SPACING.padding.sm,
                    md: SPACING.padding.md,
                },
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',
            }}
        >
            {/* Background Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: COLORS.background.default,
                    zIndex: -2,
                }}
            />

            {/* Navigation */}
            <Grid
                container
                direction="row"
                spacing={2}
                sx={{
                    zIndex: 1,
                    marginBottom: {
                        xs: SPACING.margin.xs,
                        sm: SPACING.margin.sm,
                        md: SPACING.margin.md,
                    },
                }}
            >
                <MenuButton>{dropdown('Projects', pages)}</MenuButton>
                <TooltipButton
                    href={URLS.github}
                    title="GitHub"
                    Icon={GitHub}
                />
            </Grid>

            {/* Hero Section */}
            <Grid
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{
                    zIndex: 1,
                    padding: {
                        xs: `${SPACING.padding.xs} 0`,
                        sm: `${SPACING.padding.sm} 0`,
                        md: `${SPACING.padding.md} 0`,
                    },
                    minHeight: 0, // Prevents flex item from overflowing
                }}
            >
                <Fade in timeout={ANIMATIONS.fadeIn.timeout}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: SPACING.maxWidth.content,
                            width: '100%',
                            padding: {
                                xs: '0 0.5rem',
                                sm: `0 ${SPACING.padding.sm}`,
                                md: `0 ${SPACING.padding.md}`,
                            },
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                color: 'text.primary',
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                marginBottom: 2,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.xs.h1,
                                    sm: TYPOGRAPHY.fontSize.sm.h1,
                                    md: TYPOGRAPHY.fontSize.md.h1,
                                },
                            }}
                        >
                            {PERSONAL_INFO.greeting}
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 2,
                                fontWeight: TYPOGRAPHY.fontWeight.normal,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.xs.h5,
                                    sm: TYPOGRAPHY.fontSize.sm.h5,
                                },
                            }}
                        >
                            {PERSONAL_INFO.title}
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 4,
                                fontWeight: TYPOGRAPHY.fontWeight.light,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.xs.h6,
                                    sm: TYPOGRAPHY.fontSize.sm.h6,
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                            }}
                        >
                            <LocationOn fontSize="small" />
                            {PERSONAL_INFO.location}
                        </Typography>

                        {/* Technical Skills */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, 1fr)',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                gap: { xs: 1, sm: 2 },
                                justifyContent: 'center',
                                marginBottom: { xs: 3, sm: 4 },
                                maxWidth: SPACING.maxWidth.skills,
                                margin: {
                                    xs: `0 auto ${SPACING.margin.xs} auto`,
                                    sm: `0 auto ${SPACING.margin.sm} auto`,
                                },
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            {SKILLS.map(skill => {
                                const IconComponent =
                                    skill.icon === 'Code'
                                        ? Code
                                        : skill.icon === 'Psychology'
                                          ? Psychology
                                          : skill.icon === 'Cloud'
                                            ? Cloud
                                            : Work;

                                return (
                                    <Chip
                                        key={skill.name}
                                        icon={<IconComponent />}
                                        label={skill.name}
                                        variant="outlined"
                                        size="large"
                                        sx={{
                                            borderColor:
                                                COMPONENTS.overlays.light,
                                            color: 'primary.light',
                                            padding: {
                                                xs: COMPONENTS.chip.padding.xs,
                                                sm: COMPONENTS.chip.padding.sm,
                                            },
                                            height: {
                                                xs: COMPONENTS.chip.height.xs,
                                                sm: COMPONENTS.chip.height.sm,
                                            },
                                            fontSize: {
                                                xs: TYPOGRAPHY.fontSize.xs.body,
                                                sm: TYPOGRAPHY.fontSize.sm.body,
                                            },
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                backgroundColor:
                                                    COMPONENTS.hsl.hover.light, // Using raised background for hover
                                            },
                                            '& .MuiChip-icon': {
                                                marginLeft: {
                                                    xs: COMPONENTS.chip
                                                        .iconMargin.left.xs,
                                                    sm: COMPONENTS.chip
                                                        .iconMargin.left.sm,
                                                },
                                                marginRight: {
                                                    xs: COMPONENTS.chip
                                                        .iconMargin.right.xs,
                                                    sm: COMPONENTS.chip
                                                        .iconMargin.right.sm,
                                                },
                                            },
                                        }}
                                    />
                                );
                            })}
                        </Box>

                        {/* Professional Highlights */}
                        <Box
                            sx={{
                                marginTop: { xs: 4, sm: 5, md: 6 },
                                maxWidth: SPACING.maxWidth.wide,
                                textAlign: 'left',
                                width: '100%',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.light',
                                    marginBottom: 3,
                                    textAlign: 'center',
                                    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
                                }}
                            >
                                Research Publications
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: '1fr 1fr',
                                    },
                                    gap: { xs: 2, sm: 3 },
                                }}
                            >
                                {PUBLICATIONS.map(publication => (
                                    <Box
                                        key={publication.title}
                                        component="a"
                                        href={publication.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            padding: { xs: 1.5, sm: 2 },
                                            backgroundColor:
                                                COMPONENTS.card.backgroundColor,
                                            borderRadius:
                                                COMPONENTS.card.borderRadius,
                                            border: COMPONENTS.card.border,
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            transition:
                                                ANIMATIONS.hover.transition,
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                backgroundColor:
                                                    COMPONENTS.hsl.hover.medium, // Using raised background for hover
                                                transform:
                                                    ANIMATIONS.hover.transform,
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: 'secondary.light',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semiBold,
                                                marginBottom: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {publication.title}
                                            <OpenInNew fontSize="small" />
                                        </Typography>
                                        <Box sx={{ marginBottom: 1 }}>
                                            <Chip
                                                label={publication.conference}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        COMPONENTS.badge
                                                            .backgroundColor,
                                                    color: COMPONENTS.badge
                                                        .color,
                                                    border: COMPONENTS.badge
                                                        .border,
                                                    fontSize:
                                                        COMPONENTS.badge
                                                            .fontSize,
                                                    height: COMPONENTS.badge
                                                        .height,
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {publication.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Projects Section */}
                        <Box
                            sx={{
                                marginTop: { xs: 4, sm: 5, md: 6 },
                                maxWidth: SPACING.maxWidth.wide,
                                textAlign: 'left',
                                width: '100%',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'primary.light',
                                    marginBottom: 3,
                                    textAlign: 'center',
                                    fontWeight: TYPOGRAPHY.fontWeight.semiBold,
                                }}
                            >
                                Featured Projects
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: '1fr 1fr',
                                    },
                                    gap: { xs: 2, sm: 3 },
                                }}
                            >
                                {PROJECTS.map(project => (
                                    <Box
                                        key={project.title}
                                        component="a"
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            padding: { xs: 1.5, sm: 2 },
                                            backgroundColor:
                                                COMPONENTS.card.backgroundColor,
                                            borderRadius:
                                                COMPONENTS.card.borderRadius,
                                            border: COMPONENTS.card.border,
                                            textDecoration: 'none',
                                            cursor: 'pointer',
                                            transition:
                                                ANIMATIONS.hover.transition,
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                backgroundColor:
                                                    COMPONENTS.hsl.hover.medium, // Using raised background for hover
                                                transform:
                                                    ANIMATIONS.hover.transform,
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: 'secondary.light',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semiBold,
                                                marginBottom: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {project.title}
                                            <GitHub fontSize="small" />
                                        </Typography>
                                        <Box sx={{ marginBottom: 1 }}>
                                            <Chip
                                                label={project.technology}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        COMPONENTS.badge
                                                            .backgroundColor,
                                                    color: COMPONENTS.badge
                                                        .color,
                                                    border: COMPONENTS.badge
                                                        .border,
                                                    fontSize:
                                                        COMPONENTS.badge
                                                            .fontSize,
                                                    height: COMPONENTS.badge
                                                        .height,
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                            }}
                                        >
                                            {project.description}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Grid>

            {/* Clean background without animation */}
        </Grid>
    );
}
