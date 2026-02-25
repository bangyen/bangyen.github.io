import { Typography, Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import React from 'react';

import { GlassCard } from './GlassCard';

import { COLORS, SPACING } from '@/config/theme';

/** Full-viewport centering container used by full-page error screens. */
// eslint-disable-next-line react-refresh/only-export-components
export const errorContainerSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    p: 4,
    minHeight: '100vh',
};

/** GlassCard wrapper for error content. */
const errorCardSx: SxProps<Theme> = {
    p: 4,
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
};

/** Error title heading. */
const errorTitleSx: SxProps<Theme> = {
    mb: 2,
    color: COLORS.text.primary,
    fontWeight: 'bold',
};

/** Error message body text. */
const errorMessageSx: SxProps<Theme> = {
    mb: 3,
    color: COLORS.text.secondary,
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
};

/** Shared action button styling with a fixed width for visual consistency. */
// eslint-disable-next-line react-refresh/only-export-components
export const errorButtonSx: SxProps<Theme> = {
    borderRadius: SPACING.borderRadius.md,
    textTransform: 'none',
    width: '180px',
};

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
