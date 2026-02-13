import { useState, useMemo, useEffect } from 'react';

import { useWindow, useMobile } from '../../../hooks';

/**
 * Convert pixel dimensions to grid rows/cols based on cell size
 */
function convertPixels(
    cellSizeRem: number,
    availableHeightPx: number,
    availableWidthPx: number
): { rows: number; cols: number } {
    const remToPx = 16; // 1rem = 16px by default
    const cellSizePx = cellSizeRem * remToPx;
    return {
        rows: Math.floor(availableHeightPx / cellSizePx),
        cols: Math.floor(availableWidthPx / cellSizePx),
    };
}

/**
 * Configuration for grid size calculations and persistence.
 */
interface GridSizeConfig {
    /** localStorage key for persisting user's grid size preference */
    storageKey: string;
    /** Default grid size if no saved preference (null = auto-calculated) */
    defaultSize: number | null;
    /** Minimum allowed grid size (default: 2) */
    minSize?: number;
    /** Maximum allowed grid size (default: 10) */
    maxSize?: number;
    /** Header height in rem for available space calculation */
    headerOffset: {
        mobile: number;
        desktop: number;
    };
    /** Extra padding to subtract from available space (default: 0) */
    paddingOffset?: number;
    /** Maximum viewport width to consider (default: 1300px) */
    widthLimit?: number;
    /** Reference cell size in rem for calculating grid dimensions */
    cellSizeReference: number | { mobile: number; desktop: number };
    /** Extra rows to add on mobile devices (default: 0) */
    mobileRowOffset?: number;
}

/**
 * Custom hook for calculating and managing game grid dimensions.
 *
 * Features:
 * - Responsive grid sizing based on viewport
 * - Persistence of user preferences to localStorage
 * - Separate dynamic (auto) and user-selected sizes
 * - Size increment/decrement controls
 *
 * @param config - Grid sizing configuration
 * @returns Object with current dimensions, handlers, and sizing state
 *
 * @example
 * ```tsx
 * const { rows, cols, handlePlus, handleMinus } = useGridSize({
 *   storageKey: 'slant-size',
 *   defaultSize: null,
 *   minSize: 2,
 *   maxSize: 10,
 *   headerOffset: { mobile: 56, desktop: 64 },
 *   cellSizeReference: 1.5
 * });
 *
 * return (
 *   <div>
 *     <button onClick={handlePlus}>+</button>
 *     Grid: {rows}x{cols}
 *     <button onClick={handleMinus}>-</button>
 *   </div>
 * );
 * ```
 */
export function useGridSize({
    storageKey,
    defaultSize,
    minSize = 2,
    maxSize: _maxSize = 10,
    headerOffset,
    paddingOffset = 0,
    widthLimit = 1300,
    cellSizeReference,
    mobileRowOffset = 0,
}: GridSizeConfig) {
    const { height, width } = useWindow();
    const mobile = useMobile('sm');

    const [desiredSize, setDesiredSize] = useState<number | null>(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved === 'null') return null;
        return saved ? parseInt(saved, 10) : defaultSize;
    });

    const dynamicSize = useMemo(() => {
        const currentHeaderOffset = mobile
            ? headerOffset.mobile
            : headerOffset.desktop;

        const referenceSize =
            typeof cellSizeReference === 'number'
                ? cellSizeReference
                : mobile
                  ? cellSizeReference.mobile
                  : cellSizeReference.desktop;

        const converted = convertPixels(
            referenceSize,
            height - currentHeaderOffset - paddingOffset,
            Math.min(width, widthLimit)
        );

        let r = converted.rows - 1;
        const c = converted.cols - 1;
        if (mobile) r += mobileRowOffset;

        return {
            rows: Math.max(minSize, r),
            cols: Math.max(minSize, c),
        };
    }, [
        cellSizeReference,
        height,
        width,
        mobile,
        headerOffset,
        paddingOffset,
        widthLimit,
        minSize,
        mobileRowOffset,
    ]);

    const { rows, cols } = useMemo(() => {
        if (desiredSize === null) return dynamicSize;

        const extraRows = mobile ? Math.max(0, mobileRowOffset + 1) : 0;
        return {
            rows: Math.min(desiredSize + extraRows, dynamicSize.rows),
            cols: Math.min(desiredSize, dynamicSize.cols),
        };
    }, [desiredSize, dynamicSize, mobile, mobileRowOffset]);

    useEffect(() => {
        localStorage.setItem(storageKey, String(desiredSize));
    }, [desiredSize, storageKey]);

    const handlePlus = () => {
        const currentSize = Math.min(rows, cols);
        if (desiredSize === null) return;

        if (currentSize < Math.min(dynamicSize.rows, dynamicSize.cols)) {
            setDesiredSize(currentSize + 1);
        } else if (
            dynamicSize.rows !== dynamicSize.cols &&
            (rows !== dynamicSize.rows || cols !== dynamicSize.cols)
        ) {
            setDesiredSize(null);
        }
    };

    const handleMinus = () => {
        const currentSize = Math.min(rows, cols);
        if (desiredSize === null) {
            const minDim = Math.min(dynamicSize.rows, dynamicSize.cols);
            if (dynamicSize.rows === dynamicSize.cols) {
                setDesiredSize(Math.max(minSize, minDim - 1));
            } else {
                setDesiredSize(minDim);
            }
        } else if (currentSize > minSize) {
            setDesiredSize(currentSize - 1);
        }
    };

    return {
        rows,
        cols,
        dynamicSize,
        handlePlus,
        handleMinus,
        desiredSize,
        setDesiredSize,
        mobile,
        width,
        height,
        minSize,
        maxSize: _maxSize,
    };
}
