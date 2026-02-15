import type { SxProps, Theme } from '@mui/material';
import { Backdrop, Modal, Box, IconButton } from '@mui/material';
import React, { useState } from 'react';

import { StepTitle } from './InfoContent';
import { InfoNavigation } from './InfoNavigation';
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

import { CloseRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';

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
    /**
     * Declarative step content — each element is rendered when its index
     * matches the current step.  Preferred over the `children` render-prop
     * when steps don't need dynamic access to the step index.
     */
    steps?: React.ReactNode[];
    /**
     * Render-prop that receives the current step index and returns the
     * game-specific content for that step.  Ignored when `steps` is provided.
     */
    children?: (step: number) => React.ReactNode;
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
    children,
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
                        <Box sx={infoStepContentSx(step)}>
                            {steps ? steps[step] : children?.(step)}
                        </Box>
                    </Box>

                    {/* Footer (Navigation) */}
                    <InfoNavigation
                        step={step}
                        totalSteps={totalSteps}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                </TypedGlassCard>
            </Box>
        </Modal>
    );
}
