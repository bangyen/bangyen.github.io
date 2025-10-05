import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box, Fade } from '@mui/material';
import { HomeButton } from '../helpers';
import { PAGE_TITLES } from '../config/constants';
import { COLORS, SPACING, TYPOGRAPHY } from '../config/theme';

export default function Error() {
    document.title = PAGE_TITLES.error;
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
                        xs: `${SPACING.padding.xs} 0`,
                        sm: `${SPACING.padding.sm} 0`,
                        md: `${SPACING.padding.md} 0`,
                    },
                    minHeight: 0,
                }}
            >
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: SPACING.maxWidth.error,
                            width: '100%',
                            padding: {
                                xs: '0 1rem',
                                sm: '0 1.5rem',
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
                                fontSize: TYPOGRAPHY.fontSize.lg.display,
                            }}
                        >
                            404
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 2,
                                fontWeight: TYPOGRAPHY.fontWeight.normal,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.sm.h6,
                                    sm: TYPOGRAPHY.fontSize.sm.h5,
                                },
                            }}
                        >
                            Page Not Found
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 4,
                                fontWeight: TYPOGRAPHY.fontWeight.light,
                                fontSize: {
                                    xs: TYPOGRAPHY.fontSize.xs.h6,
                                    sm: TYPOGRAPHY.fontSize.sm.body,
                                },
                            }}
                        >
                            This page isn&apos;t available. The link you
                            followed may be broken, or the page may have been
                            removed.
                        </Typography>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
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
