import type { SxProps, Theme } from '@mui/material';
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

interface BackButtonProps {
    backUrl: string;
    sx: SxProps<Theme>;
}

/**
 * Small presentational component for the "Back to Simulation" link.
 * Extracted from `ResearchHeader` so the inline closure is replaced
 * by a declarative component with an explicit props contract.
 */
function BackButton({ backUrl, sx }: BackButtonProps) {
    return (
        <Button
            component="a"
            href={`#${backUrl}`}
            startIcon={<Back />}
            size="small"
            sx={sx}
        >
            Back to Simulation
        </Button>
    );
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

    const subtitleComponent =
        backUrl && isMobile ? (
            <BackButton backUrl={backUrl} sx={backButtonFlushSx} />
        ) : (
            <Typography variant="h5" sx={subtitleSx}>
                {subtitle}
            </Typography>
        );

    return (
        <Box sx={headerContainerSx}>
            {backUrl && !isMobile && (
                <BackButton backUrl={backUrl} sx={backButtonPulledSx} />
            )}

            <Box sx={headerRowSx}>
                <Typography variant="h1" sx={headerTitleSx}>
                    {title}
                </Typography>

                {subtitleComponent}
            </Box>
        </Box>
    );
});
