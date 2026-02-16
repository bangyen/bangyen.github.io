import { Box, Typography, Button } from '@mui/material';
import React from 'react';

import {
    calculatorRootSx,
    calculatorContainerSx,
    calculatorLabelSx,
    calculatorSubLabelSx,
    calculatorButtonGroupSx,
    calculatorButtonSx,
} from './styles';

import { ContentCopyRounded, Refresh } from '@/components/icons';
import { CustomGrid } from '@/components/ui/CustomGrid';

export interface InfoCalculatorProps {
    cols: number;
    size: number;
    isMobile: boolean;
    inputProps: (row: number, col: number) => Record<string, unknown>;
    outputProps: (row: number, col: number) => Record<string, unknown>;
    onReset: () => void;
    onApply: () => void;
    hasPattern: boolean;
}

/**
 * Calculator step inside the Info modal, letting users toggle a bottom-row
 * pattern and see the resulting top-row solution.  Cell size is capped so
 * the rows stay proportional inside the fixed-height modal.
 */
export function InfoCalculator({
    cols,
    size,
    isMobile,
    inputProps,
    outputProps,
    onReset,
    onApply,
    hasPattern,
}: InfoCalculatorProps) {
    const MAX_CELL = 3; // rem
    const cellSize = Math.min(size * (isMobile ? 0.9 : 0.8), MAX_CELL);

    // Use horizontal layout only when the two grid rows, buttons, and gaps
    // can comfortably fit side-by-side inside the modal (~55rem usable).
    const ROW_WIDTH_REM = cols * cellSize;
    const BUTTON_WIDTH_REM = 10; // approximate width of the button group
    const GAP_REM = 3 * 0.5; // MUI gap: 3 → 24px ≈ 1.5rem per gap, ×2
    const totalWidth = ROW_WIDTH_REM * 2 + BUTTON_WIDTH_REM + GAP_REM * 2;
    const useHorizontal = !isMobile && totalWidth < 55;

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
                    <CustomGrid
                        space={0}
                        rows={1}
                        cols={cols}
                        size={cellSize}
                        cellProps={inputProps}
                    />
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" sx={calculatorLabelSx}>
                        Solution{' '}
                        <Box component="span" sx={calculatorSubLabelSx}>
                            (Top Row)
                        </Box>
                    </Typography>
                    <CustomGrid
                        space={0}
                        rows={1}
                        cols={cols}
                        size={cellSize}
                        cellProps={outputProps}
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
}
