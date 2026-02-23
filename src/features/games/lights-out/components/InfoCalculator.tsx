import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import { CanvasBoard } from './CanvasBoard';
import {
    calculatorRootSx,
    calculatorContainerSx,
    calculatorLabelSx,
    calculatorSubLabelSx,
    calculatorButtonGroupSx,
    calculatorButtonSx,
} from './LightsOutInfo.styles';
import type { Palette } from '../types';

import { ContentCopyRounded, Refresh } from '@/components/icons';
import { CustomGrid } from '@/components/ui/CustomGrid';

export interface InfoCalculatorProps {
    cols: number;
    size: number;
    isMobile: boolean;
    palette: Palette;
    inputGrid: number[][];
    outputGrid: number[][];
    inputProps: (row: number, col: number) => Record<string, unknown>;
    onReset: () => void;
    onApply: () => void;
    hasPattern: boolean;
}

/**
 * Calculator step inside the Info modal, letting users toggle a bottom-row
 * pattern and see the resulting top-row solution.  Cell size is capped so
 * the rows stay proportional inside the fixed-height modal.
 */
export const InfoCalculator = React.memo(function InfoCalculator({
    cols,
    size,
    isMobile,
    palette,
    inputGrid,
    outputGrid,
    inputProps: rawInputProps,
    onReset,
    onApply,
    hasPattern,
}: InfoCalculatorProps) {
    const MAX_CELL = 3; // rem
    const cellSize = Math.min(size * (isMobile ? 0.9 : 0.8), MAX_CELL);
    const cellWidth = cols < 7 ? cellSize * Math.pow(1.5, 3 / cols) : cellSize;

    // Use horizontal layout only when the two grid rows, buttons, and gaps
    // can comfortably fit side-by-side inside the modal (~55rem usable).
    const ROW_WIDTH_REM = cols * cellWidth;
    const BUTTON_WIDTH_REM = 10; // approximate width of the button group
    const GAP_REM = 3 * 0.5; // MUI gap: 3 → 24px ≈ 1.5rem per gap, ×2
    const totalWidth = ROW_WIDTH_REM * 2 + BUTTON_WIDTH_REM + GAP_REM * 2;
    const useHorizontal = !isMobile && totalWidth < 55;

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
                        <Box sx={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                            <CustomGrid
                                space={0}
                                rows={1}
                                cols={cols}
                                size={cellSize}
                                width={cellWidth}
                                cellProps={inputProps}
                            />
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

                <Box sx={calculatorButtonGroupSx(useHorizontal, isMobile)}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ContentCopyRounded />}
                        disabled={!hasPattern}
                        onClick={onApply}
                        sx={calculatorButtonSx}
                    >
                        Copy Pattern
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={onReset}
                        sx={calculatorButtonSx}
                    >
                        Clear Pattern
                    </Button>
                </Box>
            </Box>
        </Box>
    );
});
