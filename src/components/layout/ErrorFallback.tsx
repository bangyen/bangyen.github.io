import { Typography, Box, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { Refresh, HomeRounded } from '../icons';

import { ErrorCard } from '@/components/ui/ErrorCard';
import {
    errorContainerSx,
    errorButtonSx,
} from '@/components/ui/ErrorCard.styles';
import { COLORS, TYPOGRAPHY, SPACING } from '@/config/theme';

export interface ErrorFallbackProps {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    onReload: () => void;
    onReset: () => void;
}

/**
 * App-level error fallback rendered when the root ErrorBoundary catches
 * an unhandled error.  Presents a glass card with the error summary,
 * optional dev-only stack trace, and reload / retry / home actions.
 */
export function ErrorFallback({
    error,
    errorInfo,
    onReload,
    onReset,
}: ErrorFallbackProps): React.ReactElement {
    const devDetail = (typeof process === 'undefined'
        ? import.meta.env.DEV
        : process.env['NODE_ENV'] === 'development') &&
        error && (
            <Box
                sx={{
                    backgroundColor: COLORS.surface.elevated,
                    border: `1px solid ${COLORS.border.subtle}`,
                    borderRadius: SPACING.borderRadius.md,
                    padding: 2,
                    marginBottom: 3,
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
        );

    return (
        <Box sx={errorContainerSx}>
            <ErrorCard
                title="Something went wrong"
                message="An unexpected error occurred while rendering this page."
                detail={devDetail || undefined}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Refresh />}
                    onClick={onReload}
                    sx={errorButtonSx}
                >
                    Reload Page
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={onReset}
                    sx={errorButtonSx}
                >
                    Try Again
                </Button>
                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    startIcon={<HomeRounded />}
                    sx={errorButtonSx}
                >
                    Back to Home
                </Button>
            </ErrorCard>
        </Box>
    );
}
