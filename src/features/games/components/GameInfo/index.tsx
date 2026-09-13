import {
    IconButton,
    Typography,
    Button,
    Box,
    type SxProps,
    type Theme,
} from '@mui/material';
import React, { useState, useCallback } from 'react';

import {
    infoHeaderSx,
    infoCloseButtonSx,
    infoStepContentSx,
    infoContentSx,
    infoCardSx,
    infoFooterSx,
    instructionTitleSx,
    instructionIconSx,
    instructionTextSx,
    stepFadeInSx,
    stepCenteredContentSx,
    stepInstructionsListSx,
} from './styles';
import type { GameInfoContentProps, InstructionItemData } from './types';

import {
    CloseRounded,
    NavigateBeforeRounded,
    NavigateNextRounded,
} from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

/**
 * Renders a single instruction row: an icon, bold title, and description.
 */
function InstructionItem({ Icon, title, text }: InstructionItemData) {
    return (
        <Box
            sx={{
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                border: `1px solid ${COLORS.border.subtle}`,
                backgroundColor: COLORS.interactive.disabled,
                boxSizing: 'border-box',
                minHeight: 0,
            }}
        >
            <Typography variant="h6" sx={instructionTitleSx}>
                <Icon sx={instructionIconSx} />
                {title}
            </Typography>
            <Typography variant="body1" sx={instructionTextSx}>
                {text}
            </Typography>
        </Box>
    );
}

/**
 * Encapsulates the step-navigation state for a multi-step modal.
 */
function useSteppedModal(
    totalSteps: number,
    onClose: () => void,
    persistenceKey?: string,
) {
    const [step, setStep] = useState(() => {
        if (!persistenceKey) return 0;
        try {
            const saved = sessionStorage.getItem(persistenceKey);
            const parsed = saved ? Number.parseInt(saved, 10) : 0;
            return Number.isNaN(parsed) || parsed < 0 || parsed >= totalSteps
                ? 0
                : parsed;
        } catch {
            return 0;
        }
    });

    const handleNext = useCallback(() => {
        const next = step + 1;
        if (next < totalSteps) {
            if (persistenceKey) {
                sessionStorage.setItem(persistenceKey, String(next));
            }
            setStep(next);
        } else {
            onClose();
        }
    }, [step, totalSteps, onClose, persistenceKey]);

    const handleBack = useCallback(() => {
        const next = step - 1;
        if (next >= 0) {
            if (persistenceKey) {
                sessionStorage.setItem(persistenceKey, String(next));
            }
            setStep(next);
        }
    }, [step, persistenceKey]);

    return { step, handleNext, handleBack };
}

/** Diameter (px) of each step-indicator dot in the navigation footer. */
const STEP_DOT_SIZE = 8;

/**
 * Back / dot-indicator / Next footer used by `GameInfo`.
 */
function StepNavigation({
    step,
    totalSteps,
    onBack,
    onNext,
}: {
    step: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
}) {
    const isLastStep = step === totalSteps - 1;

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
                    width: { xs: 80, sm: 104 },
                    justifyContent: 'flex-start',
                }}
            >
                Back
            </Button>

            <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
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
                <Typography
                    component="span"
                    sx={{
                        color: COLORS.text.secondary,
                        fontSize: '0.75rem',
                        ml: 0.5,
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {step + 1} / {totalSteps}
                </Typography>
            </Box>

            <Button
                onClick={onNext}
                endIcon={isLastStep ? undefined : <NavigateNextRounded />}
                aria-label={isLastStep ? 'Close guide' : 'Next step'}
                sx={{
                    color: COLORS.text.primary,
                    width: { xs: 80, sm: 104 },
                    justifyContent: 'flex-end',
                }}
            >
                {isLastStep ? 'Done' : 'Next'}
            </Button>
        </Box>
    );
}

/**
 * Renders the title for the current step inside the modal header.
 */
const StepTitle = ({
    children,
    id,
}: {
    children: React.ReactNode;
    id?: string;
}) => (
    <Typography
        id={id}
        variant="h5"
        sx={{
            color: COLORS.text.primary,
            fontWeight: TYPOGRAPHY.fontWeight.bold,
            textAlign: 'left',
            fontSize: TYPOGRAPHY.fontSize.h2,
        }}
    >
        {children}
    </Typography>
);

/**
 * Inner content for the "How to Play" modal, rendering the GlassCard
 * with step navigation, header, and content.
 */
export function GameInfoContent({
    toggleOpen,
    titles,
    instructions,
    instructionsFooter,
    exampleContent,
    extraSteps = [],
    cardSx,
    contentSxOverride,
    scrollableSteps,
    persistenceKey,
    titleId,
}: GameInfoContentProps) {
    const totalSteps = titles.length;
    const { step, handleNext, handleBack } = useSteppedModal(
        totalSteps,
        toggleOpen,
        persistenceKey,
    );

    const steps = [
        <Box key="instructions" sx={stepFadeInSx}>
            <Box sx={stepInstructionsListSx}>
                {instructions.map(({ Icon, title, text }) => (
                    <InstructionItem
                        key={title}
                        Icon={Icon}
                        title={title}
                        text={text}
                    />
                ))}
            </Box>
            {instructionsFooter}
        </Box>,
        <Box key="example" sx={stepFadeInSx}>
            <Box sx={stepCenteredContentSx}>{exampleContent}</Box>
        </Box>,
        ...extraSteps,
    ];

    const contentSx = contentSxOverride
        ? contentSxOverride(step)
        : infoContentSx(step);

    const hasScrollPadding = scrollableSteps
        ? !!scrollableSteps[step]
        : step >= 2;

    return (
        <GlassCard
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
            }}
            sx={[infoCardSx, cardSx] as SxProps<Theme>}
        >
            <Box sx={contentSx}>
                <Box sx={infoHeaderSx}>
                    <StepTitle id={titleId}>{titles[step]}</StepTitle>
                    <IconButton
                        onClick={toggleOpen}
                        size="small"
                        aria-label="Close"
                        sx={infoCloseButtonSx}
                    >
                        <CloseRounded />
                    </IconButton>
                </Box>

                <Box sx={infoStepContentSx(hasScrollPadding)}>
                    {steps[step]}
                </Box>
            </Box>

            <StepNavigation
                step={step}
                totalSteps={totalSteps}
                onBack={handleBack}
                onNext={handleNext}
            />
        </GlassCard>
    );
}
