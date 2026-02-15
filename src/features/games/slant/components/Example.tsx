import { Box } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';

import { Board } from '../../components/Board';
import { SLANT_STYLES, NUMBER_SIZE_RATIO } from '../constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';
import {
    EXAMPLE_DIMS,
    EXAMPLE_NUMBERS,
    SOLVE_ORDER,
    getExampleFrames,
} from '../utils/exampleData';
import { getSatisfiedNodes } from '../utils/validation';

import { EmojiEventsRounded } from '@/components/icons';
import { GlassCard } from '@/components/ui/GlassCard';
import { COLORS, ANIMATIONS, SPACING } from '@/config/theme';
import { getPosKey } from '@/utils/gameUtils';

/** Interval between animation frames (ms). */
const FRAME_MS = 1500;

// ---------------------------------------------------------------------------
// Lightweight cell renderers (no drag, no error handling)
// ---------------------------------------------------------------------------

/**
 * Builds the sx props for a diagonal slash line inside a cell.
 * Matches the production renderer but omits error styling since
 * the tutorial never has errors.
 */
function slashLineSx(angle: string, size: number) {
    return {
        position: 'absolute' as const,
        width: '115%',
        height: `${String(Math.max(2, size))}px`,
        backgroundColor: COLORS.text.primary,
        borderRadius: '99px',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${angle})`,
        boxShadow: SLANT_STYLES.SHADOWS.LINE,
        transition: ANIMATIONS.transition,
        pointerEvents: 'none' as const,
    };
}

/**
 * Returns cell-level props for the back (slash) layer.
 * Highlights the most recently placed cell with a subtle pulse.
 */
function makeBackProps(
    grid: CellState[][],
    size: number,
    activeCell: string | null,
) {
    return (r: number, c: number) => {
        const value = grid[r]?.[c];
        const pos = getPosKey(r, c);
        const isActive = pos === activeCell;

        return {
            sx: {
                border: `1px solid ${COLORS.border.subtle}`,
                position: 'relative',
                transition: ANIMATIONS.transition,
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

/**
 * Returns cell-level props for the front (number hint) layer.
 * Colors satisfied numbers the same way the production renderer does.
 */
function makeFrontProps(
    numbers: (number | null)[][],
    satisfiedNodes: Set<string>,
    numberSize: number,
) {
    return (r: number, c: number) => {
        const value = numbers[r]?.[c];
        const pos = getPosKey(r, c);
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
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
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
}

/**
 * Animated 3×3 Slant demo that cycles through a step-by-step solve.
 * Each frame adds one slash; numbers transition from pending to satisfied.
 */
export default function Example({ size }: ExampleProps): React.ReactElement {
    const frames = useMemo(() => getExampleFrames(), []);

    const [frameIdx, setFrameIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setFrameIdx(prev => (prev + 1) % frames.length);
        }, FRAME_MS);
        return () => {
            clearInterval(id);
        };
    }, [frames.length]);

    const grid = useMemo(
        () => frames[frameIdx] ?? frames[0] ?? [],
        [frames, frameIdx],
    );

    // Determine which cell was most recently placed (for highlight).
    // Frame 0 is the empty board; frame i corresponds to SOLVE_ORDER[i-1].
    const activeCell =
        frameIdx > 0 && frameIdx <= SOLVE_ORDER.length
            ? (() => {
                  const entry = SOLVE_ORDER[frameIdx - 1];
                  return entry ? getPosKey(entry[0], entry[1]) : null;
              })()
            : null;

    // Compute satisfied nodes for the current frame.
    const satisfiedNodes = useMemo(
        () =>
            getSatisfiedNodes(
                grid,
                EXAMPLE_NUMBERS,
                EXAMPLE_DIMS,
                EXAMPLE_DIMS,
            ),
        [grid],
    );

    const numberSize = size * NUMBER_SIZE_RATIO;

    const isSolved =
        frameIdx >= SOLVE_ORDER.length &&
        grid.every(row => row.every(cell => cell !== EMPTY));

    const backProps = useMemo(
        () => makeBackProps(grid, size, activeCell),
        [grid, size, activeCell],
    );

    const frontProps = useMemo(
        () => makeFrontProps(EXAMPLE_NUMBERS, satisfiedNodes, numberSize),
        [satisfiedNodes, numberSize],
    );

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Board
                    size={size}
                    rows={EXAMPLE_DIMS + 1}
                    cols={EXAMPLE_DIMS + 1}
                    frontProps={frontProps}
                    backProps={backProps}
                    frontLayerSx={{ pointerEvents: 'none' }}
                />
                {/* Trophy overlay when solved */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isSolved ? 1 : 0,
                        transform: isSolved ? 'scale(1)' : 'scale(0.5)',
                        visibility: isSolved ? 'visible' : 'hidden',
                        transition:
                            'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        pointerEvents: 'none',
                        zIndex: 10,
                        backgroundColor: 'transparent',
                    }}
                >
                    <GlassCard
                        padding={SPACING.padding.md}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            height: 'auto',
                            width: 'auto',
                            maxWidth: '80%',
                        }}
                    >
                        <EmojiEventsRounded
                            sx={{
                                fontSize: { xs: '2rem', sm: '3rem' },
                                color: COLORS.primary.main,
                                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
                            }}
                        />
                    </GlassCard>
                </Box>
            </Box>
        </Box>
    );
}
