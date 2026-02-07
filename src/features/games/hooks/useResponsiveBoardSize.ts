import { useMemo } from 'react';
import { useWindow, useMobile } from '../../../hooks';

interface ResponsiveSizeConfig {
    rows: number;
    cols: number;
    headerOffset: {
        mobile: number;
        desktop: number;
    };
    paddingOffset: number | { x: number; y: number };
    boardMaxWidth: number;
    boardSizeFactor: number;
    maxCellSize: number;
    remBase: number;
}

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
