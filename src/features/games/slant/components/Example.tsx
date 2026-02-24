import { Box } from '@mui/material';
import React, { useMemo } from 'react';

import { SlantCanvasBoard } from './SlantCanvasBoard';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { EMPTY } from '../types';
import {
    EXAMPLE_DIMS,
    EXAMPLE_NUMBERS,
    SOLVE_ORDER,
    getExampleFrames,
} from '../utils/exampleData';
import { getSatisfiedNodes } from '../utils/validation';

import { Psychology } from '@/components/icons';
import { ExampleActionButton } from '@/features/games/components/GameInfo/ExampleBase';
import { GameInfoExample } from '@/features/games/components/GameInfo/GameInfoExample';
import { useExampleAnimation } from '@/features/games/components/GameInfo/useExampleAnimation';

/** Interval between animation frames (ms). */
const FRAME_MS = 1500;

// ---------------------------------------------------------------------------
// Example component
// ---------------------------------------------------------------------------

interface ExampleProps {
    /** Cell size in rem units. */
    size: number;
    /** Callback to open analysis mode. */
    handleOpenAnalysis: () => void;
}

export function Example({
    size,
    handleOpenAnalysis,
}: ExampleProps): React.ReactElement {
    const frames = useMemo(() => getExampleFrames(), []);
    const animation = useExampleAnimation({
        frameCount: frames.length,
        intervalMs: FRAME_MS,
    });
    const { isPlaying } = animation;

    const renderFrame = (idxValue: number) => {
        const grid = frames[idxValue] ?? frames[0] ?? [];

        // Determine which cell was most recently placed (for highlight).
        const activeCell =
            idxValue > 0 && idxValue <= SOLVE_ORDER.length
                ? (() => {
                      const entry = SOLVE_ORDER[idxValue - 1];
                      return entry
                          ? `${entry[0].toString()},${entry[1].toString()} `
                          : null;
                  })()
                : null;

        const satisfiedNodes = getSatisfiedNodes(
            grid,
            EXAMPLE_NUMBERS,
            EXAMPLE_DIMS,
            EXAMPLE_DIMS,
        );

        const isSolved =
            idxValue >= SOLVE_ORDER.length &&
            grid.every(row => row.every(cell => cell !== EMPTY));

        return (
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <SlantCanvasBoard
                    grid={grid}
                    numbers={EXAMPLE_NUMBERS}
                    satisfiedNodes={satisfiedNodes}
                    activeCell={activeCell}
                    size={size}
                />

                <TrophyOverlay
                    show={isSolved && isPlaying}
                    sizeVariant="small"
                    showLabel={false}
                    scaling={{
                        iconSize: '2rem',
                        containerSize: '6rem',
                        padding: 1,
                    }}
                />
            </Box>
        );
    };

    return (
        <GameInfoExample
            animation={animation}
            renderFrame={renderFrame}
            extraActions={
                <ExampleActionButton
                    variant="outlined"
                    startIcon={<Psychology />}
                    onClick={handleOpenAnalysis}
                >
                    Analysis
                </ExampleActionButton>
            }
        />
    );
}
