import type { SxProps, Theme } from '@mui/material';
import { Backdrop, Modal, Box, IconButton } from '@mui/material';
import React, { useState } from 'react';

import { InfoExample } from './InfoExample';
import { InfoInstructions } from './InfoInstructions';
import { StepTitle } from '../../components/InfoContent';
import { InfoNavigation } from '../../components/InfoNavigation';
import {
    infoBackdropSx,
    infoCardSx,
    infoCloseButtonSx,
    infoContentSx,
    infoHeaderSx,
    infoModalSx,
    infoOuterBoxSx,
    infoStepContentSx,
} from '../../components/infoStyles';

import { CloseRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { toSxArray } from '@/utils/muiUtils';

// Type assertion for GlassCard component
const TypedGlassCard = GlassCard as React.ComponentType<{
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
    onClick?: (event: React.MouseEvent) => void;
}>;

const INFO_TITLES = ['Slant Rules', 'Example'];

interface InfoProps {
    /** Whether the modal is open. */
    open: boolean;
    /** Cell size in rem units (used to scale the example board). */
    size: number;
    /** Toggle the modal open/closed. */
    toggleOpen: () => void;
    /** Closes the modal and activates ghost-mode calculator. */
    onOpenCalculator: () => void;
}

/**
 * Two-step "How to Play" modal for the Slant puzzle.
 * Step 0: rule explanations, Step 1: animated solve example.
 */
export default function Info({
    open,
    size,
    toggleOpen,
    onOpenCalculator,
}: InfoProps): React.ReactElement {
    // 0: Instructions, 1: Example
    const [step, setStep] = useState(0);
    const TOTAL_STEPS = 2;

    const handleNext = () => {
        if (step < TOTAL_STEPS - 1) setStep(step + 1);
        else toggleOpen();
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleClose = () => {
        toggleOpen();
    };

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
                    sx={{
                        ...infoCardSx,
                        height: { xs: '660px', sm: '525px' },
                        minHeight: { xs: '660px', sm: '525px' },
                    }}
                >
                    {/* Content Area */}
                    <Box
                        sx={
                            [
                                ...toSxArray(infoContentSx(step)),
                                { overflowY: 'hidden' },
                            ] as SxProps<Theme>
                        }
                    >
                        {/* Header (Title + Close Button) */}
                        <Box sx={infoHeaderSx}>
                            <StepTitle>{INFO_TITLES[step]}</StepTitle>
                            <IconButton
                                onClick={handleClose}
                                size="small"
                                sx={infoCloseButtonSx}
                            >
                                <CloseRounded />
                            </IconButton>
                        </Box>

                        {/* Step Content */}
                        <Box sx={infoStepContentSx}>
                            {step === 0 && (
                                <InfoInstructions
                                    onOpenCalculator={onOpenCalculator}
                                />
                            )}
                            {step === 1 && <InfoExample size={size} />}
                        </Box>
                    </Box>

                    {/* Footer (Navigation) */}
                    <InfoNavigation
                        step={step}
                        totalSteps={TOTAL_STEPS}
                        onBack={handleBack}
                        onNext={handleNext}
                    />
                </TypedGlassCard>
            </Box>
        </Modal>
    );
}
