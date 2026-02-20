import { Box, keyframes, styled } from '@mui/material';
import React from 'react';

import { AnalysisControls } from './AnalysisControls';
import { useSlantAnalysisBoard } from './useSlantAnalysisBoard';
import { Board } from '../../components/Board';
import { BOARD_STYLES } from '../../config/constants';
import { SLANT_STYLES } from '../config/constants';
import type { CellState } from '../types';

export interface SlantAnalysisBoardProps {
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    size: number;
    initialMoves: Map<string, CellState>;
    onMove: (pos: string, val: CellState | undefined) => void;
    onCopy?: () => void;
    onClear?: () => void;
    onClose?: () => void;
    onApply?: (moves: Map<string, CellState>) => void;
}

const popIn = keyframes`
    0% { transform: scale(0.95); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
`;

const AnimatedBox = styled(Box)(() => ({
    animation: `${popIn} 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
}));

export function SlantAnalysisBoard({
    rows,
    cols,
    numbers,
    size,
    initialMoves,
    onMove,
    onCopy,
    onClear,
    onClose,
    onApply,
}: SlantAnalysisBoardProps) {
    const { getCellProps, getNumberProps, handleApply } = useSlantAnalysisBoard(
        {
            rows,
            cols,
            numbers,
            size,
            initialMoves,
            onMove,
            onApply,
        },
    );

    return (
        <AnimatedBox
            sx={{
                position: 'relative',
                userSelect: 'none',
            }}
            onContextMenu={e => {
                e.preventDefault();
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    border: `2px dashed ${SLANT_STYLES.ANALYSIS.DASHED_BORDER}`,
                    borderRadius: BOARD_STYLES.BORDER_RADIUS,
                }}
            >
                <Board
                    size={size}
                    rows={rows + 1}
                    cols={cols + 1}
                    cellRows={rows}
                    cellCols={cols}
                    space={0.125}
                    overlayProps={getNumberProps}
                    cellProps={getCellProps}
                    overlayLayerSx={{ pointerEvents: 'none' }}
                    overlayDecorative
                />
            </Box>

            <AnalysisControls
                onCopy={onCopy}
                onClear={onClear}
                onClose={onClose}
                onApply={handleApply}
            />
        </AnimatedBox>
    );
}
