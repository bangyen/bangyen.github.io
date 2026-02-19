import { Box } from '@mui/material';
import React from 'react';

import { DevErrorDetail } from '@/components/ui/DevErrorDetail';
import { ReloadButton, ReturnToHomeButton } from '@/components/ui/ErrorActions';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { errorContainerSx } from '@/components/ui/ErrorCard.styles';
import { ERROR_TEXT } from '@/config/constants';

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
    const devDetail = error ? (
        <DevErrorDetail
            error={error}
            componentStack={errorInfo?.componentStack ?? undefined}
            maxHeight="300px"
        />
    ) : null;

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
