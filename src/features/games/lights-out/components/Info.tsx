import React, { useState, useEffect, useCallback } from 'react';

import { getProduct } from '../utils';
import { getInput, getOutput, useHandler } from './Calculator';
import { INFO_TITLES } from './Content';
import { InfoCalculator } from './InfoCalculator';
import { InfoExample } from './InfoExample';
import { InfoInstructions } from './InfoInstructions';
import type { Palette, PropsFactory } from '../../components/Board';
import { InfoModal } from '../../components/InfoModal';
import { useDrag } from '../../hooks/useDrag';

import { useMobile } from '@/hooks';

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

/**
 * Three-step "How to Play" modal for Lights Out.
 * Step 0: rule explanations, Step 1: example, Step 2: calculator.
 * Calculator state is hoisted here so it persists when switching steps.
 */
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
        checkEnabled: () => true,
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

    return (
        <InfoModal open={open} toggleOpen={toggleOpen} titles={INFO_TITLES}>
            {(step: number) => (
                <>
                    {step === 0 && <InfoInstructions />}
                    {step === 1 && (
                        <InfoExample
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
                </>
            )}
        </InfoModal>
    );
}
