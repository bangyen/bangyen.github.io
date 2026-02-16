import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import {
    backButtonFlushSx,
    backButtonPulledSx,
    subtitleSx,
    headerContainerSx,
    headerRowSx,
    headerTitleSx,
} from './ResearchHeader.styles';

import { ArrowBackRounded as Back } from '@/components/icons';
import { useMobileContext } from '@/hooks';

export interface ResearchHeaderProps {
    title: string;
    subtitle: string;
    backUrl?: string;
}

/**
 * Memoised header for research pages. Prevents re-renders caused by
 * chart data updates in the parent `ResearchDemo`, since its own
 * props (`title`, `subtitle`, `backUrl`) are stable between those
 * updates.  Reads mobile state from `MobileProvider` context rather
 * than accepting it as a prop.
 */
export const ResearchHeader = React.memo(function ResearchHeader({
    title,
    subtitle,
    backUrl,
}: ResearchHeaderProps) {
    const { sm: isMobile } = useMobileContext();
    const backButton = (sx: typeof backButtonFlushSx) => (
        <Button
            component="a"
            href={`#${backUrl ?? ''}`}
            startIcon={<Back />}
            size="small"
            sx={sx}
        >
            Back to Simulation
        </Button>
    );

    const subtitleComponent =
        backUrl && isMobile ? (
            backButton(backButtonFlushSx)
        ) : (
            <Typography variant="h5" sx={subtitleSx}>
                {subtitle}
            </Typography>
        );

    return (
        <Box sx={headerContainerSx}>
            {backUrl && !isMobile && backButton(backButtonPulledSx)}

            <Box sx={headerRowSx}>
                <Typography variant="h1" sx={headerTitleSx}>
                    {title}
                </Typography>

                {subtitleComponent}
            </Box>
        </Box>
    );
});
