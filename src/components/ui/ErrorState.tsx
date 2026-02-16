import { Box, Typography } from '@mui/material';
import React from 'react';

import { COLORS, TYPOGRAPHY } from '@/config/theme';

export interface ErrorStateProps {
    /** Message shown to the user. */
    message?: string;
    /** Height of the container — accepts any CSS value or a number (px). */
    height?: string | number;
}

/**
 * Shared inline error placeholder used when a non-critical component
 * fails to load or render. Provides a consistent error appearance
 * across features without requiring a full ErrorBoundary reset flow.
 *
 * For route-level or boundary-level errors, use `FeatureErrorFallback`
 * or `ErrorFallback` instead.
 */
export function ErrorState({
    message = 'Something went wrong. Please try again.',
    height = 200,
}: ErrorStateProps): React.ReactElement {
    return (
        <Box
            role="alert"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height,
                color: COLORS.text.secondary,
            }}
        >
            <Typography
                sx={{
                    fontSize: TYPOGRAPHY.fontSize.body,
                    textAlign: 'center',
                }}
            >
                {message}
            </Typography>
        </Box>
    );
}
