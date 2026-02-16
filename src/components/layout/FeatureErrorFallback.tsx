import { Typography, Button, Box } from '@mui/material';

import {
    errorContainerSx,
    errorCardSx,
    errorTitleSx,
    errorMessageSx,
    errorButtonSx,
} from './FeatureErrorFallback.styles';

import { GlassCard } from '@/components/ui/GlassCard';

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
        <Box sx={errorContainerSx}>
            <GlassCard sx={errorCardSx}>
                <Typography variant="h5" sx={errorTitleSx}>
                    {title}
                </Typography>
                <Typography sx={errorMessageSx}>
                    {error?.message ?? 'An unexpected error occurred.'}
                </Typography>
                <Button
                    variant="contained"
                    onClick={resetErrorBoundary}
                    sx={errorButtonSx}
                >
                    {resetLabel}
                </Button>
            </GlassCard>
        </Box>
    );
}
