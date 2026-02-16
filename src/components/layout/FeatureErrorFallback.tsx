import { Typography, Button, Box } from '@mui/material';
import React from 'react';

import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, SPACING } from '@/config/theme';

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
 * (games, research, etc.).  Renders a centered glass card with the
 * error message and a reset button.  Parameterised by title and
 * button label so a single component can serve every feature.
 */
export function FeatureErrorFallback({
    error,
    resetErrorBoundary,
    title = 'Error',
    resetLabel = 'Reset',
}: FeatureErrorFallbackProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
                minHeight: '100vh',
            }}
        >
            <GlassCard
                sx={{
                    p: 4,
                    maxWidth: '500px',
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: COLORS.text.primary,
                        fontWeight: 'bold',
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    sx={{
                        mb: 3,
                        color: COLORS.text.secondary,
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                    }}
                >
                    {error?.message ?? 'An unexpected error occurred.'}
                </Typography>
                <Button
                    variant="contained"
                    onClick={resetErrorBoundary}
                    sx={{
                        borderRadius: SPACING.borderRadius.md,
                        textTransform: 'none',
                    }}
                >
                    {resetLabel}
                </Button>
            </GlassCard>
        </Box>
    );
}
