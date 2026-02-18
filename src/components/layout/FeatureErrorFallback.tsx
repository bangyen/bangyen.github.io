import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { Refresh, HomeRounded } from '@/components/icons';
import { ErrorCard } from '@/components/ui/ErrorCard';
import {
    errorContainerSx,
    errorButtonSx,
} from '@/components/ui/ErrorCard.styles';
import { COLORS, TYPOGRAPHY, SPACING } from '@/config/theme';

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
    title = 'Error',
    resetLabel = 'Reset',
}: FeatureErrorFallbackProps) {
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
                    maxHeight: '200px',
                    width: '100%',
                }}
            >
                <Typography
                    sx={{
                        color: COLORS.text.secondary,
                        fontSize: TYPOGRAPHY.fontSize.caption,
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'anywhere',
                    }}
                >
                    {error.toString()}
                </Typography>
            </Box>
        );

    return (
        <Box sx={errorContainerSx}>
            <ErrorCard
                title={title}
                message="An unexpected error occurred."
                detail={devDetail || undefined}
            >
                <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={resetErrorBoundary}
                    sx={errorButtonSx}
                >
                    {resetLabel}
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
