import { Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import { Refresh, HomeRounded } from '@/components/icons';
import { ErrorCard } from '@/components/ui/ErrorCard';
import {
    errorContainerSx,
    errorButtonSx,
} from '@/components/ui/ErrorCard.styles';

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
 * error message, a reset button, and a link back to the home page.
 * Parameterised by title and button label so a single component can
 * serve every feature.
 */
export function FeatureErrorFallback({
    error,
    resetErrorBoundary,
    title = 'Error',
    resetLabel = 'Reset',
}: FeatureErrorFallbackProps) {
    return (
        <Box sx={errorContainerSx}>
            <ErrorCard
                title={title}
                message={error?.message ?? 'An unexpected error occurred.'}
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
