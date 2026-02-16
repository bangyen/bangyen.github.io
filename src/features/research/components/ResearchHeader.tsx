import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import {
    getBackButtonSx,
    subtitleSx,
    headerContainerSx,
    headerRowSx,
    headerTitleSx,
} from './ResearchHeader.styles';

import { ArrowBackRounded as Back } from '@/components/icons';

export interface ResearchHeaderProps {
    title: string;
    subtitle: string;
    backUrl?: string;
    isMobile: boolean;
}

/**
 * Memoised header for research pages. Prevents re-renders caused by
 * chart data updates in the parent `ResearchDemo`, since its own
 * props (`title`, `subtitle`, `backUrl`, `isMobile`) are stable
 * between those updates.
 */
export const ResearchHeader = React.memo(function ResearchHeader({
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
            sx={getBackButtonSx(margin)}
        >
            Back to Simulation
        </Button>
    );

    const subtitleComponent =
        backUrl && isMobile ? (
            backButton(0)
        ) : (
            <Typography variant="h5" sx={subtitleSx}>
                {subtitle}
            </Typography>
        );

    return (
        <Box sx={headerContainerSx}>
            {backUrl && !isMobile && backButton(-2)}

            <Box sx={headerRowSx}>
                <Typography variant="h1" sx={headerTitleSx}>
                    {title}
                </Typography>

                {subtitleComponent}
            </Box>
        </Box>
    );
});
