import { Box } from '@mui/material';
import React, { useMemo } from 'react';

import { Board } from '../../components/Board';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { SLANT_STYLES, NUMBER_SIZE_RATIO } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';
import {
    EXAMPLE_DIMS,
    EXAMPLE_NUMBERS,
    SOLVE_ORDER,
    getExampleFrames,
} from '../utils/exampleData';
import { getSatisfiedNodes } from '../utils/validation';

import { Psychology } from '@/components/icons';
import { COLORS, ANIMATIONS } from '@/config/theme';
import { ExampleActionButton } from '@/features/games/components/GameInfo/ExampleBase';
import { GameInfoExample } from '@/features/games/components/GameInfo/GameInfoExample';
import { useExampleAnimation } from '@/features/games/components/GameInfo/useExampleAnimation';

/** Interval between animation frames (ms). */
const FRAME_MS = 1500;

// ---------------------------------------------------------------------------
// Lightweight cell renderers
// ---------------------------------------------------------------------------

function slashLineSx(angle: string, size: number) {
    return {
        position: 'absolute' as const,
        width: '115%',
        height: `${String(Math.max(2, size))}px`,
        backgroundColor: COLORS.text.primary,
        borderRadius: '99px',
        top: '50%',
        left: '50%',
        '--slant-base-transform': `translate(-50%, -50%) rotate(${angle})`,
        transform: 'var(--slant-base-transform)',
        boxShadow: SLANT_STYLES.SHADOWS.LINE,
        transition: ANIMATIONS.transition,
        animation: SLANT_STYLES.ANIMATIONS.POP_IN_STYLE,
        pointerEvents: 'none' as const,
    };
}

function makeBackProps(
    grid: CellState[][],
    size: number,
    activeCell: string | null,
) {
    return (r: number, c: number) => {
        const value = grid[r]?.[c];
        const pos = `${r.toString()},${c.toString()}`;
        const isActive = pos === activeCell;

        return {
            sx: {
                border: `2px solid ${COLORS.border.subtle}`,
                position: 'relative',
                transition: ANIMATIONS.transition,
                backgroundColor: SLANT_STYLES.ANALYSIS.BG_SUBTLE,
                ...(isActive
                    ? { backgroundColor: COLORS.interactive.hover }
                    : {}),
            },
            children: (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    {value === FORWARD && (
                        <Box sx={slashLineSx('-45deg', size)} />
                    )}
                    {value === BACKWARD && (
                        <Box sx={slashLineSx('45deg', size)} />
                    )}
                </Box>
            ),
        };
    };
}

function makeFrontProps(
    numbers: (number | null)[][],
    satisfiedNodes: Set<string>,
    numberSize: number,
) {
    return (r: number, c: number) => {
        const value = numbers[r]?.[c];
        const pos = `${r.toString()},${c.toString()}`;
        const isSatisfied = satisfiedNodes.has(pos);

        return {
            sx: { pointerEvents: 'none' },
            children: (
                <Box
                    sx={{
                        borderRadius: '50%',
                        backgroundColor: COLORS.surface.background,
                        border:
                            value == null
                                ? 'none'
                                : `2px solid ${
                                      isSatisfied
                                          ? 'transparent'
                                          : COLORS.border.subtle
                                  }`,
                        fontSize: `${String(numberSize * 0.5)}rem`,
                        fontWeight: '800',
                        color: isSatisfied
                            ? COLORS.interactive.disabledText
                            : COLORS.text.primary,
                        boxShadow: isSatisfied
                            ? 'none'
                            : SLANT_STYLES.SHADOWS.HINT,
                        zIndex: 5,
                        opacity: value == null ? 0 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        transform: isSatisfied ? 'scale(0.95)' : 'scale(1)',
                        paddingTop: '0.05rem',
                        lineHeight: 1,
                        width: `${String(numberSize)}rem`,
                        height: `${String(numberSize)}rem`,
                    }}
                >
                    {value ?? ''}
                </Box>
            ),
        };
    };
}

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
                          ? `${entry[0].toString()},${entry[1].toString()}`
                          : null;
                  })()
                : null;

        const satisfiedNodes = getSatisfiedNodes(
            grid,
            EXAMPLE_NUMBERS,
            EXAMPLE_DIMS,
            EXAMPLE_DIMS,
        );

        const numberSize = size * NUMBER_SIZE_RATIO;
        const isSolved =
            idxValue >= SOLVE_ORDER.length &&
            grid.every(row => row.every(cell => cell !== EMPTY));

        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <style>{SLANT_STYLES.ANIMATIONS.POP_IN}</style>
                <Board
                    size={size}
                    layers={[
                        {
                            rows: EXAMPLE_DIMS,
                            cols: EXAMPLE_DIMS,
                            cellProps: makeBackProps(grid, size, activeCell),
                        },
                        {
                            rows: EXAMPLE_DIMS + 1,
                            cols: EXAMPLE_DIMS + 1,
                            cellProps: makeFrontProps(
                                EXAMPLE_NUMBERS,
                                satisfiedNodes,
                                numberSize,
                            ),
                            layerSx: { pointerEvents: 'none' },
                            decorative: true,
                        },
                    ]}
                    space={0.125}
                />
                <TrophyOverlay
                    show={isSolved && isPlaying}
                    sizeVariant="small"
                    showLabel={false}
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
