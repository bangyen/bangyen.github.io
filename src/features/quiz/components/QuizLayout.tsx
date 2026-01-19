import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';

import {
    InfoRounded as InfoIcon,
    HomeRounded as HomeIcon,
} from '@mui/icons-material';
import { Grid as MuiGrid } from '../../../components/mui';
import { COLORS, TYPOGRAPHY } from '../../../config/theme';

interface QuizLayoutProps {
    title: string;
    subtitle?: string;
    infoUrl: string;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({
    title,
    subtitle,
    infoUrl,
    children,
    headerContent,
}) => {
    return (
        <Grid
            container
            minHeight="100vh"
            flexDirection="column"
            alignItems="center"
            sx={{
                background: COLORS.surface.background,
                py: 8,
                px: { xs: 2, sm: 4 },
                width: '100%',
            }}
        >
            <Box
                sx={{
                    mb: 6,
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: 800,
                    mx: 'auto',
                    marginBottom: 0,
                }}
            >
                <MuiGrid
                    container={true}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ marginBottom: 4 }}
                >
                    <MuiGrid
                        size={{ xs: 'grow', sm: 'auto' }}
                        sx={{
                            display: 'flex',
                            justifyContent: {
                                xs: 'flex-start',
                                sm: 'flex-start',
                            },
                            mb: 0,
                            minWidth: 0,
                        }}
                    >
                        {!headerContent ? (
                            <Typography
                                variant="h1"
                                sx={{
                                    color: COLORS.text.primary,
                                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                                    fontSize: TYPOGRAPHY.fontSize.h2,
                                }}
                            >
                                {title}
                            </Typography>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        display: { xs: 'none', sm: 'block' },
                                    }}
                                >
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            color: COLORS.text.primary,
                                            fontWeight:
                                                TYPOGRAPHY.fontWeight.bold,
                                            fontSize: TYPOGRAPHY.fontSize.h2,
                                        }}
                                    >
                                        {title}
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        display: { xs: 'block', sm: 'none' },
                                    }}
                                >
                                    {headerContent}
                                </Box>
                            </>
                        )}
                    </MuiGrid>
                    {headerContent && (
                        <MuiGrid
                            size={{ xs: 0, sm: 'auto' }}
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                                flex: 1,
                                justifyContent: 'center',
                                px: 4,
                            }}
                        >
                            {headerContent}
                        </MuiGrid>
                    )}
                    <MuiGrid size="auto" sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            href={infoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <InfoIcon
                                sx={{
                                    fontSize: {
                                        xs: TYPOGRAPHY.fontSize.h2,
                                        sm: '2rem',
                                    },
                                }}
                            />
                        </IconButton>
                        <IconButton component="a" href="/">
                            <HomeIcon
                                sx={{
                                    fontSize: {
                                        xs: TYPOGRAPHY.fontSize.h2,
                                        sm: '2rem',
                                    },
                                }}
                            />
                        </IconButton>
                    </MuiGrid>
                </MuiGrid>

                {subtitle && (
                    <Typography
                        variant="h5"
                        sx={{
                            color: COLORS.text.secondary,
                            marginTop: 2,
                            marginBottom: 4,
                            fontWeight: TYPOGRAPHY.fontWeight.normal,
                            fontSize: TYPOGRAPHY.fontSize.subheading,
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>

            {children}
        </Grid>
    );
};

export default QuizLayout;
