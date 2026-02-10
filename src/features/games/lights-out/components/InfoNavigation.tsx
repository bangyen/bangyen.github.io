import React from 'react';

import { NavigateBeforeRounded, NavigateNextRounded } from '@/components/icons';
import { Box, Button } from '@/components/mui';
import { COLORS } from '@/config/theme';

interface InfoNavigationProps {
    step: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
}

export function InfoNavigation({
    step,
    totalSteps,
    onBack,
    onNext,
}: InfoNavigationProps) {
    return (
        <Box
            sx={{
                p: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Button
                onClick={onBack}
                disabled={step === 0}
                startIcon={<NavigateBeforeRounded />}
                sx={{
                    visibility: step === 0 ? 'hidden' : 'visible',
                    color: COLORS.text.primary,
                }}
            >
                Back
            </Button>

            {/* Dots Indicator */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                {Array.from({ length: totalSteps }, (_, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor:
                                step === i
                                    ? COLORS.primary.main
                                    : COLORS.interactive.disabled,
                            transition: 'background-color 0.3s',
                        }}
                    />
                ))}
            </Box>

            <Button
                onClick={onNext}
                disabled={step === totalSteps - 1}
                endIcon={<NavigateNextRounded />}
                sx={{
                    visibility: step === totalSteps - 1 ? 'hidden' : 'visible',
                    color: COLORS.text.primary,
                }}
            >
                Next
            </Button>
        </Box>
    );
}
