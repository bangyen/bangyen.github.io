import { Backdrop, Modal, Box, IconButton } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';

import { getProduct } from '../utils';
import { getInput, getOutput, useHandler } from './Calculator';
import { StepTitle, INFO_TITLES } from './Content';
import { InfoCalculator } from './InfoCalculator';
import { InfoExample } from './InfoExample';
import { InfoInstructions } from './InfoInstructions';
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
} from './styles';
import type { Palette, PropsFactory } from '../../components/Board';
import { useDrag } from '../../hooks/useDrag';

import { CloseRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { useMobile } from '@/hooks';

// Type assertion for GlassCard component
const TypedGlassCard = GlassCard as React.ComponentType<{
    children?: React.ReactNode;
    sx?: Record<string, unknown>;
    onClick?: (event: React.MouseEvent) => void;
}>;

interface InfoProps {
    rows: number;
    cols: number;
    size: number;
    open: boolean;
    palette: Palette;
    toggleOpen: () => void;
    onApply: (solution: number[]) => void;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

export default function Info(props: InfoProps): React.ReactElement {
    const {
        rows,
        cols,
        size,
        open,
        palette,
        toggleOpen,
        onApply,
        getFrontProps,
        getBackProps,
    } = props;
    const isMobile = useMobile('md');

    // 0: Instructions, 1: Example, 2: Calculator
    const [step, setStep] = useState(0);
    const TOTAL_STEPS = 3;

    // Calculator State (hoisted to persist across steps)
    const [calcRow, setCalcRow] = useState<number[]>(new Array(cols).fill(0));

    useEffect(() => {
        setCalcRow(new Array(cols).fill(0));
    }, [cols, palette]); // Reset only on config change

    const toggleTile = useCallback(
        (colAttr: string) => {
            const col = Number.parseInt(colAttr, 10);
            setCalcRow(prev => {
                const next = [...prev];
                if (next[col] !== undefined) {
                    next[col] ^= 1;
                }
                return next;
            });
        },
        [setCalcRow],
    );

    const res = getProduct(calcRow, rows, cols);

    const { getDragProps } = useDrag({
        onAction: toggleTile,
        checkEnabled: () => step === 2,
        posAttribute: 'data-col',
    });

    const inputGetters = useHandler(calcRow, cols, palette);
    const outputGetters = useHandler(res, cols, palette);
    const inputProps = getInput(inputGetters, getDragProps);
    const outputProps = getOutput(outputGetters);

    // Reset functionality
    const handleReset = () => {
        setCalcRow(new Array(cols).fill(0));
    };

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
                    sx={infoCardSx}
                >
                    {/* Content Area */}
                    <Box sx={infoContentSx(step)}>
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
                            {step === 0 && <InfoInstructions />}
                            {step === 1 && (
                                <InfoExample
                                    size={size}
                                    palette={palette}
                                    getFrontProps={getFrontProps}
                                    getBackProps={getBackProps}
                                />
                            )}
                            {step === 2 && (
                                <InfoCalculator
                                    cols={cols}
                                    size={size}
                                    isMobile={isMobile}
                                    inputProps={inputProps}
                                    outputProps={outputProps}
                                    onReset={handleReset}
                                    onApply={() => {
                                        onApply(res);
                                    }}
                                    hasPattern={res.some(v => v !== 0)}
                                />
                            )}
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
