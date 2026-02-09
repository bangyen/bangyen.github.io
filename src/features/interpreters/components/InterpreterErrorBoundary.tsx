import React from 'react';
import { Typography, Button, Box } from '../../../components/mui';
import { GlassCard } from '../../../components/ui/GlassCard';
import { ErrorBoundary } from '../../../components/layout/ErrorBoundary';
import { COLORS, SPACING } from '../../../config/theme';

export const InterpreterErrorBoundary: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return (
        <ErrorBoundary
            FallbackComponent={({ error, resetErrorBoundary }) => (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 4,
                        minHeight: '300px',
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
                            Interpreter Error
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
                            Reset Interpreter
                        </Button>
                    </GlassCard>
                </Box>
            )}
        >
            {children}
        </ErrorBoundary>
    );
};
