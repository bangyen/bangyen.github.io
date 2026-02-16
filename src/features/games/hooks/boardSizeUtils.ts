/**
 * Configuration for responsive board size calculations.
 */
export interface BoardSizeConfig {
    /** Number of rows in the grid */
    rows: number;
    /** Number of columns in the grid */
    cols: number;
    /** Current viewport width in pixels */
    width: number;
    /** Current viewport height in pixels */
    height: number;
    /** Whether the viewport is at a mobile breakpoint */
    mobile: boolean;
    /** Header height in rem for available space calculation */
    headerOffset: {
        mobile: number;
        desktop: number;
    };
    /** Padding to subtract from available space */
    boardPadding: number | { x: number; y: number };
    /** Maximum board width in pixels */
    boardMaxWidth: number;
    /** Factor to reduce available space (0-1) */
    boardSizeFactor: number;
    /** Maximum cell size in pixels */
    maxCellSize: number;
    /** Rem base value (typically 16) */
    remBase: number;
}

/**
 * Pure function that calculates the largest uniform cell size (in rem)
 * that fits within the given viewport dimensions, respecting padding,
 * header offsets, and maximum constraints.
 *
 * Extracted from the former `useResponsiveBoardSize` hook so that
 * callers like `useBaseGame` can reuse viewport values already
 * obtained from `useGridSize`, avoiding duplicate hook invocations.
 *
 * @param config - Board sizing configuration including viewport dimensions
 * @returns Cell size in rem units
 *
 * @example
 * ```ts
 * const cellSize = calculateBoardSize({
 *   rows: 5, cols: 5,
 *   width: 1024, height: 768, mobile: false,
 *   headerOffset: { mobile: 56, desktop: 64 },
 *   boardPadding: 16,
 *   boardMaxWidth: 1200,
 *   boardSizeFactor: 0.9,
 *   maxCellSize: 100,
 *   remBase: 16,
 * });
 * ```
 */
export function calculateBoardSize({
    rows,
    cols,
    width,
    height,
    mobile,
    headerOffset,
    boardPadding,
    boardMaxWidth,
    boardSizeFactor,
    maxCellSize,
    remBase,
}: BoardSizeConfig): number {
    const currentHeaderOffset = mobile
        ? headerOffset.mobile
        : headerOffset.desktop;

    const pX = typeof boardPadding === 'number' ? 0 : boardPadding.x;
    const pY = typeof boardPadding === 'number' ? boardPadding : boardPadding.y;

    const maxW = (Math.min(width, boardMaxWidth) - pX) * boardSizeFactor;
    const maxH = (height - currentHeaderOffset - pY) * boardSizeFactor;

    // Note: rows/cols are the base grid dims.
    // For Slant, we use cols+1/rows+1 for divisions.
    const pxSize = Math.min(maxW / cols, maxH / rows, maxCellSize);

    return pxSize / remBase; // rem
}
