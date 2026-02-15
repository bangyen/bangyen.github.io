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
    infoModalSx,
    infoOuterBoxSx,
    infoCardSx,
    infoHeaderSx,
    infoCloseButtonSx,
    infoStepContentSx,
    infoContentSx,
} from './infoStyles';

import {
    CloseRounded,
    NavigateBeforeRounded,
    NavigateNextRounded,
} from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GameInfo component
// ---------------------------------------------------------------------------

/** Data for a single instruction row shown on the first step. */
export interface InstructionItemData {
    Icon: React.ElementType;
    title: string;
    text: string;
}

interface GameInfoProps {
    /** Whether the modal is open. */
    open: boolean;
    /** Toggle the modal open/closed. */
    toggleOpen: () => void;
    /** Ordered step titles — length must equal 2 + extraSteps.length. */
    titles: string[];
    /** Instruction rows rendered on step 0. */
    instructions: InstructionItemData[];
    /** Optional footer below the centered instructions (e.g. a button). */
    instructionsFooter?: React.ReactNode;
    /** Content rendered on step 1 (the animated example). */
    exampleContent: React.ReactNode;
    /** Additional steps rendered after the example (e.g. a calculator). */
    extraSteps?: React.ReactNode[];
    /** Optional sx overrides merged onto the GlassCard container. */
    cardSx?: SxProps<Theme>;
    /** Optional per-step override for the scrollable content area sx. */
    contentSxOverride?: (step: number) => SxProps<Theme>;
}

/**
 * Renders a single instruction row: an icon, bold title, and description.
 * Used internally to build the instructions step from declarative data.
 */
function InstructionItem({
    Icon,
    title,
    text,
}: {
    Icon: React.ElementType;
    title: string;
    text: string;
}) {
    return (
        <Box sx={{ px: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    color: COLORS.text.primary,
                    fontWeight: TYPOGRAPHY.fontWeight.semibold,
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1.5,
                    fontSize: TYPOGRAPHY.fontSize.subheading,
                }}
            >
                <Icon
                    sx={{
                        mr: 2,
                        color: COLORS.primary.main,
                        fontSize: '1.75rem',
                    }}
                />
                {title}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: COLORS.text.secondary,
                    lineHeight: 1.6,
                    fontSize: TYPOGRAPHY.fontSize.body,
                    ml: 6,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
}

/**
 * Unified "How to Play" modal for all games. Owns the step navigation
 * state and renders the common chrome (backdrop, card, header, close
 * button, navigation footer). Accepts instructions as declarative data
 * and the example animation as a ReactNode so individual games don't
 * need separate InfoInstructions / InfoExample components.
 *
 * Step layout:
 *   0 — Instructions (rendered from `instructions` data)
 *   1 — Example      (renders `exampleContent`)
 *   2…— Extra steps  (renders each element from `extraSteps`)
 */
export function GameInfo({
    open,
    toggleOpen,
    titles,
    instructions,
    instructionsFooter,
    exampleContent,
    extraSteps = [],
    cardSx,
    contentSxOverride,
}: GameInfoProps) {
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

    // Build step content
    const instructionsStep = (
        <Box
            sx={{
                animation: 'fadeIn 0.3s ease',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 4,
                }}
            >
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
        </Box>
    );

    const exampleStep = (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                animation: 'fadeIn 0.3s ease',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                {exampleContent}
            </Box>
        </Box>
    );

    const steps = [instructionsStep, exampleStep, ...extraSteps];
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
                <GlassCard
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                    }}
                    sx={{
                        ...(infoCardSx as Record<string, unknown>),
                        ...(cardSx as Record<string, unknown>),
                    }}
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
                </GlassCard>
            </Box>
        </Modal>
    );
}
