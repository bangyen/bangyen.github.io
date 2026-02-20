import { Box } from '@mui/material';
import React from 'react';

import { AnalysisProvider } from './AnalysisContext';
import { AnalysisControls } from './AnalysisControls';
import { AnalysisGridCell } from './AnalysisGridCell';
import { AnalysisGridHint } from './AnalysisGridHint';
import { SlantBoard } from './SlantBoard';
import { useSlantAnalysisBoard } from './useSlantAnalysisBoard';
import {
    AnimatedBoardContainer,
    boardPopIn,
} from '../../components/AnimatedBoardContainer';
import { BOARD_STYLES } from '../../config/constants';
import { SLANT_STYLES } from '../config/constants';
import { EMPTY, type CellState } from '../types';
import { computeSatisfied } from '../utils/analysisSolver';

import { getPosKey } from '@/utils/gameUtils';

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
            <AnimatedBoardContainer
                {...boardPopIn}
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
                    <SlantBoard
                        size={size}
                        rows={rows}
                        cols={cols}
                        renderCell={(r, c) => {
                            const pos = getPosKey(r, c);
                            const info = gridState.get(pos);
                            return (
                                <AnalysisGridCell
                                    r={r}
                                    c={c}
                                    value={info?.state ?? EMPTY}
                                    source={info?.source}
                                    isConflict={conflictSet.has(pos)}
                                    isCycle={cycleCells.has(pos)}
                                    size={size}
                                    pos={pos}
                                    getDragProps={getEnhancedDragProps}
                                />
                            );
                        }}
                        renderOverlay={(r, c) => {
                            const value = numbers[r]?.[c] ?? null;
                            const hasConflict = nodeConflictSet.has(
                                getPosKey(r, c),
                            );
                            const isSatisfied = computeSatisfied(
                                r,
                                c,
                                value,
                                gridState,
                                rows,
                                cols,
                            );
                            return (
                                <AnalysisGridHint
                                    r={r}
                                    c={c}
                                    value={value}
                                    hasConflict={hasConflict}
                                    isSatisfied={isSatisfied}
                                    numberSize={numberSize}
                                />
                            );
                        }}
                    />
                </Box>

                <AnalysisControls />
            </AnimatedBoardContainer>
        </AnalysisProvider>
    );
}
