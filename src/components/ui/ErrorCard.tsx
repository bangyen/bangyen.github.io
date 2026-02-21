import { Typography, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import React from 'react';

import { errorCardSx, errorTitleSx, errorMessageSx } from './ErrorCard.styles';
import { GlassCard } from './GlassCard';

export interface ErrorCardProps {
    /** Bold heading displayed at the top of the card. */
    title: string;
    /** Descriptive text shown below the title (monospace, word-wrapped). */
    message?: string;
    /**
     * Extra content rendered between the message and the action buttons,
     * e.g. a dev-only error stack trace.
     */
    detail?: ReactNode;
    /** Action buttons rendered in a centered row at the bottom. */
    children?: ReactNode;
    /** Style overrides applied to the GlassCard wrapper. */
    sx?: SxProps<Theme>;
}

/**
 * Reusable glass-card error presentation used by every error surface
 * in the app (404 page, app-level crash, feature boundary, modal).
 *
 * Handles only the visual card; the centering wrapper (full-page vs.
 * modal) is the caller's responsibility.
 */
export function ErrorCard({
    title,
    message,
    detail,
    children,
    sx,
}: ErrorCardProps): React.ReactElement {
    return (
        <GlassCard role="alert" sx={[errorCardSx, sx] as SxProps<Theme>}>
            <Typography variant="h5" sx={errorTitleSx}>
                {title}
            </Typography>

            {message && <Typography sx={errorMessageSx}>{message}</Typography>}

            {detail}

            {children && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    {children}
                </Box>
            )}
        </GlassCard>
    );
}
