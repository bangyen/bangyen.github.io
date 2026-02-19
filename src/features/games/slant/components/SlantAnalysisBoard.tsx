import { Box } from '@mui/material';
import React, { useMemo, useCallback } from 'react';

import { AnalysisControls } from './AnalysisControls';
import { buildCellProps, buildNumberProps } from './SlantAnalysisBoardProps';
import { Board } from '../../components/Board';
import { BOARD_STYLES, GAME_CONSTANTS } from '../../config/constants';
import { useDrag } from '../../hooks/useDrag';
import { useGridNavigation } from '../../hooks/useGridNavigation';
import { getDerivedBoardDimensions, SLANT_STYLES } from '../config/constants';
import { useAnalysisSolver } from '../hooks/useAnalysisSolver';
import type { CellState } from '../types';
import {
    filterEmptyMoves,
    getNextAnalysisState,
} from '../utils/analysisSolver';

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
    const userMoves = initialMoves;

    const { getDragProps } = useDrag<CellState | undefined>({
        onToggle: (
            r: number,
            c: number,
            isRightClick: boolean,
            draggingValue: CellState | undefined,
            isInitialClick?: boolean,
        ) => {
            const pos = getPosKey(r, c);

            if (!isInitialClick) {
                onMove(pos, draggingValue);
                return;
            }

            const current = userMoves.get(pos);
            const newState = getNextAnalysisState(current, isRightClick);

            onMove(pos, newState);
            return newState;
        },
        touchTimeout: GAME_CONSTANTS.timing.touchHoldDelay,
        checkEnabled: () => true,
    });

    const { handleKeyDown: handleGridNav } = useGridNavigation({ rows, cols });

    const getEnhancedDragProps = useCallback(
        (pos: string) => {
            const dragProps = getDragProps(pos);
            return {
                ...dragProps,
                onKeyDown: (e: React.KeyboardEvent) => {
                    dragProps.onKeyDown(e);
                    handleGridNav(e);
                },
            };
        },
        [getDragProps, handleGridNav],
    );

    const { gridState, conflicts, cycleCells } = useAnalysisSolver({
        rows,
        cols,
        numbers,
        userMoves,
    });

    // View Helpers

    const { numberSize } = getDerivedBoardDimensions(size);

    const conflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'cell')
                    .map(c => getPosKey(c.r, c.c)),
            ),
        [conflicts],
    );
    const nodeConflictSet = useMemo(
        () =>
            new Set(
                conflicts
                    .filter(c => c.type === 'node')
                    .map(c => getPosKey(c.r, c.c)),
            ),
        [conflicts],
    );

    const getCellProps = useCallback(
        (r: number, c: number) =>
            buildCellProps({
                r,
                c,
                gridState,
                conflictSet,
                cycleCells,
                getDragProps: getEnhancedDragProps,
                size,
            }),
        [gridState, conflictSet, cycleCells, getEnhancedDragProps, size],
    );

    const handleApply = useCallback(() => {
        if (!onApply) return;
        onApply(filterEmptyMoves(gridState));
    }, [onApply, gridState]);

    const getNumberProps = useCallback(
        (r: number, c: number) =>
            buildNumberProps({
                r,
                c,
                numbers,
                gridState,
                rows,
                cols,
                nodeConflictSet,
                numberSize,
            }),
        [numbers, gridState, rows, cols, nodeConflictSet, numberSize],
    );

    return (
        <Box
            sx={{
                position: 'relative',
                userSelect: 'none',
            }}
            onContextMenu={e => {
                e.preventDefault();
            }}
        >
            <style>{SLANT_STYLES.ANIMATIONS.POP_IN}</style>
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
        </Box>
    );
}
