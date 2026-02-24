import { Box } from '@mui/material';
import React from 'react';

import { AnalysisProvider } from './AnalysisContext';
import { AnalysisControls } from './AnalysisControls';
import { SlantBoard } from './SlantBoard';
import { BoardOuterWrapper } from '../../components/InteractiveBoard';
import { SLANT_STYLES } from '../config/constants';
import { useSlantAnalysisBoard } from '../hooks/useSlantAnalysisBoard';
import { EMPTY } from '../types';
import type { CellState, SlantState } from '../types';
import { computeSatisfied } from '../utils/analysisSolver';

import { BOARD_STYLES } from '@/features/games/config/constants';

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
    ...state
}: SlantAnalysisBoardProps & Partial<SlantState>) {
    const {
        gridState,
        conflictSet,
        cycleCells,
        nodeConflictSet,
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
            <BoardOuterWrapper
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
                        state={{
                            ...state,
                            grid: Array.from({ length: rows }, (_, r) =>
                                Array.from({ length: cols }, (_, c) => {
                                    const pos = `${r.toString()},${c.toString()}`;
                                    return gridState.get(pos)?.state ?? EMPTY;
                                }),
                            ),
                            numbers,
                            satisfiedNodes: new Set(
                                Array.from({ length: rows + 1 }, (_, r) =>
                                    Array.from({ length: cols + 1 }, (_, c) => {
                                        const value = numbers[r]?.[c];
                                        if (
                                            value === null ||
                                            value === undefined
                                        )
                                            return null;
                                        return computeSatisfied(
                                            r,
                                            c,
                                            value,
                                            gridState,
                                            rows,
                                            cols,
                                        )
                                            ? `${r.toString()},${c.toString()}`
                                            : null;
                                    }),
                                )
                                    .flat()
                                    .filter(
                                        (pos): pos is string => pos !== null,
                                    ),
                            ),
                            errorNodes: new Set(),
                            cycleCells: new Set(),
                        }}
                        cellSources={
                            new Map(
                                Array.from(gridState.entries()).map(
                                    ([pos, info]) => [pos, info.source],
                                ),
                            )
                        }
                        conflictSet={conflictSet}
                        cycleCells={cycleCells}
                        nodeConflictSet={nodeConflictSet}
                        cellProps={(r: number, c: number) =>
                            getEnhancedDragProps(
                                `${r.toString()},${c.toString()}`,
                            )
                        }
                    />
                </Box>

                <AnalysisControls />
            </BoardOuterWrapper>
        </AnalysisProvider>
    );
}
