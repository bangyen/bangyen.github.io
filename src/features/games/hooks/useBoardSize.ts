import { useMemo } from 'react';

import { calculateBoardSize } from './boardSizeUtils';
import type { MergedBoardConfig } from './types';

interface UseBoardSizeParams {
    /** Number of grid rows. */
    rows: number;
    /** Number of grid columns. */
    cols: number;
    /** Current viewport width in pixels. */
    width: number;
    /** Current viewport height in pixels. */
    height: number;
    /** Whether the viewport is at a mobile breakpoint. */
    mobile: boolean;
    /** Header height in rem for available-space calculation. */
    headerOffset: { mobile: number; desktop: number };
    /** Resolved board configuration (merged with defaults). */
    boardConfig: MergedBoardConfig;
}

/**
 * Computes the cell size (in rem) that fits the board within the
 * current viewport.  Extracted from `useBaseGame` so it can be
 * tested and reused independently.
 */
export function useBoardSize({
    rows,
    cols,
    width,
    height,
    mobile,
    headerOffset,
    boardConfig,
}: UseBoardSizeParams): number {
    return useMemo(() => {
        const resolvedBoardPadding =
            typeof boardConfig.boardPadding === 'function'
                ? boardConfig.boardPadding(mobile)
                : boardConfig.boardPadding;

        return calculateBoardSize({
            rows: rows + (boardConfig.rowOffset ?? 0),
            cols: cols + (boardConfig.colOffset ?? 0),
            width,
            height,
            mobile,
            headerOffset,
            ...boardConfig,
            boardPadding: resolvedBoardPadding,
        });
    }, [rows, cols, width, height, mobile, headerOffset, boardConfig]);
}
