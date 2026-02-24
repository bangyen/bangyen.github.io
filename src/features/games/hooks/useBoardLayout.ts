import { useMemo, useCallback } from 'react';

import { calculateBoardSize } from './boardSizeUtils';
import type { MergedBoardConfig, GridConfig } from './types';
import { useGridSize } from './useGridSize';
import { DEFAULT_BOARD_CONFIG, DEFAULT_GRID_CONFIG } from '../config/constants';
import { GAME_TOKENS } from '../config/tokens';

export interface UseBoardLayoutConfig {
    /** localStorage key for grid dimensions. */
    storageKey?: string;
    /** Grid sizing configuration. */
    gridConfig?: GridConfig;
    /** Game-specific board configuration (cell sizes, paddings). */
    boardConfig?: Partial<MergedBoardConfig>;
    /** Whether dimensions are manually managed (e.g. by a generator). */
    manualResize?: boolean;
}

/**
 * Orchestrates grid dimension management and board size calculations.
 */
export function useBoardLayout({
    storageKey,
    gridConfig: callerGridConfig,
    boardConfig,
    manualResize,
}: UseBoardLayoutConfig = {}) {
    const currentHeaderOffset =
        callerGridConfig?.headerOffset ?? DEFAULT_GRID_CONFIG.headerOffset;

    // 1. Manage grid dimensions (rows, cols)
    const { rows, cols, width, height, mobile, ...gridConfig } = useGridSize({
        storageKey: storageKey ?? '',
        defaultSize:
            callerGridConfig?.defaultSize === undefined
                ? DEFAULT_GRID_CONFIG.defaultSize
                : callerGridConfig.defaultSize,
        minSize: callerGridConfig?.minSize ?? DEFAULT_GRID_CONFIG.minSize,
        maxSize: callerGridConfig?.maxSize ?? DEFAULT_GRID_CONFIG.maxSize,
        headerOffset: currentHeaderOffset,
        gridPadding:
            callerGridConfig?.gridPadding ?? DEFAULT_GRID_CONFIG.gridPadding,
        widthLimit:
            callerGridConfig?.widthLimit ?? DEFAULT_GRID_CONFIG.widthLimit,
        cellSizeReference:
            callerGridConfig?.cellSizeReference ??
            DEFAULT_GRID_CONFIG.cellSizeReference,
        mobileRowOffset:
            callerGridConfig?.mobileRowOffset ??
            DEFAULT_GRID_CONFIG.mobileRowOffset,
    });

    // 2. Derive visual board metrics based on grid dimensions and current viewport
    const mergedBoard = useMemo(
        () => ({
            ...DEFAULT_BOARD_CONFIG,
            ...boardConfig,
        }),
        [boardConfig],
    );

    const resolvedPadding =
        typeof mergedBoard.boardPadding === 'function'
            ? mergedBoard.boardPadding(mobile)
            : mergedBoard.boardPadding;

    const size = calculateBoardSize({
        rows,
        cols,
        width,
        height,
        mobile,
        headerOffset: currentHeaderOffset,
        ...mergedBoard,
        boardPadding: resolvedPadding,
    });

    const updateConfig = gridConfig.setDesiredSize;

    const handleResize = useCallback(
        (newRows: number, newCols: number) => {
            if (manualResize) {
                updateConfig(newCols);
            }
        },
        [manualResize, updateConfig],
    );

    const handleRefresh = useCallback(() => {
        // Refresh logic
    }, []);

    const scaling = GAME_TOKENS.scaling.default;

    return {
        rows,
        cols,
        size,
        mobile,
        scaling,
        gridConfig: {
            ...gridConfig,
            handleResize,
            handleRefresh,
            mobile,
            width,
            height,
        },
    };
}
