import { Typography, Box } from '@mui/material';
import React from 'react';

import { ReloadButton, ReturnToHomeButton } from '@/components/ui/ErrorActions';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { errorContainerSx } from '@/components/ui/ErrorCard.styles';
import { ERROR_TEXT } from '@/config/constants';
import { COLORS, TYPOGRAPHY, SPACING } from '@/config/theme';

export interface ErrorFallbackProps {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    onReload: () => void;
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
                title={ERROR_TEXT.title.default}
                message={ERROR_TEXT.message.appCrash}
                detail={devDetail || undefined}
            >
                <ReloadButton onClick={onReload} />
                <ReturnToHomeButton />
            </ErrorCard>
        </Box>
    );
}
