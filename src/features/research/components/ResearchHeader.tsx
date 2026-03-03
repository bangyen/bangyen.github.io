import type { SxProps, Theme } from '@mui/material';
import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import { ArrowBackRounded as Back } from '@/components/icons';
import { COLORS, TYPOGRAPHY } from '@/config/theme';
import { useMobileContext } from '@/hooks';

const backButtonBase: SxProps<Theme> = {
    color: COLORS.text.secondary,
    padding: 0,
    minWidth: 0,
    '&:hover': {
        backgroundColor: 'transparent',
        color: COLORS.primary.main,
    },
    alignSelf: { xs: 'center', sm: 'flex-end' },
    textTransform: 'none',
    fontSize: '0.8rem',
};

/** Back button with no bottom margin (used in mobile back-button mode). */
const backButtonFlushSx: SxProps<Theme> = {
    ...backButtonBase,
    marginBottom: 0,
};

/** Back button pulled up slightly (used alongside the title row). */
const backButtonPulledSx: SxProps<Theme> = {
    ...backButtonBase,
    marginBottom: -2,
};

/** Subtitle typography shown when not in mobile back-button mode. */
const subtitleSx: SxProps<Theme> = {
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
};

/** Outermost column container for the header area. */
const headerContainerSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: { xs: 'center', md: 'flex-start' },
    gap: 2,
    marginBottom: { xs: 3, md: 4 },
    width: '100%',
};

/** Row that holds the title and subtitle side by side. */
const headerRowSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: {
        xs: 'center',
        md: 'baseline',
    },
    width: '100%',
};

/** Main h1 title text. */
const headerTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.h2,
    textAlign: { xs: 'center', md: 'left' },
};

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
            <Typography variant="h2" sx={subtitleSx}>
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
