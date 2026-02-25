import type { SxProps, Theme } from '@mui/material';
import {
    Backdrop,
    Modal,
    Box,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import React, { useState, useCallback } from 'react';

import {
    CloseRounded,
    NavigateBeforeRounded,
    NavigateNextRounded,
} from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, TYPOGRAPHY } from '@/config/theme';

/** Backdrop blur + tinted overlay for the Info modal. */
// eslint-disable-next-line react-refresh/only-export-components
export const infoBackdropSx: SxProps<Theme> = {
    backgroundColor: (theme: Theme) =>
        theme.palette.mode === 'dark'
            ? 'hsla(0, 0%, 3%, 0.85)'
            : 'hsla(0, 0%, 98%, 0.85)',
    backdropFilter: 'blur(12px) saturate(180%)',
    transition: 'all 0.3s ease-in-out !important',
};

/** Root Modal positioning. */
// eslint-disable-next-line react-refresh/only-export-components
export const infoModalSx: SxProps<Theme> = {
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

/** Outer wrapper that centres the GlassCard within the modal. */
// eslint-disable-next-line react-refresh/only-export-components
export const infoOuterBoxSx: SxProps<Theme> = {
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
};

/** GlassCard container for the entire Info modal content. */
// eslint-disable-next-line react-refresh/only-export-components
export const infoCardSx: SxProps<Theme> = {
    width: '100%',
    maxWidth: '1000px',
    height: { xs: '630px', sm: '495px' },
    minHeight: { xs: '630px', sm: '495px' },
    display: 'flex',
    flexDirection: 'column',
    p: 0,
    overflow: 'hidden',
    position: 'relative',
    m: 2,
};

/** Header row (title + close button). */
const infoHeaderSx: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
    pl: 3,
    pr: 1,
};

/** Close button colour. */
const infoCloseButtonSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
};

/** Step-content wrapper. Accepts an optional step index so the scrollbar-
 *  compensating right padding only applies to steps that actually scroll. */
const infoStepContentSx = (step?: number): SxProps<Theme> => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // Apply right spacing to scrolling steps (2+) on mobile to
    // prevent text from running too close to the edge/scrollbar.
    // Shifted from 'pr' to 'mr' to move the scrollbar itself further left.
    mr: (step ?? 0) < 2 ? 0 : 2,
    pr: (step ?? 0) < 2 ? 0 : { xs: 1, md: 0 },
    overflowY: (step ?? 0) < 2 ? 'hidden' : 'auto',
    minHeight: 0,
});

/** Scrollable content area wrapping steps. */
// eslint-disable-next-line react-refresh/only-export-components
export const infoContentSx = (_step: number): SxProps<Theme> => ({
    flex: 1,
    overflow: 'hidden',
    p: { xs: 2.5, md: 3 },
    display: 'flex',
    flexDirection: 'column',
});

/** Diameter (px) of each step-indicator dot in the navigation footer. */
const STEP_DOT_SIZE = 8;

/** Footer row containing back/next buttons and the dot indicator. */
const infoFooterSx: SxProps<Theme> = {
    px: 3,
    pb: 2,
    pt: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

// ---------------------------------------------------------------------------
// InstructionItem styles
// ---------------------------------------------------------------------------

/** Title row with icon and text. */
const instructionTitleSx: SxProps<Theme> = {
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    display: 'flex',
    alignItems: 'center',
    mb: 1.5,
    fontSize: TYPOGRAPHY.fontSize.subheading,
};

/** Icon preceding the instruction title. */
const instructionIconSx: SxProps<Theme> = {
    ml: 1,
    mr: 2,
    color: COLORS.primary.main,
    fontSize: '1.75rem',
};

/** Body text for an instruction. */
const instructionTextSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    lineHeight: 1.6,
    fontSize: TYPOGRAPHY.fontSize.body,
    ml: 6.5,
};

// ---------------------------------------------------------------------------
// StepContent styles
// ---------------------------------------------------------------------------

/** Outer wrapper for a step with fade-in animation. */
const stepFadeInSx: SxProps<Theme> = {
    animation: 'fadeIn 0.3s ease',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'clip',
};

/** Centered content area within a step. */
const stepCenteredContentSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

/** Instructions list with spacing. */
const stepInstructionsListSx: SxProps<Theme> = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
};

// ---------------------------------------------------------------------------
// Internal Components & Hooks
// ---------------------------------------------------------------------------

/** Data for a single instruction row shown on the first step. */
export interface InstructionItemData {
    Icon: React.ElementType;
    title: string;
    text: React.ReactNode;
}

/**
 * Renders a single instruction row: an icon, bold title, and description.
 */
function InstructionItem({ Icon, title, text }: InstructionItemData) {
    return (
        <Box sx={{ px: 2 }}>
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
            const parsed = saved ? parseInt(saved, 10) : 0;
            return isNaN(parsed) || parsed < 0 || parsed >= totalSteps
                ? 0
                : parsed;
        } catch {
            return 0;
        }
    });

    const handleNext = useCallback(() => {
        setStep(prev => {
            const next = prev + 1;
            if (next < totalSteps) {
                if (persistenceKey) {
                    sessionStorage.setItem(persistenceKey, String(next));
                }
                return next;
            }
            onClose();
            return prev;
        });
    }, [totalSteps, onClose, persistenceKey]);

    const handleBack = useCallback(() => {
        setStep(prev => {
            if (prev > 0) {
                const next = prev - 1;
                if (persistenceKey) {
                    sessionStorage.setItem(persistenceKey, String(next));
                }
                return next;
            }
            return prev;
        });
    }, [persistenceKey]);

    return { step, handleNext, handleBack };
}

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

                <Box sx={infoStepContentSx(step)}>{steps[step]}</Box>
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

/**
 * Unified "How to Play" modal for all games.
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
