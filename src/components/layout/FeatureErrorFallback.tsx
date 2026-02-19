import { Box } from '@mui/material';
import React from 'react';

import { DevErrorDetail } from '@/components/ui/DevErrorDetail';
import {
    TryAgainButton,
    ReturnToHomeButton,
} from '@/components/ui/ErrorActions';
import { ErrorCard } from '@/components/ui/ErrorCard';
import { errorContainerSx } from '@/components/ui/ErrorCard.styles';
import { ERROR_TEXT } from '@/config/constants';

export interface FeatureErrorFallbackProps {
    error: Error | null;
    resetErrorBoundary: () => void;
    /** Heading shown above the error message, e.g. "Game Error". */
    title?: string;
    /** Label for the reset button, e.g. "Reset Game". */
    resetLabel?: string;
}

/**
 * Compact error fallback used inside feature-level error boundaries
 * (games, research, etc.).  Renders a centered glass card with a
 * standardized error message, optional dev-only details, a reset
 * button, and a link back to the home page.
 */
export function FeatureErrorFallback({
    error,
    resetErrorBoundary,
    title = ERROR_TEXT.title.default,
    resetLabel = ERROR_TEXT.labels.tryAgain,
}: FeatureErrorFallbackProps) {
    const devDetail = error ? (
        <DevErrorDetail error={error} maxHeight="200px" />
    ) : null;

    return (
        <Box sx={errorContainerSx}>
            <ErrorCard
                title={title}
                message={ERROR_TEXT.message.default}
                detail={devDetail || undefined}
            >
                <TryAgainButton onClick={resetErrorBoundary}>
                    {resetLabel}
                </TryAgainButton>
                <ReturnToHomeButton />
            </ErrorCard>
        </Box>
    );
}
