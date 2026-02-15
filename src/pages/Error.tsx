import { Grid, Typography, Box, Fade, Button } from '@mui/material';
import { Link } from 'react-router-dom';

import { HomeRounded } from '@/components/icons';
import { PAGE_TITLES } from '@/config/constants';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    COMPONENT_VARIANTS,
} from '@/config/theme';

export function Error(): React.ReactElement {
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

                        <Button
                            component={Link}
                            to="/"
                            variant="outlined"
                            startIcon={<HomeRounded />}
                            sx={{
                                borderRadius: SPACING.borderRadius.full,
                                padding: '10px 24px',
                                textTransform: 'none',
                                fontWeight: TYPOGRAPHY.fontWeight.semibold,
                                fontSize: TYPOGRAPHY.fontSize.body,
                                border: `1px solid ${COLORS.primary.main}`,
                                color: COLORS.primary.main,
                                '&:hover': {
                                    backgroundColor: `${COLORS.primary.main}10`,
                                    border: `1px solid ${COLORS.primary.main}`,
                                },
                            }}
                        >
                            Back to Home
                        </Button>
                    </Box>
                </Fade>
            </Grid>
        </Grid>
    );
}
