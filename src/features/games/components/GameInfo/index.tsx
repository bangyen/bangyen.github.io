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
import { InstructionsStep, ExampleStep } from './StepContent';
import { StepNavigation } from './StepNavigation';
import { useSteppedModal } from './useSteppedModal';

import { CloseRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

// Re-export so consumers can import from the barrel.
export type { InstructionItemData } from './InstructionItem';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Renders the title for the current step inside the modal header.
 *
 * Extracted as a small component so the GameInfo layout stays
 * declarative and the title typography can be updated in one place
 * without touching the modal structure.
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
    /** Optional key to persist the current step in localStorage. */
    persistenceKey?: string;
}

/** Props for the inner content rendered inside an already-open Modal. */
export interface GameInfoContentProps extends Omit<GameInfoProps, 'open'> {
    /** DOM id applied to the step title for `aria-labelledby` on the modal. */
    titleId: string;
}

// ---------------------------------------------------------------------------
// GameInfoContent — inner card rendered inside a Modal shell
// ---------------------------------------------------------------------------

/**
 * Inner content for the "How to Play" modal, rendering the GlassCard
 * with step navigation, header, and content.
 *
 * Separated from the Modal wrapper so `LazyGameInfo` can render the
 * Modal eagerly (single backdrop transition) while lazy-loading only
 * this content via Suspense.
 *
 * Step layout:
 *   0 — Instructions (rendered from `instructions` data)
 *   1 — Example      (renders `exampleContent`)
 *   2…— Extra steps  (renders each element from `extraSteps`)
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
        <InstructionsStep
            key="instructions"
            instructions={instructions}
            footer={instructionsFooter}
        />,
        <ExampleStep key="example">{exampleContent}</ExampleStep>,
        ...extraSteps,
    ];
    const contentSx = contentSxOverride
        ? contentSxOverride(step)
        : infoContentSx(step);

    return (
        <GlassCard
            onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
            }}
            sx={[infoCardSx, cardSx] as SxProps<Theme>}
        >
            {/* Content Area */}
            <Box sx={contentSx}>
                {/* Header (Title + Close Button) */}
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
    );
}

// ---------------------------------------------------------------------------
// GameInfo — full modal (kept for backward compatibility / direct use)
// ---------------------------------------------------------------------------

/**
 * Unified "How to Play" modal for all games.  Wraps `GameInfoContent`
 * in a MUI Modal with the standard backdrop.
 *
 * Prefer using `LazyGameInfo` from the barrel — it renders the Modal
 * eagerly and lazy-loads only the content, avoiding layout shift and
 * backdrop flicker.
 */
export function GameInfo({ open, toggleOpen, ...contentProps }: GameInfoProps) {
    const titleId = 'game-info-title';

    return (
        <Modal
            open={open}
            onClose={toggleOpen}
            aria-labelledby={titleId}
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    sx: infoBackdropSx,
                },
            }}
            sx={infoModalSx}
        >
            <Box sx={infoOuterBoxSx} role="document">
                <GameInfoContent
                    {...contentProps}
                    toggleOpen={toggleOpen}
                    titleId={titleId}
                />
            </Box>
        </Modal>
    );
}
