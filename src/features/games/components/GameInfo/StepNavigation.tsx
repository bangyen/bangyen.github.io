import { Box, Button } from '@mui/material';

import { infoFooterSx, STEP_DOT_SIZE } from './GameInfo.styles';

import { NavigateBeforeRounded, NavigateNextRounded } from '@/components/icons';
import { COLORS } from '@/config/theme';

interface StepNavigationProps {
    step: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
}

/**
 * Back / dot-indicator / Next footer used by `GameInfo`.
 * Extracted so the main component focuses on content orchestration.
 */
export function StepNavigation({
    step,
    totalSteps,
    onBack,
    onNext,
}: StepNavigationProps) {
    return (
        <Box sx={infoFooterSx} role="navigation" aria-label="Step navigation">
            <Button
                onClick={onBack}
                disabled={step === 0}
                startIcon={<NavigateBeforeRounded />}
                aria-label="Previous step"
                sx={{
                    visibility: step === 0 ? 'hidden' : 'visible',
                    color: COLORS.text.primary,
                }}
            >
                Back
            </Button>

            {/* Dots Indicator */}
            <Box
                sx={{ display: 'flex', gap: 1 }}
                role="group"
                aria-label={`Step ${String(step + 1)} of ${String(totalSteps)}`}
            >
                {Array.from({ length: totalSteps }, (_, i) => (
                    <Box
                        key={i}
                        aria-hidden="true"
                        sx={{
                            width: STEP_DOT_SIZE,
                            height: STEP_DOT_SIZE,
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
                aria-label="Next step"
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
