import { useMemo } from 'react';

import { useBoardSize } from './useBoardSize';
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
        () => ({
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
        }),
        [board],
    );

    const gridLayout = useGridSize({
        storageKey,
        ...gridMerged,
    });

    const size = useBoardSize({
        rows: gridLayout.rows,
        cols: gridLayout.cols,
        width: gridLayout.width,
        height: gridLayout.height,
        mobile: gridLayout.mobile,
        headerOffset: gridMerged.headerOffset,
        boardConfig: mergedBoard,
    });

    const { scaling } = useGameViewport();

    return {
        ...gridLayout,
        size,
        scaling,
        gridMerged,
    };
}
