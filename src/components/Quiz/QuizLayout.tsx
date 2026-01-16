import React from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import {
    InfoRounded as InfoIcon,
    HomeRounded as HomeIcon,
} from '@mui/icons-material';
import { Grid as MuiGrid } from '../mui';
import { COLORS, TYPOGRAPHY } from '../../config/theme';

interface QuizLayoutProps {
    title: string;
    subtitle: string;
    infoUrl: string;
    children: React.ReactNode;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({
    title,
    subtitle,
    infoUrl,
    children,
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
                px: 2,
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
                    <MuiGrid size="auto">
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
                    </MuiGrid>
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
                                        md: '2rem',
                                    },
                                }}
                            />
                        </IconButton>
                        <IconButton component="a" href="/">
                            <HomeIcon
                                sx={{
                                    fontSize: {
                                        xs: TYPOGRAPHY.fontSize.h2,
                                        md: '2rem',
                                    },
                                }}
                            />
                        </IconButton>
                    </MuiGrid>
                </MuiGrid>

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
            </Box>

            {children}
        </Grid>
    );
};

export default QuizLayout;
