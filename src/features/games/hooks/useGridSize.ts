import { useState, useMemo, useEffect } from 'react';
import { useWindow, useMobile } from '../../../hooks';
import { convertPixels } from '../../interpreters/utils/gridUtils';

interface GridSizeConfig {
    storageKey: string;
    defaultSize: number | null;
    minSize?: number;
    maxSize?: number;
    headerOffset: {
        mobile: number;
        desktop: number;
    };
    paddingOffset?: number;
    widthLimit?: number;
    cellSizeReference: number | { mobile: number; desktop: number };
    mobileRowOffset?: number;
}

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
        return {
            rows: Math.min(desiredSize, dynamicSize.rows),
            cols: Math.min(desiredSize, dynamicSize.cols),
        };
    }, [desiredSize, dynamicSize]);

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
