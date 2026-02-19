import { Box, Button } from '@mui/material';
import React, { useState, useEffect, useMemo } from 'react';

import { Board } from '../../components/Board';
import { TrophyOverlay } from '../../components/TrophyOverlay';
import { SLANT_STYLES, NUMBER_SIZE_RATIO } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD, EMPTY } from '../types';
import {
    exampleActionsSx,
    infoButtonSx,
    exampleContainerSx,
} from './SlantInfo.styles';
import {
    EXAMPLE_DIMS,
    EXAMPLE_NUMBERS,
    SOLVE_ORDER,
    getExampleFrames,
} from '../utils/exampleData';
import { getSatisfiedNodes } from '../utils/validation';

import {
    Psychology,
    DeleteRounded,
    Replay as ReplayIcon,
    PlayArrowRounded,
    PauseRounded,
} from '@/components/icons';
import { COLORS, ANIMATIONS } from '@/config/theme';
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
        '--slant-base-transform': `translate(-50%, -50%) rotate(${angle})`,
        transform: 'var(--slant-base-transform)',
        boxShadow: SLANT_STYLES.SHADOWS.LINE,
        transition: ANIMATIONS.transition,
        animation: SLANT_STYLES.ANIMATIONS.POP_IN_STYLE,
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
    /** Callback to clear the board. */
    handleClearBoard: () => void;
}

/**
 * Animated 3×3 Slant demo that cycles through a step-by-step solve.
 * Each frame adds one slash; numbers transition from pending to satisfied.
 */
export function Example({
    size,
    handleOpenAnalysis,
    handleClearBoard,
}: ExampleProps): React.ReactElement {
    const frames = useMemo(() => getExampleFrames(), []);

    const [frameIdx, setFrameIdx] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (!isPlaying) return;

        const id = setInterval(() => {
            setFrameIdx(prev => (prev + 1) % frames.length);
        }, FRAME_MS);
        return () => {
            clearInterval(id);
        };
    }, [frames.length, isPlaying]);

    const handleTogglePlay = () => {
        setIsPlaying(prev => !prev);
    };

    const handleReplay = () => {
        setFrameIdx(0);
        setIsPlaying(true);
    };

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
        <Box sx={exampleContainerSx}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <style>{SLANT_STYLES.ANIMATIONS.POP_IN}</style>
                <Board
                    size={size}
                    rows={EXAMPLE_DIMS + 1}
                    cols={EXAMPLE_DIMS + 1}
                    cellRows={EXAMPLE_DIMS}
                    cellCols={EXAMPLE_DIMS}
                    space={0.125}
                    overlayProps={frontProps}
                    cellProps={backProps}
                    overlayLayerSx={{ pointerEvents: 'none' }}
                    overlayDecorative
                />
                <TrophyOverlay
                    show={isSolved}
                    size={size}
                    iconSizeRatio={1}
                    primaryColor={COLORS.primary.main}
                    showLabel={false}
                />
            </Box>

            <Box sx={exampleActionsSx}>
                <Button
                    variant="outlined"
                    startIcon={
                        isPlaying ? <PauseRounded /> : <PlayArrowRounded />
                    }
                    onClick={handleTogglePlay}
                    sx={infoButtonSx}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<ReplayIcon />}
                    onClick={handleReplay}
                    sx={infoButtonSx}
                >
                    Replay
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<DeleteRounded />}
                    onClick={handleClearBoard}
                    sx={infoButtonSx}
                >
                    Clear Board
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Psychology />}
                    onClick={handleOpenAnalysis}
                    sx={infoButtonSx}
                >
                    Analysis
                </Button>
            </Box>
        </Box>
    );
}
