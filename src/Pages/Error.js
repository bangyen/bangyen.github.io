import React from 'react';
import Grid from '@mui/material/Grid2';
import { Typography, Box, Fade } from '@mui/material';
import { HomeButton } from '../helpers';

export default function Error() {
    document.title = 'Page Not Found | Bangyen';
    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: { xs: '1rem', sm: '1.5rem', md: '2rem' },
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
                    background: '#0a0a0a',
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
                    padding: { xs: '1rem 0', sm: '1.5rem 0', md: '2rem 0' },
                    minHeight: 0,
                }}
            >
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            textAlign: 'center',
                            maxWidth: '600px',
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
                                background:
                                    'linear-gradient(135deg, #ffffff, #808080)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 700,
                                marginBottom: 2,
                                fontSize: {
                                    xs: '2.5rem',
                                    sm: '3.5rem',
                                    md: '4rem',
                                },
                            }}
                        >
                            404
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 2,
                                fontWeight: 400,
                                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                            }}
                        >
                            Page Not Found
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                marginBottom: 4,
                                fontWeight: 300,
                                fontSize: { xs: '0.9rem', sm: '1rem' },
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
