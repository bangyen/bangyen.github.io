import React from 'react';
import { Grid, Typography, Box, Fade } from '../components/mui';
import { HomeButton } from '../helpers';
import { PAGE_TITLES } from '../config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '../config/theme';

export default function Error(): React.ReactElement {
    document.title = PAGE_TITLES.error;
    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: { xs: '0.5rem', md: '1.5rem' },
                boxSizing: 'border-box',
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
                sx={{
                    ...COMPONENT_VARIANTS.flexCenter,
                    flexDirection: 'column',
                    zIndex: 1,
                    padding: {
                        xs: '0.5rem 0',
                        md: `${SPACING.padding.md} 0`,
                    },
                    minHeight: 0,
                }}
            >
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: '24rem',
                            width: '100%',
                            padding: {
                                xs: '0 1rem',
                                md: '0 2rem',
                            },
                            boxSizing: 'border-box',
                        }}
                    >
                        <Typography
                            variant="h1"
                            sx={{
                                color: COLORS.text.primary,
                                fontWeight: TYPOGRAPHY.fontWeight.bold,
                                marginBottom: 2,
                                fontSize: TYPOGRAPHY.fontSize.display,
                            }}
                        >
                            404
                        </Typography>

                        <Typography
                            variant="h3"
                            sx={{
                                color: COLORS.text.secondary,
                                fontWeight: TYPOGRAPHY.fontWeight.medium,
                                marginBottom: 4,
                                fontSize: TYPOGRAPHY.fontSize.h2,
                            }}
                        >
                            Page Not Found
                        </Typography>

                        <Typography
                            sx={{
                                color: COLORS.text.secondary,
                                fontSize: TYPOGRAPHY.fontSize.body,
                                lineHeight: 1.5,
                                marginBottom: 4,
                            }}
                        >
                            The page you&apos;re looking for doesn&apos;t exist
                            or has been moved.
                        </Typography>
                    </Box>
                </Fade>
            </Grid>

            {/* Navigation */}
            <Box
                sx={{
                    position: 'absolute',
                    top: { xs: '0.5rem', md: '1.5rem' },
                    left: { xs: '0.5rem', md: '1.5rem' },
                }}
            >
                <HomeButton />
            </Box>
        </Grid>
    );
}

