import React, { useState, useEffect, useCallback } from 'react';

import { INFO_TITLES, INSTRUCTIONS, EXAMPLE_SIZE } from '../config';
import { getProduct } from '../utils';
import { getInput, getOutput, useHandler } from './Calculator';
import { Example } from './Example';
import { InfoCalculator } from './InfoCalculator';
import { useDrag } from '../../hooks/useDrag';
import type { Palette, PropsFactory } from '../types';

import { ErrorState } from '@/components/ui/ErrorState';
import { LazySuspense } from '@/components/ui/LazySuspense';
import { GAME_TEXT } from '@/features/games/config/constants';
import { useMobile } from '@/hooks';
import { lazyNamed } from '@/utils/lazyNamed';

const GameInfo = lazyNamed(
    () => import('../../components/GameInfo'),
    'GameInfo',
);

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
export function Info(props: InfoProps): React.ReactElement | null {
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
    const isMobileSm = useMobile('sm');

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

    // The example is always 3×3; use smaller cells on mobile.
    const exampleSize = isMobileSm ? EXAMPLE_SIZE.MOBILE : EXAMPLE_SIZE.DESKTOP;

    if (!open) return null;

    return (
        <LazySuspense
            message={GAME_TEXT.info.loading}
            errorFallback={<ErrorState message={GAME_TEXT.info.loadError} />}
        >
            <GameInfo
                open={open}
                toggleOpen={toggleOpen}
                titles={INFO_TITLES}
                instructions={INSTRUCTIONS}
                exampleContent={
                    <Example
                        dims={3}
                        size={exampleSize}
                        start={[1, 3, 8]}
                        palette={palette}
                        getFrontProps={getFrontProps}
                        getBackProps={getBackProps}
                    />
                }
                extraSteps={[
                    <InfoCalculator
                        key="calculator"
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
                    />,
                ]}
            />
        </LazySuspense>
    );
}
