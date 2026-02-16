import type { SxProps, Theme } from '@mui/material';
import { Backdrop, Modal, Box, IconButton, Typography } from '@mui/material';
import React from 'react';

import {
    infoBackdropSx,
    infoModalSx,
    infoOuterBoxSx,
    infoCardSx,
    infoHeaderSx,
    infoCloseButtonSx,
    infoStepContentSx,
    infoContentSx,
} from './GameInfo.styles';
import type { InstructionItemData } from './InstructionItem';
import { InstructionItem } from './InstructionItem';
import { StepNavigation } from './StepNavigation';
import { useSteppedModal } from './useSteppedModal';

import { CloseRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';
import { spreadSx } from '@/utils/muiUtils';

// Re-export so consumers can import from the barrel.
export type { InstructionItemData } from './InstructionItem';

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

export interface GameInfoProps {
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
 * Unified "How to Play" modal for all games. Delegates step-navigation
 * state to `useSteppedModal` and renders the common chrome (backdrop,
 * card, header, close button, navigation footer). Accepts instructions
 * as declarative data and the example animation as a ReactNode so
 * individual games don't need separate InfoInstructions / InfoExample
 * components.
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
    const totalSteps = titles.length;
    const { step, handleNext, handleBack } = useSteppedModal(
        totalSteps,
        toggleOpen,
    );

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
            onClose={toggleOpen}
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
                        ...spreadSx(infoCardSx),
                        ...spreadSx(cardSx),
                    }}
                >
                    {/* Content Area */}
                    <Box sx={contentSx}>
                        {/* Header (Title + Close Button) */}
                        <Box sx={infoHeaderSx}>
                            <StepTitle>{titles[step]}</StepTitle>
                            <IconButton
                                onClick={toggleOpen}
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
                    <StepNavigation
                        step={step}
                        totalSteps={totalSteps}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                </GlassCard>
            </Box>
        </Modal>
    );
}
