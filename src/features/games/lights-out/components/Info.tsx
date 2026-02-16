import React from 'react';

import { Example } from './Example';
import { InfoCalculator } from './InfoCalculator';
import { INFO_TITLES, INSTRUCTIONS, EXAMPLE_SIZE } from '../config';
import { useCalculator } from '../hooks/useCalculator';
import type { Palette, PropsFactory } from '../types';

import { LazyGameInfo } from '@/features/games/components/GameInfo/LazyGameInfo';
import type { BaseInfoProps } from '@/features/games/types';
import { useMobile } from '@/hooks';

/** Board dimensions and visual cell size. */
interface InfoBoardProps {
    rows: number;
    cols: number;
    size: number;
}

/** Rendering factories for the example animation. */
interface InfoRenderingProps {
    palette: Palette;
    getFrontProps: PropsFactory;
    getBackProps: PropsFactory;
}

export interface InfoProps extends BaseInfoProps {
    /** Board dimensions and visual cell size. */
    board: InfoBoardProps;
    /** Rendering factories for the example animation. */
    rendering: InfoRenderingProps;
    /** Applies the calculator solution to the game board. */
    onApply: (solution: number[]) => void;
}

/**
 * Three-step "How to Play" modal for Lights Out.
 * Step 0: rule explanations, Step 1: example, Step 2: calculator.
 * Calculator state is managed by `useCalculator` so it persists
 * when switching steps.
 */
export function Info({
    open,
    toggleOpen,
    board,
    rendering,
    onApply,
}: InfoProps): React.ReactElement | null {
    const { rows, cols, size } = board;
    const { palette, getFrontProps, getBackProps } = rendering;

    const isMobile = useMobile('md');
    const isMobileSm = useMobile('sm');

    const { inputProps, outputProps, handleReset, res, hasPattern } =
        useCalculator({ rows, cols, palette });

    const exampleSize = isMobileSm ? EXAMPLE_SIZE.MOBILE : EXAMPLE_SIZE.DESKTOP;

    return (
        <LazyGameInfo
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
                    hasPattern={hasPattern}
                />,
            ]}
        />
    );
}
