import { Box, Typography, Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import React from 'react';

import { CanvasBoard } from './CanvasBoard';
import type { Palette } from '../types';

import { ContentCopyRounded, FileDownloadRounded } from '@/components/icons';
import { COLORS } from '@/config/theme';

/** Root wrapper of the calculator step. */
const calculatorRootSx: SxProps<Theme> = {
    animation: 'fadeIn 0.3s ease',
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'clip',
};

/** Flex container holding input / output grids and buttons. */
const calculatorContainerSx = (useHorizontal: boolean): SxProps<Theme> => ({
    flex: 1,
    display: 'flex',
    flexDirection: useHorizontal ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
});

/** Bold label above each grid row. */
const calculatorLabelSx: SxProps<Theme> = {
    mb: 1,
    color: COLORS.text.primary,
    fontWeight: 'bold',
};

/** Lighter sub-label inside the grid row header. */
const calculatorSubLabelSx: SxProps<Theme> = {
    color: COLORS.text.secondary,
    fontWeight: 'normal',
};

/** Button-group container layout. */
const calculatorButtonGroupSx = (
    useHorizontal: boolean,
    isMobileSm: boolean,
): SxProps<Theme> => ({
    display: 'flex',
    flexDirection: useHorizontal || isMobileSm ? 'column' : 'row',
    gap: 1,
    alignItems: 'stretch',
});

/** Outlined action button. */
const calculatorButtonSx: SxProps<Theme> = {
    borderColor: COLORS.border.subtle,
    color: COLORS.text.secondary,
    flex: 1,
    width: '100%',
    whiteSpace: 'nowrap',
};

export interface SolutionCalculatorProps {
    cols: number;
    size: number;
    isMobile: boolean;
    isMobileSm: boolean;
    palette: Palette;
    inputGrid: number[][];
    outputGrid: number[][];
    inputProps: (row: number, col: number) => Record<string, unknown>;
    onApply: () => void;
    onFillFromBoard: () => void;
    hasPattern: boolean;
}

/**
 * Calculator step inside the Tutorial modal, letting users toggle a bottom-row
 * pattern and see the resulting top-row solution.  Cell size is capped so
 * the rows stay proportional inside the fixed-height modal.
 */
export const SolutionCalculator = React.memo(function SolutionCalculator({
    cols,
    size,
    isMobile,
    isMobileSm,
    palette,
    inputGrid,
    outputGrid,
    inputProps: rawInputProps,
    onApply,
    onFillFromBoard,
    hasPattern,
}: SolutionCalculatorProps) {
    const MAX_CELL = 3; // rem
    const cellSize = Math.min(size * (isMobile ? 0.9 : 0.8), MAX_CELL);

    // Calculate scaling factor for width.
    const scaledCellWidth = cellSize * Math.pow(1.5, 3 / cols);

    // Layout constants/thresholds.
    const HORIZONTAL_THRESHOLD_REM = 55;
    const BUTTON_WIDTH_REM = 10;
    const GAP_REM = 3 * 0.5; // MUI gap: 3 → 24px ≈ 1.5rem per gap

    // Check if scaled version fits horizontally.
    const totalScaledWidthHorizontal =
        cols * scaledCellWidth * 2 + BUTTON_WIDTH_REM + GAP_REM * 2;
    const fitsScaledHorizontal =
        !isMobile && totalScaledWidthHorizontal < HORIZONTAL_THRESHOLD_REM;

    // Check if base version fits horizontally.
    const totalBaseWidthHorizontal =
        cols * cellSize * 2 + BUTTON_WIDTH_REM + GAP_REM * 2;
    const fitsBaseHorizontal =
        !isMobile && totalBaseWidthHorizontal < HORIZONTAL_THRESHOLD_REM;

    // Determine cell width and layout orientation.
    let cellWidth: number;
    let useHorizontal: boolean;

    if (fitsScaledHorizontal) {
        cellWidth = scaledCellWidth;
        useHorizontal = true;
    } else if (fitsBaseHorizontal) {
        cellWidth = cellSize;
        useHorizontal = true;
    } else {
        // Fallback to vertical layout (always for mobile, or if horizontal doesn't fit).
        useHorizontal = false;

        // In vertical layout, we check if the grid is too wide for the container.
        const VERTICAL_THRESHOLD_REM = isMobileSm ? 20 : isMobile ? 30 : 50;
        const fitsScaledVertical =
            cols * scaledCellWidth < VERTICAL_THRESHOLD_REM;

        cellWidth = fitsScaledVertical ? scaledCellWidth : cellSize;
    }

    // Enhance input props to be transparent while maintaining interaction
    const inputProps = React.useMemo(() => {
        return (row: number, col: number) => {
            const props = rawInputProps(row, col);
            /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
            const sx = (props['sx'] as any) || {};
            return {
                ...props,
                backgroundColor: 'transparent',
                // Icons (children) are only visible on hover/focus.
                ['sx']: {
                    ...sx,
                    backgroundColor: 'transparent !important',
                    color: 'transparent',
                    '&:hover': {
                        ...sx['&:hover'],
                        color: sx['&:hover']?.color ?? 'inherit',
                    },
                    '&:focus-visible': {
                        ...sx['&:focus-visible'],
                        color: sx['&:focus-visible']?.color ?? 'inherit',
                    },
                },
            };
            /* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        };
    }, [rawInputProps]);

    return (
        <Box sx={calculatorRootSx}>
            <Box sx={calculatorContainerSx(useHorizontal)}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={calculatorLabelSx}>
                        Input{' '}
                        <Box component="span" sx={calculatorSubLabelSx}>
                            (Bottom Row)
                        </Box>
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CanvasBoard
                            grid={inputGrid}
                            palette={palette}
                            size={cellSize}
                            width={cellWidth}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 1,
                                display: 'grid',
                                gridTemplateColumns: `repeat(${cols.toString()}, ${cellWidth.toString()}rem)`,
                            }}
                        >
                            {Array.from({ length: cols }).map((_, i) => {
                                const props = inputProps(0, i) as {
                                    sx?: Record<string, unknown>;
                                } & Record<string, unknown>;
                                return (
                                    <Box
                                        key={`input-${i.toString()}`}
                                        {...props}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            ...props.sx,
                                        }}
                                    />
                                );
                            })}
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={calculatorLabelSx}>
                        Solution{' '}
                        <Box component="span" sx={calculatorSubLabelSx}>
                            (Top Row)
                        </Box>
                    </Typography>
                    <CanvasBoard
                        grid={outputGrid}
                        palette={palette}
                        size={cellSize}
                        width={cellWidth}
                    />
                </Box>

                <Box
                    sx={
                        [
                            calculatorButtonGroupSx(useHorizontal, isMobileSm),
                            {
                                width: useHorizontal
                                    ? undefined
                                    : `${(isMobileSm ? BUTTON_WIDTH_REM : 25).toString()}rem`,
                            },
                        ] as SxProps<Theme>
                    }
                >
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<FileDownloadRounded />}
                        onClick={onFillFromBoard}
                        sx={calculatorButtonSx}
                    >
                        Fill from Board
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopyRounded />}
                        disabled={!hasPattern}
                        onClick={onApply}
                        sx={calculatorButtonSx}
                    >
                        Apply Solution
                    </Button>
                </Box>
            </Box>
        </Box>
    );
});
