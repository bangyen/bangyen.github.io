import { useCallback } from 'react';

import { buildCellProps, buildNumberProps } from './SlantAnalysisBoardProps';
import { getDerivedBoardDimensions } from '../config/constants';
import { useAnalysisSolver } from '../hooks/useAnalysisSolver';
import type { CellState } from '../types';
import {
    filterEmptyMoves,
    getNextAnalysisState,
} from '../utils/analysisSolver';

import { GAME_CONSTANTS } from '@/features/games/config/constants';
import { useDrag } from '@/features/games/hooks/useDrag';
import { useGridNavigation } from '@/features/games/hooks/useGridNavigation';
import { getPosKey } from '@/utils/gameUtils';

export interface UseSlantAnalysisBoardProps {
    rows: number;
    cols: number;
    numbers: (number | null)[][];
    size: number;
    initialMoves: Map<string, CellState>;
    onMove: (pos: string, val: CellState | undefined) => void;
    onApply?: (moves: Map<string, CellState>) => void;
}

export function useSlantAnalysisBoard({
    rows,
    cols,
    numbers,
    size,
    initialMoves,
    onMove,
    onApply,
}: UseSlantAnalysisBoardProps) {
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

    const { gridState, cycleCells, conflictSet, nodeConflictSet } =
        useAnalysisSolver({
            rows,
            cols,
            numbers,
            userMoves,
        });

    const { numberSize } = getDerivedBoardDimensions(size);

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

    return { getCellProps, getNumberProps, handleApply };
}
