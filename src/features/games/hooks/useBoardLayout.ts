import { useMemo } from 'react';

import { calculateBoardSize } from './boardSizeUtils';
import type { MergedBoardConfig } from './types';
import { useGameViewport } from './useGameViewport';
import { useGridSize } from './useGridSize';
import { DEFAULT_BOARD_CONFIG, DEFAULT_GRID_CONFIG } from '../config/constants';

export interface UseBoardLayoutConfig {
    /** localStorage key for grid dimensions. */
    storageKey: string;
    /** Grid configuration overrides. */
    grid?: Record<string, unknown>;
    /** Board configuration overrides. */
    board?: Record<string, unknown>;
}

/**
 * Manages grid dimensions, board sizing, and responsive layout.
 * Extracted from useBaseGame for better separation of concerns.
 */
export function useBoardLayout({
    storageKey,
    grid = {},
    board = {},
}: UseBoardLayoutConfig) {
    // Build the grid config by merging caller overrides with defaults.
    const gridMerged = {
        ...DEFAULT_GRID_CONFIG,
        ...Object.fromEntries(
            Object.entries(grid).filter(([, v]) => v !== undefined),
        ),
    };

    // Build the board config by merging caller overrides with defaults.
    const mergedBoard = useMemo(
        () =>
            ({
                ...DEFAULT_BOARD_CONFIG,
                ...Object.fromEntries(
                    Object.entries(board).filter(
                        ([k, v]) =>
                            v !== undefined &&
                            k !== 'rowOffset' &&
                            k !== 'colOffset',
                    ),
                ),
                rowOffset: board['rowOffset'] as number | undefined,
                colOffset: board['colOffset'] as number | undefined,
            }) as MergedBoardConfig,
        [board],
    );

    const gridLayout = useGridSize({
        storageKey,
        ...gridMerged,
    });

    const { rows, cols, width, height, mobile } = gridLayout;

    const size = useMemo(() => {
        const boardConfig = mergedBoard;
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
            headerOffset: gridMerged.headerOffset,
            ...boardConfig,
            boardPadding: resolvedBoardPadding,
        });
    }, [
        rows,
        cols,
        width,
        height,
        mobile,
        gridMerged.headerOffset,
        mergedBoard,
    ]);

    const { scaling } = useGameViewport();

    return {
        ...gridLayout,
        size,
        scaling,
        gridMerged,
    };
}
