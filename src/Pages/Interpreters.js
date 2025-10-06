import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Typography, Box, IconButton, Card, CardContent } from '@mui/material';
import { GitHub, Home, GridView, TextFields } from '@mui/icons-material';
import { URLS, PAGE_TITLES } from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    ANIMATIONS,
    LAYOUT,
} from '../config/theme';
import { COMPONENTS } from '../config/components';

export default function Interpreters() {
    useEffect(() => {
        document.title = PAGE_TITLES.interpreters;
    }, []);

    const interpreters = [
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
                padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
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
                    zIndex: LAYOUT.zIndex.content,
                    padding: {
                        xs: `${SPACING.padding.xs} 0`,
                        sm: `${SPACING.padding.sm} 0`,
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
                            sm: `0 ${SPACING.padding.sm}`,
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
                                color: 'text.primary',
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: {
                                    xs: '1.25rem',
                                    sm: '2.125rem',
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
                                        fontSize: {
                                            xs: TYPOGRAPHY.fontSize.md.h4,
                                            sm: '2rem',
                                        },
                                    }}
                                />
                            </IconButton>
                            <IconButton component={Link} to="/">
                                <Home
                                    sx={{
                                        fontSize: {
                                            xs: TYPOGRAPHY.fontSize.md.h4,
                                            sm: '2rem',
                                        },
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
                                sm: '1fr 1fr',
                            },
                            gap: { xs: 2, sm: 3 },
                            marginTop: 4,
                        }}
                    >
                        {interpreters.map(interpreter => (
                            <Card
                                key={interpreter.name}
                                component={Link}
                                to={interpreter.path}
                                sx={{
                                    padding: { xs: 1.5, sm: 2 },
                                    backgroundColor: COMPONENTS.overlays.light,
                                    borderRadius: SPACING.borderRadius.sm,
                                    border: COMPONENTS.borders.subtle,
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    transition: ANIMATIONS.transitions.normal,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        backgroundColor:
                                            COMPONENTS.overlays.light,
                                        transform: 'translateY(-0.125rem)', // -2px
                                    },
                                }}
                            >
                                <CardContent sx={{ padding: 0 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {interpreter.icon}
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'primary.light',
                                                fontWeight:
                                                    TYPOGRAPHY.fontWeight
                                                        .semibold,
                                                fontSize:
                                                    TYPOGRAPHY.fontSize.md.h5,
                                            }}
                                        >
                                            {interpreter.name}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            wordWrap: 'break-word',
                                            overflowWrap: 'break-word',
                                        }}
                                    >
                                        {interpreter.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}
