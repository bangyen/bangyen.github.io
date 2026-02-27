import React from 'react';

import { Example } from './Example';
import { InfoCalculator } from './InfoCalculator';
import { INFO_TITLES, INSTRUCTIONS, EXAMPLE_SIZE } from '../config';
import { useCalculator } from '../hooks/useCalculator';
import type { Palette } from '../types';

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
}

export interface LightsOutInfoProps extends BaseInfoProps {
    /** Board dimensions and visual cell size. */
    board: InfoBoardProps;
    /** Rendering factories for the example animation. */
    rendering: InfoRenderingProps;
    /** Whether the board is currently solved. */
    solved: boolean;
    /** Applies the calculator solution to the game board. */
    onApply: (solution: number[]) => void;
    /** The board's current bottom row configuration. */
    bottomRow: number[];
}

/**
 * Three-step "How to Play" modal for Lights Out.
 * Step 0: rule explanations, Step 1: example, Step 2: calculator.
 * Calculator state is managed by `useCalculator` so it persists
 * when switching steps.
 */
export function LightsOutInfo({
    open,
    solved,
    toggleOpen,
    board,
    rendering,
    onApply,
    bottomRow,
}: LightsOutInfoProps): React.ReactElement | null {
    const { rows, cols, size } = board;
    const { palette } = rendering;

    const isMobile = useMobile('md');
    const isMobileSm = useMobile('sm');

    const { inputProps, handleSetRow, res, inputGrid, outputGrid, hasPattern } =
        useCalculator({ rows, cols, palette, solved });

    const exampleSize = isMobileSm ? EXAMPLE_SIZE.MOBILE : EXAMPLE_SIZE.DESKTOP;

    return (
        <LazyGameInfo
            open={open}
            toggleOpen={toggleOpen}
            titles={INFO_TITLES}
            instructions={INSTRUCTIONS}
            exampleContent={<Example size={exampleSize} palette={palette} />}
            extraSteps={[
                <InfoCalculator
                    key="calculator"
                    cols={cols}
                    size={size}
                    isMobile={isMobile}
                    isMobileSm={isMobileSm}
                    palette={palette}
                    inputGrid={inputGrid}
                    outputGrid={outputGrid}
                    inputProps={inputProps}
                    onApply={() => {
                        onApply(res);
                    }}
                    onFillFromBoard={() => {
                        handleSetRow(bottomRow);
                    }}
                    hasPattern={hasPattern}
                />,
            ]}
            scrollableSteps={[false, false, false]}
            persistenceKey="lights_out_info_step"
        />
    );
}
