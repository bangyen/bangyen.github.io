import type { SxProps, Theme } from '@mui/material';
import {
    Backdrop,
    Modal,
    Box,
    Button,
    IconButton,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

import {
    infoBackdropSx,
    infoCardSx,
    infoCloseButtonSx,
    infoContentSx,
    infoHeaderSx,
    infoModalSx,
    infoOuterBoxSx,
    infoStepContentSx,
} from './infoStyles';

import {
    CloseRounded,
    NavigateBeforeRounded,
    NavigateNextRounded,
} from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Renders the title for the current step inside the modal header. */
const StepTitle = ({ children }: { children: React.ReactNode }) => (
    <Typography
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

// Type assertion for GlassCard component
const TypedGlassCard = GlassCard as React.ComponentType<{
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
    onClick?: (event: React.MouseEvent) => void;
}>;

interface InfoModalProps {
    /** Whether the modal is open. */
    open: boolean;
    /** Toggle the modal open/closed. */
    toggleOpen: () => void;
    /** Ordered step titles — the array length determines the total number of steps. */
    titles: string[];
    /** Optional sx overrides merged onto the GlassCard container. */
    cardSx?: Record<string, unknown>;
    /**
     * Optional per-step override for the scrollable content area sx.
     * When provided it replaces the default `infoContentSx` for that step.
     */
    contentSxOverride?: (step: number) => SxProps<Theme>;
    /** Declarative step content — each element is rendered when its index matches the current step. */
    steps: React.ReactNode[];
}

/**
 * Shared modal shell for all game "How to Play" tutorials.
 * Owns the step navigation state and renders the common chrome
 * (backdrop, card, header, close button, navigation footer) so
 * individual games only need to supply titles and step content.
 */
export function InfoModal({
    open,
    toggleOpen,
    titles,
    cardSx,
    contentSxOverride,
    steps,
}: InfoModalProps): React.ReactElement {
    const [step, setStep] = useState(0);
    const totalSteps = titles.length;

    const handleNext = () => {
        if (step < totalSteps - 1) setStep(step + 1);
        else toggleOpen();
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleClose = () => {
        toggleOpen();
    };

    const contentSx = contentSxOverride
        ? contentSxOverride(step)
        : infoContentSx(step);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    sx: infoBackdropSx,
                },
            }}
            sx={infoModalSx}
        >
            <Box sx={infoOuterBoxSx}>
                <TypedGlassCard
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                    }}
                    sx={{ ...infoCardSx, ...cardSx }}
                >
                    {/* Content Area */}
                    <Box sx={contentSx}>
                        {/* Header (Title + Close Button) */}
                        <Box sx={infoHeaderSx}>
                            <StepTitle>{titles[step]}</StepTitle>
                            <IconButton
                                onClick={handleClose}
                                size="small"
                                sx={infoCloseButtonSx}
                            >
                                <CloseRounded />
                            </IconButton>
                        </Box>

                        {/* Step Content */}
                        <Box sx={infoStepContentSx(step)}>{steps[step]}</Box>
                    </Box>

                    {/* Footer (Navigation) */}
                    <Box
                        sx={{
                            p: 2.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            onClick={handleBack}
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
                            onClick={handleNext}
                            disabled={step === totalSteps - 1}
                            endIcon={<NavigateNextRounded />}
                            sx={{
                                visibility:
                                    step === totalSteps - 1
                                        ? 'hidden'
                                        : 'visible',
                                color: COLORS.text.primary,
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </TypedGlassCard>
            </Box>
        </Modal>
    );
}
