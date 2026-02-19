import { Box, Typography } from '@mui/material';
import React from 'react';

import { Board } from '../../components/Board';
import { SLANT_STYLES, NUMBER_SIZE_RATIO } from '../config/constants';
import type { CellState } from '../types';
import { FORWARD, BACKWARD } from '../types';

import { COLORS } from '@/config/theme';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface PatternDef {
    title: string;
    description: string;
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    grid: CellState[][];
}

const PATTERNS: PatternDef[] = [
    {
        title: 'Corner 0',
        description:
            'A "0" in a corner forces the line to point away from that corner.',
        rows: 2,
        cols: 2,
        numbers: [
            [0, null],
            [null, null],
        ],
        grid: [[FORWARD]],
    },
    {
        title: 'Corner 1',
        description:
            'A "1" in a corner forces the line to connect directly to that corner.',
        rows: 2,
        cols: 2,
        numbers: [
            [1, null],
            [null, null],
        ],
        grid: [[BACKWARD]],
    },
    {
        title: 'Edge 0',
        description:
            'A "0" on the edge forces all surrounding lines to point away from it.',
        rows: 2,
        cols: 3,
        numbers: [
            [null, 0, null],
            [null, null, null],
        ],
        grid: [[BACKWARD, FORWARD]],
    },
    {
        title: 'Edge 1',
        description:
            'A "1" on the edge forces the two surrounding lines into the same orientation.',
        rows: 2,
        cols: 3,
        numbers: [
            [null, 1, null],
            [null, null, null],
        ],
        grid: [[FORWARD, FORWARD]],
    },
    {
        title: 'Edge 2',
        description:
            'A "2" on the edge forces both surrounding lines to connect to it.',
        rows: 2,
        cols: 3,
        numbers: [
            [null, 2, null],
            [null, null, null],
        ],
        grid: [[FORWARD, BACKWARD]],
    },
    {
        title: 'Middle 4',
        description: 'A "4" must catch lines from all four surrounding cells.',
        rows: 3,
        cols: 3,
        numbers: [
            [null, null, null],
            [null, 4, null],
            [null, null, null],
        ],
        grid: [
            [BACKWARD, FORWARD],
            [FORWARD, BACKWARD],
        ],
    },
];

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const patternContainerSx = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 4,
    width: '100%',
    py: 2,
    pr: 4,
    // Overflow handled by parent infoStepContentSx
};

const patternItemSx = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    width: '100%',
    // maxWidth removed to let grid control width
};

const patternBoardContainerSx = {
    width: '180px', // Fixed width to align all boards
    display: 'flex',
    justifyContent: 'center',
    flexShrink: 0,
};

const patternTextSx = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    flex: 1,
    minWidth: 0, // Allow text to wrap properly
};

// ---------------------------------------------------------------------------
// Helper Functions (Simplified from Example.tsx)
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
        transform: `translate(-50%, -50%) rotate(${angle})`,
        boxShadow: SLANT_STYLES.SHADOWS.LINE,
        pointerEvents: 'none' as const,
    };
}

function makeBackProps(grid: CellState[][], size: number) {
    return (r: number, c: number) => {
        const value = grid[r]?.[c];

        return {
            sx: {
                border: `2px solid ${COLORS.border.subtle}`,
                position: 'relative',
                backgroundColor: SLANT_STYLES.ANALYSIS.BG_SUBTLE,
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

function makeFrontProps(numbers: (number | null)[][], numberSize: number) {
    return (r: number, c: number) => {
        const value = numbers[r]?.[c];

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
                                : `2px solid ${COLORS.border.subtle}`,
                        fontSize: `${String(numberSize * 0.5)}rem`,
                        fontWeight: '800',
                        color: COLORS.text.primary,
                        boxShadow:
                            value == null ? 'none' : SLANT_STYLES.SHADOWS.HINT,
                        zIndex: 5,
                        opacity: value == null ? 0 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
// Pattern Description Renderer
// ---------------------------------------------------------------------------

const numberBadgeSx = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5em',
    height: '1.5em',
    borderRadius: '50%',
    backgroundColor: COLORS.surface.background,
    border: `1px solid ${COLORS.border.subtle}`,
    fontSize: '0.85em',
    fontWeight: 'bold',
    mx: 0.4,
    verticalAlign: 'middle',
    lineHeight: 1,
    boxShadow: SLANT_STYLES.SHADOWS.HINT,
    // Optical adjustment to sit nicely with text
    position: 'relative',
    top: '-0.1em',
};

/**
 * Parses description text and replaces quoted numbers (e.g. "1")
 * with a styled badge.
 */
function PatternDescription({ text }: { text: string }) {
    // Split by quoted numbers: "1", "4", etc.
    // Capturing group (1) keeps the number in the result array.
    const parts = text.split(/"(\d+)"/g);

    return (
        <Typography variant="body2" sx={{ color: COLORS.text.secondary }}>
            {parts.map((part, i) => {
                // If the part is numeric and was surrounded by quotes (odd index), render badge
                // Note: regex split puts capturing groups at odd indices
                if (i % 2 === 1) {
                    return (
                        <Box
                            component="span"
                            key={`${String(i)}-${part}`}
                            sx={numberBadgeSx}
                        >
                            {part}
                        </Box>
                    );
                }
                return part;
            })}
        </Typography>
    );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommonPatterns() {
    const size = 3; // Fixed cell size for patterns
    const numberSize = size * NUMBER_SIZE_RATIO;

    return (
        <Box sx={patternContainerSx}>
            {PATTERNS.map(pattern => (
                <Box key={pattern.title} sx={patternItemSx}>
                    <Box sx={patternBoardContainerSx}>
                        <Board
                            size={size}
                            rows={pattern.rows}
                            cols={pattern.cols}
                            cellRows={pattern.rows - 1}
                            cellCols={pattern.cols - 1}
                            space={0.125}
                            overlayProps={makeFrontProps(
                                pattern.numbers,
                                numberSize,
                            )}
                            cellProps={makeBackProps(pattern.grid, size)}
                            overlayLayerSx={{ pointerEvents: 'none' }}
                            overlayDecorative
                        />
                    </Box>
                    <Box sx={patternTextSx}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 'bold',
                                color: COLORS.text.primary,
                            }}
                        >
                            {pattern.title}
                        </Typography>
                        <PatternDescription text={pattern.description} />
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
