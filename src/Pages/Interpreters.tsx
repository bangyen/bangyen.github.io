import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Box, IconButton, Fade } from '../components/mui';
import {
    GitHub,
    HomeRounded as Home,
    GridView,
    TextFields,
} from '../components/icons';
import { URLS, PAGE_TITLES } from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../config/theme';
import { GlassCard } from '../helpers';

interface Interpreter {
    name: string;
    path: string;
    description: string;
    icon: React.ReactElement;
    category: string;
}

// Type assertion for GlassCard component
const TypedGlassCard = GlassCard as React.ComponentType<{
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
}>;

export default function Interpreters(): React.ReactElement {
    useEffect(() => {
        document.title = PAGE_TITLES.interpreters;
    }, []);

    const interpreters: Interpreter[] = [
        {
            name: 'Stun Step',
            path: '/Stun_Step',
            description:
                'Ultra-minimal tape-based language with only four commands for basic computation',
            icon: <TextFields />,
            category: 'Text',
        },
        {
            name: 'Suffolk',
            path: '/Suffolk',
            description:
                'Register-based language with input/output capabilities and looping behavior',
            icon: <TextFields />,
            category: 'Text',
        },
        {
            name: 'WII2D',
            path: '/WII2D',
            description:
                '2D grid language with directional movement, arithmetic operations, and teleportation',
            icon: <GridView />,
            category: 'Grid',
        },
        {
            name: 'Back',
            path: '/Back',
            description:
                'Grid-based language with mirror reflections, tape manipulation, and conditional logic',
            icon: <GridView />,
            category: 'Grid',
        },
    ];

    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: { xs: '1rem', md: '2rem' },
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
                    background: COLORS.surface.background,
                    zIndex: -2,
                }}
            />

            {/* Main Content */}
            <Grid
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{
                    zIndex: 1,
                    padding: {
                        xs: '0.5rem 0',
                        md: `${SPACING.padding.md} 0`,
                    },
                    minHeight: 0,
                }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: SPACING.maxWidth.md,
                        width: '100%',
                        padding: {
                            xs: '0 0.5rem',
                            md: `0 ${SPACING.padding.md}`,
                        },
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            marginBottom: 4,
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: COLORS.text.primary,
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.subheading,
                                    md: TYPOGRAPHY.fontSize.h2,
                                },
                            }}
                        >
                            Esolang Interpreters
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                href={URLS.esolangsRepo}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitHub
                                    sx={{
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                    }}
                                />
                            </IconButton>
                            <IconButton component={Link} to="/">
                                <Home
                                    sx={{
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                    }}
                                />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Interpreters Grid */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr',
                            },
                            gap: { xs: 2, md: 3 },
                            marginTop: 4,
                        }}
                    >
                        {interpreters.map((interpreter, index) => (
                            <Fade
                                in
                                timeout={800 + index * 150}
                                key={interpreter.name}
                            >
                                <Box
                                    component={Link}
                                    to={interpreter.path}
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
                                    <TypedGlassCard sx={{ border: 'none' }}>
                                        <Box
                                            sx={{
                                                ...COMPONENT_VARIANTS.flexCenter,
                                                gap: 1,
                                                marginBottom: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    color: COLORS.primary.main,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {interpreter.icon}
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    color: COLORS.primary.main,
                                                    fontWeight:
                                                        TYPOGRAPHY.fontWeight
                                                            .semibold,
                                                    fontSize:
                                                        TYPOGRAPHY.fontSize
                                                            .body,
                                                }}
                                            >
                                                {interpreter.name}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: COLORS.text.secondary,
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word',
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {interpreter.description}
                                        </Typography>
                                    </TypedGlassCard>
                                </Box>
                            </Fade>
                        ))}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

