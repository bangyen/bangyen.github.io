import React from 'react';
import { Grid, Typography, Box, Button } from '../mui';
import { HomeButton } from '../ui/Controls';
import { Refresh } from '../icons';
import {
    COLORS,
    TYPOGRAPHY,
    SPACING,
    COMPONENT_VARIANTS,
} from '../../config/theme';

interface ErrorFallbackProps {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    onReload: () => void;
    onReset: () => void;
}

export function ErrorFallback({
    error,
    errorInfo,
    onReload,
    onReset,
}: ErrorFallbackProps): React.ReactElement {
    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            sx={{
                position: 'relative',
                padding: { xs: '0.5rem', md: '1.5rem' },
                boxSizing: 'border-box',
                background: COLORS.surface.background,
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
                <Box
                    sx={{
                        textAlign: 'center',
                        maxWidth: '32rem',
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
                        Something went wrong
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
                        An unexpected error occurred while rendering this page.
                    </Typography>

                    {process.env.NODE_ENV === 'development' && error && (
                        <Box
                            sx={{
                                backgroundColor: COLORS.surface.elevated,
                                border: `1px solid ${COLORS.border.subtle}`,
                                borderRadius: SPACING.borderRadius.md,
                                padding: 2,
                                marginBottom: 4,
                                textAlign: 'left',
                                overflow: 'auto',
                                maxHeight: '300px',
                            }}
                        >
                            <Typography
                                sx={{
                                    color: COLORS.text.secondary,
                                    fontSize: TYPOGRAPHY.fontSize.caption,
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                }}
                            >
                                {error.toString()}
                                {errorInfo?.componentStack
                                    ?.split('\n')
                                    .slice(0, 5)
                                    .join('\n')}
                            </Typography>
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Refresh />}
                            onClick={onReload}
                        >
                            Reload Page
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onReset}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Box>
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
