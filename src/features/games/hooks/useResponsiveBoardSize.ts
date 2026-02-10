import { useMemo } from 'react';

import { useWindow, useMobile } from '../../../hooks';

/**
 * Configuration for responsive board size calculations.
 */
interface ResponsiveSizeConfig {
    /** Number of rows in the grid */
    rows: number;
    /** Number of columns in the grid */
    cols: number;
    /** Header height in rem for available space calculation */
    headerOffset: {
        mobile: number;
        desktop: number;
    };
    /** Padding to subtract from available space */
    paddingOffset: number | { x: number; y: number };
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
 * Custom hook for calculating responsive board cell size.
 *
 * Calculates the largest uniform cell size that fits within the viewport
 * while respecting min/max constraints. Returns size in rem units.
 *
 * @param config - Board sizing configuration
 * @returns Cell size in rem units
 *
 * @example
 * ```tsx
 * const cellSize = useResponsiveBoardSize({
 *   rows: 5,
 *   cols: 5,
 *   headerOffset: { mobile: 56, desktop: 64 },
 *   paddingOffset: 16,
 *   boardMaxWidth: 1200,
 *   boardSizeFactor: 0.9,
 *   maxCellSize: 100,
 *   remBase: 16
 * });
 *
 * return <div style={{ fontSize: `${cellSize}rem` }}>Board</div>;
 * ```
 */
export function useResponsiveBoardSize({
    rows,
    cols,
    headerOffset,
    paddingOffset,
    boardMaxWidth,
    boardSizeFactor,
    maxCellSize,
    remBase,
}: ResponsiveSizeConfig) {
    const { width, height } = useWindow();
    const mobile = useMobile('sm');

    const size = useMemo(() => {
        const currentHeaderOffset = mobile
            ? headerOffset.mobile
            : headerOffset.desktop;

        const pX = typeof paddingOffset === 'number' ? 0 : paddingOffset.x;
        const pY =
            typeof paddingOffset === 'number' ? paddingOffset : paddingOffset.y;

        const maxW = (Math.min(width, boardMaxWidth) - pX) * boardSizeFactor;
        const maxH = (height - currentHeaderOffset - pY) * boardSizeFactor;

        // Note: rows/cols are the base grid dims.
        // For Slant, we use cols+1/rows+1 for divisions.
        const pxSize = Math.min(maxW / cols, maxH / rows, maxCellSize);

        return pxSize / remBase; // rem
    }, [
        width,
        height,
        mobile,
        rows,
        cols,
        headerOffset,
        paddingOffset,
        boardMaxWidth,
        boardSizeFactor,
        maxCellSize,
        remBase,
    ]);

    return size;
}
