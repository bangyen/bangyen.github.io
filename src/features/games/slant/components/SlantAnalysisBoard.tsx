import { Box, keyframes, styled } from '@mui/material';
import React from 'react';

import { AnalysisProvider } from './AnalysisContext';
import { AnalysisControls } from './AnalysisControls';
import { AnalysisGridCell } from './AnalysisGridCell';
import { AnalysisGridHint } from './AnalysisGridHint';
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
    const {
        gridState,
        conflictSet,
        cycleCells,
        nodeConflictSet,
        numberSize,
        getEnhancedDragProps,
        handleApply,
    } = useSlantAnalysisBoard({
        rows,
        cols,
        numbers,
        size,
        initialMoves,
        onMove,
        onApply,
    });

    return (
        <AnalysisProvider
            value={{ onCopy, onClear, onClose, onApply: handleApply }}
        >
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
                        layers={[
                            {
                                rows,
                                cols,
                                cellProps: (r, c) => ({
                                    children: (
                                        <AnalysisGridCell
                                            r={r}
                                            c={c}
                                            gridState={gridState}
                                            conflictSet={conflictSet}
                                            cycleCells={cycleCells}
                                            size={size}
                                            {...getEnhancedDragProps(
                                                `${String(r)},${String(c)}`,
                                            )}
                                        />
                                    ),
                                }),
                            },
                            {
                                rows: rows + 1,
                                cols: cols + 1,
                                cellProps: (r, c) => ({
                                    children: (
                                        <AnalysisGridHint
                                            r={r}
                                            c={c}
                                            numbers={numbers}
                                            gridState={gridState}
                                            rows={rows}
                                            cols={cols}
                                            nodeConflictSet={nodeConflictSet}
                                            numberSize={numberSize}
                                        />
                                    ),
                                }),
                                layerSx: { pointerEvents: 'none' },
                                decorative: true,
                            },
                        ]}
                        space={0.125}
                    />
                </Box>

                <AnalysisControls />
            </AnimatedBox>
        </AnalysisProvider>
    );
}
