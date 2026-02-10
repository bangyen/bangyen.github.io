import React from 'react';

import { ArrowBackRounded as Back } from '@/components/icons';
import { Box, Typography, Button } from '@/components/mui';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

interface ResearchHeaderProps {
    title: string;
    subtitle: string;
    backUrl?: string;
    isMobile: boolean;
}

export function ResearchHeader({
    title,
    subtitle,
    backUrl,
    isMobile,
}: ResearchHeaderProps) {
    const backButton = (margin: number) => (
        <Button
            component="a"
            href={`#${backUrl ?? ''}`}
            startIcon={<Back />}
            size="small"
            sx={{
                color: COLORS.text.secondary,
                padding: 0,
                minWidth: 0,
                '&:hover': {
                    backgroundColor: 'transparent',
                    color: COLORS.primary.main,
                },
                marginBottom: margin,
                alignSelf: { xs: 'center', sm: 'flex-end' },
                textTransform: 'none',
                fontSize: '0.8rem',
            }}
        >
            Back to Simulation
        </Button>
    );

    let subtitleComponent;

    if (backUrl && isMobile) {
        subtitleComponent = backButton(0);
    } else {
        subtitleComponent = (
            <Typography
                variant="h5"
                sx={{
                    color: COLORS.text.secondary,
                    fontSize: TYPOGRAPHY.fontSize.subheading,
                    textAlign: {
                        xs: 'center',
                        md: 'right',
                    },
                    whiteSpace: {
                        xs: 'normal',
                        md: 'nowrap',
                    },
                    display: { xs: 'none', sm: 'block' },
                }}
            >
                {subtitle}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: 2,
                marginBottom: { xs: 3, md: 4 },
                width: '100%',
            }}
        >
            {backUrl && !isMobile && backButton(-2)}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: {
                        xs: 'center',
                        md: 'baseline',
                    },
                    width: '100%',
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        color: COLORS.text.primary,
                        fontWeight: TYPOGRAPHY.fontWeight.bold,
                        fontSize: TYPOGRAPHY.fontSize.h2,
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >
                    {title}
                </Typography>

                {subtitleComponent}
            </Box>
        </Box>
    );
}
