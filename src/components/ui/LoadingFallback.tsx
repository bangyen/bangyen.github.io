import { Box, Typography } from '@mui/material';
import React from 'react';

import { COLORS } from '@/config/theme';

interface LoadingFallbackProps {
    /** Text displayed while loading. */
    message?: string;
    /** Height of the container — accepts any CSS value or a number (px). */
    height?: string | number;
}

/**
 * Shared loading placeholder used as a Suspense fallback throughout the app.
 *
 * Centralises the loading UI so every Suspense boundary renders a consistent
 * indicator rather than ad-hoc inline `<div>` / `<Box>` blocks.
 */
export function LoadingFallback({
    message = 'Loading...',
    height = '100vh',
}: LoadingFallbackProps): React.ReactElement {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height,
                color: COLORS.text.primary,
            }}
        >
            <Typography>{message}</Typography>
        </Box>
    );
}
