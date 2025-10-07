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

export default function Error() {
    document.title = PAGE_TITLES.error;
    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: SPACING.responsive.padding,
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
                                color: 'text.secondary',
                                marginBottom: 2,
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.h2,
                                    md: TYPOGRAPHY.fontSize.h2,
                                },
                            }}
                        >
                            Page Not Found
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 4,
                                fontWeight: TYPOGRAPHY.fontWeight.normal,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.body,
                                    md: TYPOGRAPHY.fontSize.body,
                                },
                                lineHeight: 1.5,
                            }}
                        >
                            This page isn&apos;t available. The link you
                            followed may be broken, or the page may have been
                            removed.
                        </Typography>

                        <Box
                            sx={{
                                ...COMPONENT_VARIANTS.flexCenter,
                                marginTop: 4,
                            }}
                        >
                            <HomeButton />
                        </Box>
                    </Box>
                </Fade>
            </Grid>
        </Grid>
    );
}
